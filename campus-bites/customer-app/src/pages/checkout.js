import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Banknote, CreditCard, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

function generateOrderId() {
  const now = new Date();
  const datePart =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `LNL-${datePart}-${randomPart}`;
}

export default function Checkout() {
  const router = useRouter();
  const { cart, getTotal } = useCart();
  const { user, sendEmailOTP, verifyEmailOTP } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (cart.length === 0) router.push('/cart');
  }, [user, cart]);

  const handleSendOtp = async () => {
    setOtpLoading(true);
    try {
      await sendEmailOTP(user.email);
      setOtpSent(true);
    } catch (e) {}
    finally { setOtpLoading(false); }
  };

  const handleVerifyAndPay = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) { toast.error('Enter 6-digit OTP'); return; }
    setOtpLoading(true);
    try {
      await verifyEmailOTP(otpString);
      setShowOtpModal(false);
      if (paymentMethod === 'cod') {
        router.push('/payment?method=cod');
      } else if (paymentMethod === 'cashfree') {
        const uniqueOrderId = generateOrderId();
        const rawPhone = (user.phone || user.phoneNumber || '9999999999').replace(/^\+91/, '').replace(/\D/g, '').slice(-10).padStart(10, '9');
        sessionStorage.setItem('pendingCashfreeOrder', JSON.stringify({
          orderId: uniqueOrderId,
          items: cart,
          totalAmount: getTotal().toFixed(2),
          customerName: user.displayName || user.name || 'Customer',
          customerEmail: user.email,
          customerId: user.uid,
          customerPhone: rawPhone,
        }));
        router.push('/cashfree-payment');
      }
    } catch (e) { setOtp(['', '', '', '', '', '']); }
    finally { setOtpLoading(false); }
  };

  const handlePayment = () => {
    setShowOtpModal(true);
    handleSendOtp();
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const totalAmount = getTotal().toFixed(2);

  return (
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
              <span className="font-semibold text-white">&#8377;{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between py-3 font-bold text-lg mt-4 border-t border-gray-700">
            <span className="text-gray-300">Total:</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E94E24] to-red-400">&#8377;{totalAmount}</span>
          </div>
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm font-semibold">&#10003; Tax included in displayed price</p>
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
          <div className="space-y-4">
            <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
              paymentMethod === 'cod' ? 'border-[#E94E24] bg-[#E94E24]/10' : 'border-gray-700 hover:border-gray-600'
            }`}>
              <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-[#E94E24]" />
              <Banknote className="text-green-400" size={28} />
              <div>
                <p className="font-semibold text-base sm:text-lg text-white">Cash on Delivery</p>
                <p className="text-sm text-gray-400">Pay when you receive your order</p>
              </div>
            </label>

            <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
              paymentMethod === 'cashfree' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600'
            }`}>
              <input type="radio" name="payment" value="cashfree" checked={paymentMethod === 'cashfree'}
                onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-blue-500" />
              <CreditCard className="text-blue-400" size={28} />
              <div>
                <p className="font-semibold text-base sm:text-lg text-white">Pay Online</p>
                <p className="text-sm text-gray-400">UPI &middot; Cards &middot; Net Banking via Cashfree</p>
              </div>
            </label>
          </div>
        </div>

        <button onClick={handlePayment} disabled={!paymentMethod}
          className="w-full bg-gradient-to-r from-[#E94E24] to-red-600 text-white py-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-bold text-lg shadow-lg shadow-[#E94E24]/30 disabled:opacity-50 disabled:cursor-not-allowed">
          Place Order →
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
                <input key={index} id={`otp-${index}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:border-green-500 focus:outline-none transition-all" />
              ))}
            </div>
            <div className="space-y-3">
              <button onClick={handleVerifyAndPay} disabled={otpLoading || otp.join('').length !== 6}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-bold disabled:opacity-50">
                {otpLoading ? 'Verifying...' : 'Verify & Place Order'}
              </button>
              <button onClick={() => { setShowOtpModal(false); setOtp(['','','','','','']); setOtpSent(false); }}
                className="w-full bg-gray-800 text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-700">
                Cancel
              </button>
              <button onClick={handleSendOtp} disabled={otpLoading}
                className="w-full text-[#E94E24] py-2 font-semibold hover:text-red-400 disabled:opacity-50">
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
