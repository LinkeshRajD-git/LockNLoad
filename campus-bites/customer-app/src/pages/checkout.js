import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Banknote, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Checkout() {
  const router = useRouter();
  const { cart, getTotal } = useCart();
  const { user, sendPhoneOTP, verifyPhoneOTP } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login?returnUrl=/checkout');
    }
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [user, cart]);

  const handleSendOtp = async () => {
    if (!user?.phone && !user?.phoneNumber) {
      toast.error('Phone number not found. Please update your profile.');
      return;
    }
    setOtpLoading(true);
    try {
      await sendPhoneOTP(user.phone || user.phoneNumber, user.email);
      setOtpSent(true);
    } catch (error) {
      toast.error('Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyAndPay = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    setOtpLoading(true);
    try {
      await verifyPhoneOTP(otpString);
      setShowOtpModal(false);
      // Proceed to payment - COD only
      router.push('/payment?method=cod');
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setOtpLoading(false);
    }
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    // Show OTP verification modal
    setShowOtpModal(true);
    handleSendOtp();
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const totalAmount = getTotal().toFixed(2);

  return (
    <div className="min-h-screen bg-black pt-24 pb-8">
      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart">
            <button className="p-2 bg-gray-900 hover:bg-gray-800 rounded-xl text-white transition-colors">
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
          <div className="flex justify-between py-3 font-bold text-lg mt-4 border-t border-gray-700">
            <span className="text-gray-300">Total:</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E94E24] to-red-400">₹{totalAmount}</span>
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
            <p><span className="font-semibold text-gray-400">Phone:</span> {user?.phone || user?.phoneNumber || 'N/A'}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Payment Method</h2>
          <div className="space-y-4">
            <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
              paymentMethod === 'cod' ? 'border-[#E94E24] bg-[#E94E24]/10' : 'border-gray-700 hover:border-gray-600'
            }`}>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 accent-[#E94E24]"
              />
              <Banknote className="text-green-400" size={28} />
              <div>
                <p className="font-semibold text-base sm:text-lg text-white">Cash on Delivery</p>
                <p className="text-sm text-gray-400">Pay when you receive your order</p>
              </div>
            </label>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={!paymentMethod}
          className="w-full bg-gradient-to-r from-[#E94E24] to-red-600 text-white py-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-bold text-lg shadow-lg shadow-[#E94E24]/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:transform-none"
        >
          Place Order →
        </button>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5 sm:p-8 max-w-md w-full animate-scaleIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ShieldCheck size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Verify Your Order</h3>
              <p className="text-gray-400">Enter the 6-digit OTP sent to your phone & email</p>
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
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl text-white focus:border-green-500 focus:outline-none transition-all"
                />
              ))}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleVerifyAndPay}
                disabled={otpLoading || otp.join('').length !== 6}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-bold disabled:opacity-50 transition-all hover:from-green-600 hover:to-emerald-600"
              >
                {otpLoading ? 'Verifying...' : 'Verify & Pay'}
              </button>
              <button
                onClick={() => setShowOtpModal(false)}
                className="w-full bg-gray-800 text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSendOtp}
                disabled={otpLoading}
                className="w-full text-[#E94E24] py-2 font-semibold hover:text-red-400 transition-colors disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
