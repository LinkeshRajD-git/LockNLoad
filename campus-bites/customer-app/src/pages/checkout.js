import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, CreditCard, ArrowLeft, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Script from 'next/script';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

function generateOrderId() {
  const now = new Date();
  const datePart =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `LNL-${datePart}-${randomPart}`;
}

async function sendOrderEmail(orderDetails) {
  try {
    await fetch('/api/send-order-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderDetails),
    });
  } catch (e) {
    console.error('Email error:', e);
  }
}

export default function Checkout() {
  const router = useRouter();
  const { cart, getTotal, clearCart } = useCart();
  const { user, sendEmailOTP, verifyEmailOTP } = useAuth();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const processingRef = useRef(false);

  const subtotal = getTotal();
  const discount = subtotal > 299 ? parseFloat((subtotal * 0.10).toFixed(2)) : 0;
  const totalAmount = parseFloat((subtotal - discount).toFixed(2));

  useEffect(() => {
    if (cart.length === 0) router.push('/cart');
  }, [cart]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Razorpay) setSdkReady(true);
  }, []);

  const handleSendOtp = async () => {
    setOtpLoading(true);
    try {
      await sendEmailOTP(user.email);
      setOtpSent(true);
    } catch (e) {}
    finally { setOtpLoading(false); }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleVerifyAndPay = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) { toast.error('Enter 6-digit OTP'); return; }
    setOtpLoading(true);
    try {
      await verifyEmailOTP(otpString);
      setShowOtpModal(false);
      await initiateRazorpayPayment();
    } catch (e) {
      setOtp(['', '', '', '', '', '']);
    } finally {
      setOtpLoading(false);
    }
  };

  const initiateRazorpayPayment = async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    setPayLoading(true);

    try {
      const orderId = generateOrderId();
      const rawPhone = (user.phone || user.phoneNumber || '9999999999')
        .replace(/^\+91/, '').replace(/\D/g, '').slice(-10).padStart(10, '9');

      // 1. Create Razorpay order on server
      const createRes = await fetch('/api/razorpay-create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, orderId }),
      });
      const createData = await createRes.json();

      if (!createRes.ok || !createData.razorpayOrderId) {
        toast.error(createData.message || 'Payment initialization failed');
        processingRef.current = false;
        setPayLoading(false);
        return;
      }

      setPayLoading(false);

      // 2. Open Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: createData.amount,
        currency: createData.currency,
        name: 'Lock N Load',
        description: `Order ${orderId}`,
        order_id: createData.razorpayOrderId,
        prefill: {
          name: user.displayName || user.name || 'Customer',
          email: user.email,
          contact: rawPhone,
        },
        theme: { color: '#E94E24' },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled. Please try again.');
            processingRef.current = false;
          },
        },
        handler: async (response) => {
          // 3. Payment success — save order + send email
          try {
            const orderDoc = await addDoc(collection(db, 'orders'), {
              orderId,
              userId: user.uid,
              userName: user.displayName || user.name || 'Customer',
              userEmail: user.email,
              userPhone: rawPhone,
              items: cart,
              totalAmount,
              discount,
              paymentMethod: 'razorpay',
              razorpayOrderId: createData.razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              orderStatus: 'pending',
              createdAt: serverTimestamp(),
            });

            await sendOrderEmail({
              email: user.email,
              customerName: user.displayName || user.name || 'Customer',
              orderId,
              orderItems: cart,
              totalAmount,
              paymentMethod: 'razorpay',
            });

            clearCart();
            router.push(`/order-confirmation?orderId=${orderDoc.id}&method=razorpay`);
          } catch (err) {
            console.error('Order save error:', err);
            toast.error('Payment done but order save failed. Contact support.');
            processingRef.current = false;
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error(response.error.description || 'Payment failed. Please try again.');
        processingRef.current = false;
        router.push('/checkout');
      });
      rzp.open();
    } catch (err) {
      console.error('Razorpay init error:', err);
      toast.error('Could not initiate payment. Please try again.');
      processingRef.current = false;
      setPayLoading(false);
    }
  };

  const handlePayment = () => {
    setShowOtpModal(true);
    handleSendOtp();
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setSdkReady(true)}
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-black pt-24 pb-8">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/cart">
              <button className="p-2 bg-gray-900 hover:bg-gray-800 rounded-xl text-white">
                <ArrowLeft size={24} />
              </button>
            </Link>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Checkout</h1>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Order Summary</h2>
            {cart.map(item => (
              <div key={item.id} className="flex justify-between py-3 border-b border-gray-800 last:border-b-0">
                <div>
                  <span className="font-semibold text-[#E94E24]">{item.name}</span>
                  <span className="text-gray-400 ml-2">x{item.quantity}</span>
                </div>
                <span className="font-semibold text-white">₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="mt-4 border-t border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal:</span>
                <span className="text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount (10% off):</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-700">
                <span className="text-gray-300">Total:</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E94E24] to-red-400">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm font-semibold">✓ Tax included in displayed price</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Customer Details</h2>
            <div className="space-y-2 text-gray-300">
              <p><span className="font-semibold text-gray-400">Name:</span> {user?.displayName || user?.name || 'N/A'}</p>
              <p><span className="font-semibold text-gray-400">Email:</span> {user?.email}</p>
              <p className="text-xs text-blue-400 mt-1 flex items-center gap-1">
                <Mail size={12} /> OTP for order verification will be sent to this email
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Payment Method</h2>
            <div className="flex items-center gap-4 p-4 border-2 border-[#E94E24] bg-[#E94E24]/10 rounded-xl">
              <CreditCard className="text-[#E94E24]" size={28} />
              <div>
                <p className="font-semibold text-base sm:text-lg text-white">Pay Online via Razorpay</p>
                <p className="text-sm text-gray-400">UPI · Cards · Net Banking · Wallets</p>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={payLoading || !sdkReady}
            className="w-full bg-gradient-to-r from-[#E94E24] to-red-600 text-white py-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-bold text-lg shadow-lg shadow-[#E94E24]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {payLoading ? (
              <><Loader2 size={20} className="animate-spin" /> Processing...</>
            ) : !sdkReady ? (
              <><Loader2 size={20} className="animate-spin" /> Loading Payment...</>
            ) : (
              `Place Order · ₹${totalAmount.toFixed(2)} →`
            )}
          </button>
        </div>

        {/* OTP Modal */}
        {showOtpModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5 sm:p-8 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Verify Your Order</h3>
                <p className="text-gray-400 text-sm">
                  {otpSent ? `OTP sent to ${user?.email}` : 'Sending OTP to your email...'}
                </p>
              </div>
              <div className="flex gap-1.5 sm:gap-2 justify-center mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && index > 0) {
                        document.getElementById(`otp-${index - 1}`)?.focus();
                      }
                    }}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:border-green-500 focus:outline-none transition-all"
                  />
                ))}
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleVerifyAndPay}
                  disabled={otpLoading || otp.join('').length !== 6}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-bold disabled:opacity-50"
                >
                  {otpLoading ? 'Verifying...' : 'Verify & Proceed to Payment'}
                </button>
                <button
                  onClick={() => { setShowOtpModal(false); setOtp(['','','','','','']); setOtpSent(false); }}
                  className="w-full bg-gray-800 text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendOtp}
                  disabled={otpLoading}
                  className="w-full text-[#E94E24] py-2 font-semibold hover:text-red-400 disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
