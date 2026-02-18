import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDocs, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Package, Clock, CheckCircle, XCircle, LogOut, Settings, TrendingUp, AlertCircle, ChefHat, Bell, ToggleLeft, ToggleRight, IndianRupee, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [showAvailability, setShowAvailability] = useState(false);
  const [stats, setStats] = useState({
    pending: 0,
    preparing: 0,
    ready: 0,
    completed: 0
  });
  const [revenueToday, setRevenueToday] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [filter, setFilter] = useState('all');

  const loadMenuItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'menuItems'));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMenuItems(items);
    } catch (error) {
      console.error('Error loading menu items:', error);
    }
  };

  const toggleItemAvailability = async (item) => {
    try {
      const itemRef = doc(db, 'menuItems', item.id);
      await updateDoc(itemRef, { available: !item.available });
      toast.success(`${item.name} is now ${!item.available ? 'available' : 'unavailable'}`);
      loadMenuItems();
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast.error('Failed to update availability');
    }
  };

  useEffect(() => {
    // Check admin authentication
    const isAdmin = localStorage.getItem('adminAuth');
    if (!isAdmin) {
      router.push('/');
      return;
    }

    loadMenuItems();

    // Real-time orders listener
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);

      // Calculate stats
      const newStats = {
        pending: ordersData.filter(o => o.orderStatus === 'pending').length,
        preparing: ordersData.filter(o => o.orderStatus === 'preparing').length,
        ready: ordersData.filter(o => o.orderStatus === 'ready').length,
        completed: ordersData.filter(o => o.orderStatus === 'completed').length
      };
      setStats(newStats);

      // Calculate revenue (exclude cancelled orders)
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const nonCancelledOrders = ordersData.filter(o => o.orderStatus !== 'cancelled');
      const todayRev = nonCancelledOrders
        .filter(o => {
          const d = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
          return d >= todayStart;
        })
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      setRevenueToday(todayRev);
      setTotalRevenue(nonCancelledOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0));

      // Play sound for new pending orders
      if (newStats.pending > 0) {
        document.title = `(${newStats.pending}) New Orders | Admin`;
      } else {
        document.title = 'Admin Dashboard | Lock and Load Fries';
      }
    });

    // Real-time customers listener
    const usersUnsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      setCustomerCount(snapshot.size);
    });

    return () => { unsubscribe(); usersUnsubscribe(); };
  }, [router]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        orderStatus: newStatus,
        updatedAt: new Date()
      });
      toast.success('Order status updated');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-300';
      case 'preparing': return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-300';
      case 'ready': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-300';
      case 'completed': return 'bg-gradient-to-r from-gray-100 to-gray-100 text-gray-700 border border-gray-300';
      case 'cancelled': return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);

  return (
    <div className="min-h-screen relative">
      {/* Fries Background with Dark Overlay */}
      <div className="fries-bg-dark"></div>
      
      {/* Header */}
      <header className="glass-dark shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          {/* Top row: Logo + Logout */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 sm:gap-4">
              <img src="/logo.png" alt="Lock N Load" className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-xl shadow-lg" />
              <div>
                <h1 className="text-lg sm:text-2xl font-black text-white">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Lock N Load Management</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/20 text-red-400 px-3 sm:px-5 py-2 rounded-xl hover:bg-red-500/30 transition-all border border-red-500/30 font-semibold text-sm sm:text-base"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
          {/* Bottom row: Action buttons */}
          <div className="flex gap-2 sm:gap-3 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            {stats.pending > 0 && (
              <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-3 sm:px-4 py-2 rounded-lg border border-yellow-500/30 animate-pulse whitespace-nowrap text-sm">
                <Bell size={16} />
                <span className="font-bold">{stats.pending} new</span>
              </div>
            )}
            <button
              onClick={() => setShowAvailability(!showAvailability)}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl transition-all font-semibold whitespace-nowrap text-sm sm:text-base ${
                showAvailability 
                  ? 'bg-purple-500 text-white shadow-lg' 
                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30'
              }`}
            >
              {showAvailability ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              Availability
            </button>
            <button
              onClick={() => router.push('/menu-management')}
              className="flex items-center gap-2 bg-gradient-to-r from-[#E94E24] to-red-600 text-white px-3 sm:px-5 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg font-semibold whitespace-nowrap text-sm sm:text-base"
            >
              <Settings size={18} />
              Menu
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Product Availability Panel */}
        {showAvailability && (
          <div className="mb-8 glass rounded-2xl p-6 shadow-xl animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <ToggleRight className="text-purple-500" />
              Product Availability
            </h2>
            <p className="text-gray-500 text-sm mb-6">Toggle products on/off — unavailable items won't be orderable by customers.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    item.available 
                      ? 'bg-green-50 border-green-200 hover:border-green-300' 
                      : 'bg-red-50 border-red-200 hover:border-red-300 opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <span className="text-2xl flex-shrink-0">{item.image || '🍟'}</span>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">₹{item.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleItemAvailability(item)}
                    className={`flex-shrink-0 ml-3 w-14 h-7 rounded-full transition-all duration-300 relative ${
                      item.available ? 'bg-green-500' : 'bg-red-400'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                      item.available ? 'left-7' : 'left-0.5'
                    }`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Key Metrics - Revenue, Orders, Customers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6">
          <div className="glass rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 animate-slide-up" style={{animationDelay: '0.05s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1 font-medium">Today's Revenue</p>
                <p className="text-3xl sm:text-4xl font-black text-[#E94E24] animate-count-up">
                  {revenueToday >= 1000 ? `₹${(revenueToday / 1000).toFixed(1)}K` : `₹${revenueToday}`}
                </p>
                <p className="text-xs text-gray-400 mt-1">Total: ₹{totalRevenue >= 1000 ? `${(totalRevenue / 1000).toFixed(1)}K` : totalRevenue}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#E94E24] to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <IndianRupee size={28} className="text-white" />
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1 font-medium">Total Orders</p>
                <p className="text-3xl sm:text-4xl font-black text-blue-500 animate-count-up">{orders.length}</p>
                <p className="text-xs text-gray-400 mt-1">Active: {stats.pending + stats.preparing + stats.ready}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Package size={28} className="text-white" />
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 animate-slide-up" style={{animationDelay: '0.15s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1 font-medium">Signed-in Customers</p>
                <p className="text-3xl sm:text-4xl font-black text-purple-500 animate-count-up">{customerCount}</p>
                <p className="text-xs text-gray-400 mt-1">Registered users</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Users size={28} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-8">
          <div className="glass rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">Pending</p>
                <p className="text-3xl font-black text-yellow-600 animate-count-up">{stats.pending}</p>
              </div>
              <div className="w-11 h-11 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock size={22} className="text-white" />
              </div>
            </div>
            <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-500" style={{width: `${Math.min(stats.pending * 10, 100)}%`}}></div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 animate-slide-up" style={{animationDelay: '0.25s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">Preparing</p>
                <p className="text-3xl font-black text-blue-600 animate-count-up">{stats.preparing}</p>
              </div>
              <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <ChefHat size={22} className="text-white" />
              </div>
            </div>
            <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500" style={{width: `${Math.min(stats.preparing * 10, 100)}%`}}></div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">Ready</p>
                <p className="text-3xl font-black text-green-600 animate-count-up">{stats.ready}</p>
              </div>
              <div className="w-11 h-11 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle size={22} className="text-white" />
              </div>
            </div>
            <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500" style={{width: `${Math.min(stats.ready * 10, 100)}%`}}></div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 animate-slide-up" style={{animationDelay: '0.35s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">Completed</p>
                <p className="text-3xl font-black text-gray-700 animate-count-up">{stats.completed}</p>
              </div>
              <div className="w-11 h-11 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp size={22} className="text-white" />
              </div>
            </div>
            <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gray-400 to-gray-600 transition-all duration-500" style={{width: `${Math.min(stats.completed * 5, 100)}%`}}></div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'preparing', 'ready', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2 rounded-xl font-semibold capitalize transition-all ${
                filter === status 
                  ? 'bg-gradient-to-r from-[#E94E24] to-red-500 text-white shadow-lg' 
                  : 'glass text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status} {status !== 'all' && `(${stats[status] || 0})`}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="glass rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Package className="text-[#E94E24]" />
            {filter === 'all' ? 'All Orders' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Orders`}
          </h2>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🍟</div>
              <p className="text-gray-500 text-lg">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => (
                <div key={order.id} className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all hover:border-[#E94E24]/30 animate-slide-up" style={{animationDelay: `${0.5 + index * 0.05}s`}}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-black text-xl text-gray-800">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-gray-600 font-medium">{order.userName}</p>
                      <p className="text-gray-500 text-sm">📞 {order.userPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-3xl gradient-text">₹{order.totalAmount}</p>
                      <p className="text-sm text-gray-500 font-medium">
                        {order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '📱 UPI Paid'}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 bg-gray-100 rounded-xl p-4">
                    <p className="font-bold text-sm text-gray-700 mb-2">🍴 Order Items:</p>
                    <div className="space-y-1">
                      {order.items?.map((item, idx) => (
                        <p key={idx} className="text-gray-600 flex justify-between">
                          <span>{item.name} × {item.quantity}</span>
                          <span className="font-semibold">₹{item.price * item.quantity}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus?.toUpperCase()}
                    </span>

                    <div className="flex gap-2 flex-wrap">
                      {order.orderStatus === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-xl hover:from-blue-600 hover:to-indigo-600 text-sm font-bold shadow-lg transition-all transform hover:scale-105"
                        >
                          👨‍🍳 Start Preparing
                        </button>
                      )}
                      {order.orderStatus === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-2 rounded-xl hover:from-green-600 hover:to-emerald-600 text-sm font-bold shadow-lg transition-all transform hover:scale-105"
                        >
                          ✅ Mark Ready
                        </button>
                      )}
                      {order.orderStatus === 'ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-5 py-2 rounded-xl hover:from-gray-800 hover:to-gray-900 text-sm font-bold shadow-lg transition-all transform hover:scale-105"
                        >
                          🎉 Complete Order
                        </button>
                      )}
                      {order.orderStatus !== 'completed' && order.orderStatus !== 'cancelled' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="bg-red-500/10 text-red-500 border border-red-200 px-5 py-2 rounded-xl hover:bg-red-500/20 text-sm font-bold transition-all"
                        >
                          ✖ Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
