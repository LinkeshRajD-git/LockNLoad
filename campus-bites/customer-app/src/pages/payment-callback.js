import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useCart } from '../context/CartContext';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCallback() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('processing'); // processing, success, failed
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (router.isReady) {
      handlePaymentCallback();
    }
  }, [router.isReady]);

  const handlePaymentCallback = async () => {
    try {
      const { transactionId, code } = router.query;
      const paymentSuccess = code === 'PAYMENT_SUCCESS';

      if (!transactionId) {
        setStatus('failed');
        return;
      }

      // Find the order by transaction ID
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('transactionId', '==', transactionId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setStatus('failed');
        return;
      }

      const orderDoc = snapshot.docs[0];
      const orderData = orderDoc.data();

      if (paymentSuccess) {
        // Update order payment status
        await updateDoc(doc(db, 'orders', orderDoc.id), {
          paymentStatus: 'completed',
          updatedAt: new Date()
        });

        // Send confirmation SMS now that payment is successful
        if (orderData.userPhone) {
          try {
            await fetch('/api/send-order-sms', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                phone: orderData.userPhone,
                customerName: orderData.userName,
                orderId: orderData.orderId,
                orderItems: orderData.items,
                totalAmount: orderData.totalAmount,
                paymentMethod: 'upi'
              })
            });
          } catch (smsError) {
            console.error('SMS send failed:', smsError);
          }
        }

        setOrderId(orderDoc.id);
        setStatus('success');
        clearCart();
      } else {
        // Payment failed
        await updateDoc(doc(db, 'orders', orderDoc.id), {
          paymentStatus: 'failed',
          orderStatus: 'cancelled',
          updatedAt: new Date()
        });
        setStatus('failed');
      }
    } catch (error) {
      console.error('Payment callback error:', error);
      setStatus('failed');
    }
  };

  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center relative z-10">
          <div className="w-20 h-20 bg-gradient-to-r from-[#E94E24] to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-[#E94E24]/30 animate-pulse mx-auto mb-6">
            <Loader2 size={40} className="text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verifying Payment...</h2>
          <p className="text-gray-400">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center relative z-10 max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg mx-auto mb-6">
            <XCircle size={48} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Payment Failed</h2>
          <p className="text-gray-400 mb-8">Your payment could not be processed. Please try again.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/checkout">
              <button className="w-full sm:w-auto bg-gradient-to-r from-[#E94E24] to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all">
                Try Again
              </button>
            </Link>
            <Link href="/">
              <button className="w-full sm:w-auto bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all">
                Go Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center relative z-10 max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 mx-auto mb-6 animate-bounce">
          <CheckCircle size={48} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Order Confirmed! 🎉</h2>
        <p className="text-gray-400 mb-2">Your order has been placed successfully.</p>
        <p className="text-green-400 text-sm mb-8">A confirmation SMS has been sent to your phone.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/order-confirmation?orderId=${orderId}&method=upi`}>
            <button className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all">
              View Order Details
            </button>
          </Link>
          <Link href="/orders">
            <button className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all">
              Track Order
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
