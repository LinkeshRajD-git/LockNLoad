import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function OTPVerification({ phone, onSuccess }) {
  const { verifyPhoneOTP, sendPhoneOTP } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      await verifyPhoneOTP(otp);
      toast.success('Phone verified successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await sendPhoneOTP(phone);
      toast.success('OTP resent successfully!');
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Verify OTP
      </h2>
      
      <p className="text-gray-600 text-center mb-6">
        We've sent a 6-digit code to your phone number<br />
        <span className="font-semibold">{phone}</span>
      </p>
      
      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94E24] text-center text-2xl font-bold tracking-widest"
            placeholder="000000"
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full bg-[#E94E24] text-white py-3 rounded-lg hover:bg-red-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <button
        onClick={handleResend}
        className="w-full mt-4 text-[#E94E24] font-semibold hover:underline"
      >
        Resend OTP
      </button>

      <div id="recaptcha-container"></div>
    </div>
  );
}
