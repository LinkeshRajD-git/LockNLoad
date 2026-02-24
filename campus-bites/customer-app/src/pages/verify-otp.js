import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VerifyOTP() {
  const router = useRouter();
  const { phone } = router.query;
  const { user } = useAuth();
  const displayPhone = phone ? (phone.startsWith('+') ? phone : `+91 ${phone}`) : '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  // Redirect if already logged in
  useEffect(() => {
    if (user && user.isVerified) {
      router.push('/');
    }
  }, [user, router]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    // OTP verification disabled — treat as verified and redirect
    toast.success('Phone verified (OTP disabled)');
    router.push('/');
  };

  const handleResend = async () => {
    if (!phone) {
      toast.error('Phone number missing');
      return;
    }
    setResending(true);
    // OTP sending disabled
    toast('OTP functionality is disabled');
    setResending(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-20 w-72 h-72 bg-green-500/20 rounded-full filter blur-3xl animate-float"></div>
      <div className="absolute bottom-10 right-20 w-72 h-72 bg-[#E94E24]/20 rounded-full filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl p-10 max-w-md w-full animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h2 className="text-4xl font-black gradient-text mb-2">Verify OTP</h2>
          <p className="text-gray-400">
            Enter the 6-digit code sent to<br />
            <span className="font-bold text-white">{displayPhone || 'your phone'}</span>
          </p>
        </div>
        
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                maxLength={1}
                className="w-12 h-14 text-center text-2xl font-bold bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-green-500 focus:bg-gray-800 text-white transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-[1.02] font-bold text-lg shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </span>
            ) : (
              'Verify & Continue ✓'
            )}
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={resending}
          className="w-full mt-6 flex items-center justify-center gap-2 text-[#E94E24] font-bold hover:text-red-400 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} className={resending ? 'animate-spin' : ''} />
          {resending ? 'Sending...' : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
}