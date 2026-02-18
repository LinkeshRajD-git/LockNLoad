import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const { login, user, signInWithGoogle, signInWithApple } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      const returnUrl = router.query.returnUrl || '/';
      router.push(returnUrl);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show nothing while redirecting
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#E94E24]/20 rounded-full filter blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-red-500/20 rounded-full filter blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
      
      <div className="relative z-10 bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl p-10 max-w-md w-full animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-[#E94E24] to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#E94E24]/30">
            <LogIn size={40} className="text-white" />
          </div>
          <h2 className="text-4xl font-black gradient-text mb-2">Welcome Back!</h2>
          <p className="text-gray-400">Login to continue ordering</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#E94E24]" size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-[#E94E24] focus:bg-gray-800 text-white placeholder-gray-400 transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#E94E24]" size={20} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-[#E94E24] focus:bg-gray-800 text-white placeholder-gray-400 transition-all"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#E94E24] to-red-600 text-white py-4 rounded-xl hover:from-red-700 hover:to-red-700 transition-all transform hover:scale-[1.02] font-bold text-lg shadow-lg shadow-[#E94E24]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </span>
            ) : (
              'Login 🍟'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-900 px-4 text-gray-400">or continue with</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <button
            onClick={async () => {
              try {
                const result = await signInWithGoogle();
                if (result) {
                  const returnUrl = router.query.returnUrl || '/';
                  router.push(returnUrl);
                }
              } catch (e) { /* handled in context */ }
            }}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3.5 rounded-xl hover:bg-gray-100 transition-all font-semibold text-lg shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Sign in with Google
          </button>
          <button
            onClick={async () => {
              try {
                const result = await signInWithApple();
                if (result) {
                  const returnUrl = router.query.returnUrl || '/';
                  router.push(returnUrl);
                }
              } catch (e) { /* handled in context */ }
            }}
            className="w-full flex items-center justify-center gap-3 bg-black text-white py-3.5 rounded-xl hover:bg-gray-900 transition-all font-semibold text-lg shadow-lg border border-gray-700"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.55.12 2.71.74 3.45 1.85-3.17 1.87-2.42 6.03.58 7.18-.68 1.8-1.56 3.57-2.68 4.98zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-1.96 4.34-3.74 4.25z"/></svg>
            Sign in with Apple
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#E94E24] font-bold hover:text-red-400 hover:underline transition-colors">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
