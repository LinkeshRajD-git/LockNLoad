import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Package, Clock, CheckCircle, XCircle, Truck, ChefHat, ArrowLeft, User, Phone, Mail, Hash, CreditCard, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function Orders() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login?returnUrl=/orders');
      return;
    }

    // Real-time listener — no orderBy so no composite index needed
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date()
        }))
        .sort((a, b) => b.createdAt - a.createdAt); // newest first
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error('Error loading orders:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-400" size={20} />;
      case 'preparing':
        return <ChefHat className="text-blue-400" size={20} />;
      case 'ready':
        return <Package className="text-purple-400" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-400" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'preparing':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'ready':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'delivered':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-[#E94E24] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-8">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <button className="p-2 bg-gray-900 hover:bg-gray-800 rounded-xl text-white transition-colors">
              <ArrowLeft size={24} />
            </button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">My Orders</h1>
            <p className="text-gray-400">Track your order history</p>
          </div>
        </div>

        {/* User Profile Card */}
        {user && (
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 sm:p-6 mb-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <User size={20} className="text-[#E94E24]" />
              Your Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 bg-gray-800/50 rounded-xl p-3">
                <User size={18} className="text-[#E94E24] shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Name</p>
                  <p className="text-sm font-semibold text-white truncate">{user.displayName || user.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-800/50 rounded-xl p-3">
                <Phone size={18} className="text-green-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-sm font-semibold text-white truncate">{user.phone || user.phoneNumber || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-800/50 rounded-xl p-3">
                <Mail size={18} className="text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="bg-[#E94E24]/10 border border-[#E94E24]/30 rounded-lg px-4 py-2">
                <span className="text-[#E94E24] text-sm font-bold">📦 {orders.length} Total Orders</span>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
                <span className="text-green-400 text-sm font-bold">
                  💰 ₹{orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toFixed(0)} Spent
                </span>
              </div>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <Package size={80} className="text-gray-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No orders yet</h2>
            <p className="text-gray-400 mb-6">Start ordering delicious loaded fries!</p>
            <Link href="/loaded-fries">
              <button className="bg-gradient-to-r from-[#E94E24] to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-600 transition-all shadow-lg shadow-[#E94E24]/30">
                Browse Menu 🍟
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all"
              >
                {/* Order Header - Always visible */}
                <div 
                  className="p-4 sm:p-6 cursor-pointer"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Hash size={14} className="text-[#E94E24]" />
                        <p className="text-sm font-mono font-bold text-[#E94E24]">
                          {order.orderId || `#${order.id.slice(-8).toUpperCase()}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-gray-500" />
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      <span className="text-sm font-semibold capitalize">{order.orderStatus}</span>
                    </div>
                  </div>

                  {/* Quick summary */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        order.paymentMethod === 'cod'
                          ? 'bg-green-500/10 text-green-400 border-green-500/30'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      }`}>
                        {order.paymentMethod === 'cod' ? '💵 COD' : '💳 Online'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        order.paymentStatus === 'completed' 
                          ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                      }`}>
                        {order.paymentStatus === 'completed' ? '✓ Paid' : '⏳ Pending'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E94E24] to-red-400">
                        ₹{order.totalAmount?.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Expand indicator */}
                  <div className="mt-3 text-center">
                    <span className={`text-xs text-gray-500 transition-transform inline-block ${expandedOrder === order.id ? 'rotate-180' : ''}`}>
                      {expandedOrder === order.id ? '▲ Hide Details' : '▼ View Details'}
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="border-t border-gray-800 p-4 sm:p-6 bg-black/50">
                    {/* Customer Details */}
                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                        <User size={14} className="text-[#E94E24]" />
                        Customer Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User size={14} className="text-gray-500" />
                          <span className="text-gray-400">Name:</span>
                          <span className="text-white font-medium">{order.userName || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={14} className="text-gray-500" />
                          <span className="text-gray-400">Phone:</span>
                          <span className="text-white font-medium">{order.userPhone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm sm:col-span-2">
                          <Mail size={14} className="text-gray-500" />
                          <span className="text-gray-400">Email:</span>
                          <span className="text-white font-medium">{order.userEmail || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                        <Package size={14} className="text-[#E94E24]" />
                        Items Ordered
                      </h3>
                      <div className="bg-gray-900/50 rounded-xl p-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between py-2 border-b border-gray-800 last:border-b-0">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-400' : 'bg-red-400'}`}></span>
                              <span className="text-[#E94E24] font-medium text-sm">{item.name}</span>
                              <span className="text-gray-500 text-xs">x{item.quantity}</span>
                            </div>
                            <span className="text-white font-medium text-sm">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-900/50 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <CreditCard size={14} className="text-purple-400" />
                        <span className="text-sm text-gray-400">Payment:</span>
                        <span className="text-sm text-white font-medium">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'cashfree' ? 'Cashfree (Online)' : 'Online Payment'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hash size={14} className="text-[#E94E24]" />
                        <span className="text-sm text-gray-400">Order ID:</span>
                        <span className="text-sm font-mono text-[#E94E24] font-bold">
                          {order.orderId || order.id.slice(0, 12)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
