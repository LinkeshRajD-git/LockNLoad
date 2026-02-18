import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Shield, Mail, Lock, Zap, ChefHat, TrendingUp, Package, Users } from 'lucide-react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [liveStats, setLiveStats] = useState({
    ordersToday: 0,
    revenue: 0,
    customers: 0
  });

  useEffect(() => {
    setMounted(true);
    // Check if already logged in
    const isAdmin = localStorage.getItem('adminAuth');
    if (isAdmin) {
      router.push('/dashboard');
    }

    // Real-time orders listener for today's stats
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const ordersUnsubscribe = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const todayOrders = allOrders.filter(order => {
          const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
          return orderDate >= todayStart;
        });
        const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        setLiveStats(prev => ({
          ...prev,
          ordersToday: todayOrders.length,
          revenue: totalRevenue
        }));
      }
    );

    // Real-time customers listener
    const usersUnsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        setLiveStats(prev => ({ ...prev, customers: snapshot.size }));
      }
    );

    return () => {
      ordersUnsubscribe();
      usersUnsubscribe();
    };
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
      localStorage.setItem('adminAuth', 'true');
      toast.success('Welcome back, Admin! 🎉');
      router.push('/dashboard');
    } else {
      toast.error('Invalid credentials');
      setLoading(false);
    }
  };

  const formatRevenue = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  const stats = [
    { icon: <Package size={20} />, label: 'Orders Today', value: String(liveStats.ordersToday) },
    { icon: <TrendingUp size={20} />, label: 'Revenue', value: formatRevenue(liveStats.revenue) },
    { icon: <Users size={20} />, label: 'Customers', value: String(liveStats.customers) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fries Background with Dark Overlay */}
      <div className="fries-bg-dark"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#E94E24]/10 rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-600/10 rounded-full filter blur-[100px] animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-20 text-[#E94E24]/10 animate-float hidden lg:block">
        <Zap size={80} />
      </div>
      <div className="absolute bottom-20 right-20 text-[#E94E24]/10 animate-float hidden lg:block" style={{animationDelay: '1.5s'}}>
        <ChefHat size={80} />
      </div>
      <div className="absolute top-1/3 right-1/4 text-[#E94E24]/5 animate-float hidden lg:block" style={{animationDelay: '2s'}}>
        <Shield size={120} />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className={`hidden lg:block space-y-8 ${mounted ? 'animate-slide-in-left' : 'opacity-0'}`}>
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#E94E24] to-red-600 rounded-2xl blur-xl opacity-60"></div>
                <img src="/logo.png" alt="Lock N Load" className="relative w-16 h-16 object-cover rounded-2xl shadow-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">Lock N Load</h1>
                <p className="text-gray-400">Admin Control Center</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-black text-white mb-4">
              Manage Your <span className="gradient-text">Business</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Access your dashboard to manage orders, update menu items, track revenue, and keep your customers happy.
            </p>
          </div>

          {/* Quick Stats Preview */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="glass-card rounded-2xl p-4 text-center"
                style={{animationDelay: `${0.3 + index * 0.1}s`}}
              >
                <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-br from-[#E94E24]/20 to-red-600/20 rounded-xl flex items-center justify-center text-[#E94E24]">
                  {stat.icon}
                </div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <div className="flex -space-x-2">
              {['🧑‍🍳', '👨‍💼', '👩‍💻'].map((emoji, i) => (
                <div key={i} className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center border-2 border-black text-sm">
                  {emoji}
                </div>
              ))}
            </div>
            <span>Trusted by 50+ restaurant partners</span>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className={`${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
          <div className="glass-dark rounded-3xl shadow-2xl p-8 lg:p-10 border border-white/5">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-block relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-[#E94E24] to-red-500 rounded-2xl blur-xl opacity-50"></div>
                <div className="relative w-20 h-20 bg-gradient-to-r from-[#E94E24] to-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                  <span className="text-4xl">🍟</span>
                </div>
              </div>
              <h1 className="text-2xl font-black text-white">Admin Portal</h1>
              <p className="text-gray-500">Lock and Load Fries</p>
            </div>

            <div className="hidden lg:block mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#E94E24] to-red-500 rounded-xl flex items-center justify-center">
                  <Shield size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Welcome Back</h2>
                  <p className="text-gray-500">Sign in to continue</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-[#E94E24] transition-colors" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="input-dark pl-12"
                    placeholder="admin@locknload.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-[#E94E24] transition-colors" size={20} />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="input-dark pl-12"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#E94E24] via-red-500 to-red-600 text-white py-4 rounded-xl 
                         hover:from-red-600 hover:via-red-600 hover:to-red-700 transition-all duration-300 
                         transform hover:scale-[1.02] hover:shadow-xl hover:shadow-[#E94E24]/25
                         font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         animate-gradient-x mt-6"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Shield size={20} />
                    Access Dashboard
                  </span>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-900">
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Secure admin access • 256-bit encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
