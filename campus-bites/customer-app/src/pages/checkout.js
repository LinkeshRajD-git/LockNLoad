import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, CreditCard, ArrowLeft, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
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
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiId] = useState('linkeshrajd@obsbi');
  const [qrUrl, setQrUrl] = useState('');
  const [utr, setUtr] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const processingRef = useRef(false);

  const subtotal = getTotal();
  const discount = subtotal > 299 ? parseFloat((subtotal * 0.10).toFixed(2)) : 0;
  const totalAmount = parseFloat((subtotal - discount).toFixed(2));

  useEffect(() => {
    if (cart.length === 0) router.push('/cart');
  }, [cart]);

  useEffect(() => {
    // generate UPI QR whenever UPI id or total changes
    const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('Lock N Load')}&am=${totalAmount.toFixed(2)}&cu=INR`;
    QRCode.toDataURL(upiString)
      .then(url => setQrUrl(url))
      .catch(() => setQrUrl(''));
  }, [upiId, totalAmount]);

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
      // only UPI payment available now
      setShowUpiModal(true);
      setOtp(['', '', '', '', '', '']);
    } catch (e) {
      setOtp(['', '', '', '', '', '']);
    } finally {
      setOtpLoading(false);
    }
  };

  

  const handlePayment = () => {
    setShowOtpModal(true);
    handleSendOtp();
  };

  const handleConfirmUpi = async () => {
    if (!utr || utr.trim().length < 3) {
      toast.error('Enter valid payment UTR/Transaction ID');
      return;
    }
    setPayLoading(true);
    try {
      const orderId = generateOrderId();
      const rawPhone = (user.phone || user.phoneNumber || '9999999999')
        .replace(/^\+91/, '').replace(/\D/g, '').slice(-10).padStart(10, '9');

      const orderDoc = await addDoc(collection(db, 'orders'), {
        orderId,
        userId: user.uid,
        userName: user.displayName || user.name || 'Customer',
        userEmail: user.email,
        userPhone: rawPhone,
        items: cart,
        totalAmount,
        discount,
        paymentMethod: 'upi',
        upiId,
        upiPaymentId: utr.trim(),
        orderStatus: 'pending',
        createdAt: serverTimestamp(),
      });

      await sendOrderEmail({
        email: user.email,
        customerName: user.displayName || user.name || 'Customer',
        orderId,
        orderItems: cart,
        totalAmount,
        paymentMethod: 'UPI',
        upiId,
        upiPaymentId: utr.trim(),
      });

      clearCart();
      setShowUpiModal(false);
      setUtr('');
      router.push(`/order-confirmation?orderId=${orderDoc.id}&method=upi`);
    } catch (err) {
      console.error('UPI order save error:', err);
      toast.error('Could not save order. Contact support.');
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <>
      {/* UPI only — no external payment SDK */}

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
              <div className="space-y-3">
                <div className="p-3 border border-gray-800 rounded-xl bg-gray-900/60">
                  <p className="text-gray-300 mb-2">Pay via UPI</p>
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-800 p-3 rounded-lg">
                    <div className="flex-1">
                      <p className="font-mono text-white font-semibold">{upiId}</p>
                      <p className="text-xs text-gray-400">Amount: ₹{totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {qrUrl && <img src={qrUrl} alt="UPI QR" className="w-20 h-20 bg-white rounded-md" />}
                      <div className="flex flex-col gap-2">
                        <button onClick={() => { navigator.clipboard?.writeText(upiId); toast.success('UPI copied'); }} className="text-sm text-[#E94E24] font-semibold">Copy</button>
                        <button onClick={() => setShowUpiModal(true)} className="bg-[#E94E24] text-white px-3 py-2 rounded-lg text-sm">I have paid</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={payLoading}
            className="w-full bg-gradient-to-r from-[#E94E24] to-red-600 text-white py-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-bold text-lg shadow-lg shadow-[#E94E24]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {payLoading ? (
              <><Loader2 size={20} className="animate-spin" /> Processing...</>
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
        {/* UPI Confirmation Modal */}
        {showUpiModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5 sm:p-8 max-w-md w-full">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">Confirm UPI Payment</h3>
                <p className="text-gray-400 text-sm">Pay using your UPI app to the ID below, then paste the transaction ID (UTR/Ref) here.</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <p className="text-gray-300 text-sm">UPI ID</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="font-mono text-white font-semibold">{upiId}</p>
                  <button onClick={() => { navigator.clipboard?.writeText(upiId); toast.success('UPI copied'); }} className="text-sm text-[#E94E24] font-semibold">Copy</button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Amount: ₹{totalAmount.toFixed(2)}</p>
              </div>
              <div className="space-y-3">
                <input value={utr} onChange={(e) => setUtr(e.target.value)} placeholder="Enter UTR / Transaction ID" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none" />
                <button onClick={handleConfirmUpi} disabled={payLoading} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-bold disabled:opacity-50">{payLoading ? 'Confirming...' : 'Confirm Payment & Place Order'}</button>
                <button onClick={() => setShowUpiModal(false)} className="w-full bg-gray-800 text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-700">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
