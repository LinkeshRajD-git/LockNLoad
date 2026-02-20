import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CheckCircle, Loader2, Package, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmation() {
  const router = useRouter();
  const { orderId, method } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (orderDoc.exists()) {
        setOrder({ id: orderDoc.id, ...orderDoc.data() });
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={64} className="animate-spin text-[#E94E24]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-800 p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 animate-bounce">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed! 🎉</h1>
          <p className="text-gray-400 mb-6">Thank you for your order. We'll prepare it right away!</p>

          {/* Email Confirmation Banner */}
          {order?.userEmail && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6 flex items-center gap-3 justify-center">
              <MessageSquare size={20} className="text-blue-400" />
              <p className="text-blue-300 text-sm font-semibold">
                Confirmation email sent to {order.userEmail}
              </p>
            </div>
          )}

          {order && (
            <>
              <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 text-left border border-gray-700">
                <h2 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                  <span className="text-xl">📋</span> Order Details
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Order ID:</span>
                    <span className="font-mono text-sm text-[#E94E24] bg-gray-900 px-3 py-1 rounded-lg font-bold">
                      {order.orderId || order.id.slice(0, 8) + '...'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Customer:</span>
                    <span className="font-semibold text-white">{order.userName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Phone:</span>
                    <span className="font-semibold text-white">{order.userPhone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Payment Method:</span>
                    <span className={`font-semibold px-3 py-1 rounded-lg text-sm ${
                      method === 'cod' 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {method === 'razorpay' ? '💳 Razorpay (Online)' : '💳 Online Payment'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Amount:</span>
                    <span className="font-bold text-xl text-[#E94E24]">₹{order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Status:</span>
                    <span className="font-semibold text-yellow-400 capitalize bg-yellow-500/20 px-3 py-1 rounded-lg text-sm">
                      ⏳ {order.orderStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 text-left border border-gray-700">
                <h2 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                  <span className="text-xl">🍟</span> Items
                </h2>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-3 border-b border-gray-700 last:border-b-0">
                    <div>
                      <span className="font-semibold text-white">{item.name}</span>
                      <span className="text-gray-400 ml-2">×{item.quantity}</span>
                    </div>
                    <span className="font-semibold text-[#E94E24]">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="space-y-3 mb-8">
            <p className="text-gray-400">
              We've sent a confirmation to <span className="font-semibold text-white">{order?.userEmail}</span>
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-yellow-400 font-bold text-sm">
                ⚠️ This order is <span className="text-red-400 underline">NON-CANCELABLE</span> once placed.
              </p>
              <p className="text-yellow-400/80 text-xs mt-1">
                Please contact us at +91 95978 55779 for any concerns.
              </p>
            </div>
            <div className="bg-gradient-to-r from-[#E94E24]/20 to-red-600/20 rounded-xl p-4 border border-[#E94E24]/30">
              <p className="text-red-400 font-medium">
                ⏱️ Estimated preparation time: <span className="text-white font-bold">15-20 minutes</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/orders">
              <button className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:shadow-purple-500/30 transition-all font-semibold flex items-center justify-center gap-2">
                <Package size={20} />
                Track Order
              </button>
            </Link>
            <Link href="/">
              <button className="w-full sm:w-auto bg-gradient-to-r from-[#E94E24] to-red-600 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:shadow-[#E94E24]/30 transition-all font-semibold">
                🏠 Back to Home
              </button>
            </Link>
            <Link href="/loaded-fries">
              <button className="w-full sm:w-auto bg-gray-800 text-white border-2 border-[#E94E24]/30 px-6 py-3 rounded-xl hover:bg-gray-700 transition-all font-semibold">
                🍟 Order More
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
