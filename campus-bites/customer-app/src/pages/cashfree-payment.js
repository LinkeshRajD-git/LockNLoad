import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';
import { Loader2, XCircle } from 'lucide-react';
import Script from 'next/script';
import Link from 'next/link';

async function sendOrderEmail(orderDetails) {
  try {
    await fetch('/api/send-order-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderDetails),
    });
  } catch (e) {
    console.error('Email send failed:', e);
  }
}

export default function CashfreePayment() {
  const router = useRouter();
  const { cart, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [status, setStatus] = useState('loading');
  const [sdkReady, setSdkReady] = useState(false);
  const initiatedRef = useRef(false);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
  }, [user]);

  useEffect(() => {
    if (sdkReady && user && !initiatedRef.current) {
      initiatedRef.current = true;
      initiateCashfreePayment();
    }
  }, [sdkReady, user]);

  const initiateCashfreePayment = async () => {
    try {
      const stored = sessionStorage.getItem('pendingCashfreeOrder');
      if (!stored) { router.push('/checkout'); return; }
      const pending = JSON.parse(stored);

      // 1. Create Cashfree order via our API
      const createRes = await fetch('/api/cashfree-create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: pending.orderId,
          orderAmount: pending.totalAmount,
          customerName: pending.customerName,
          customerEmail: pending.customerEmail,
          customerPhone: pending.customerPhone,
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok || !createData.payment_session_id) {
        console.error('Cashfree create failed:', createData);
        toast.error(createData.message || 'Payment initialization failed');
        setStatus('failed');
        return;
      }

      setStatus('paying');

      // 2. Open Cashfree checkout
      const cashfree = window.Cashfree({ mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === 'production' ? 'production' : 'sandbox' });
      const result = await cashfree.checkout({
        paymentSessionId: createData.payment_session_id,
        redirectTarget: '_modal',
      });

      // 3. After modal closes, verify payment
      if (result.error) {
        console.error('Cashfree payment error:', result.error);
        toast.error('Payment was not completed');
        setStatus('failed');
        return;
      }

      // 4. Verify payment status with our backend
      const verifyRes = await fetch('/api/cashfree-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: pending.orderId }),
      });
      const verifyData = await verifyRes.json();

      if (verifyData.order_status === 'PAID') {
        // 5. Payment successful - create order in Firestore
        const orderData = {
          userId: user.uid,
          userName: pending.customerName,
          userEmail: pending.customerEmail,
          userPhone: pending.customerPhone || '',
          orderId: pending.orderId,
          items: (pending.items || []).map(item => ({
            itemId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            isVeg: item.isVeg,
          })),
          totalAmount: parseFloat(pending.totalAmount),
          paymentMethod: 'cashfree',
          paymentStatus: 'completed',
          orderStatus: 'pending',
          otpVerified: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, 'orders'), orderData);

        // 6. Send order confirmation email
        if (pending.customerEmail) {
          await sendOrderEmail({
            email: pending.customerEmail,
            customerName: pending.customerName,
            orderId: pending.orderId,
            orderItems: orderData.items,
            totalAmount: pending.totalAmount,
            paymentMethod: 'cashfree',
          });
        }

        sessionStorage.removeItem('pendingCashfreeOrder');
        clearCart();
        setStatus('success');
        router.push(`/order-confirmation?orderId=${docRef.id}&method=cashfree`);
      } else {
        // Payment failed or not completed
        toast.error('Payment verification failed. Please try again.');
        setStatus('failed');
      }
    } catch (error) {
      console.error('Cashfree payment error:', error);
      toast.error('Something went wrong with payment');
      setStatus('failed');
    }
  };

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center relative z-10 max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg mx-auto mb-6">
            <XCircle size={48} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Payment Failed</h2>
          <p className="text-gray-400 mb-8">Your payment could not be processed. No amount has been charged.</p>
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

  return (
    <>
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        onLoad={() => setSdkReady(true)}
        strategy="afterInteractive"
      />
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center relative z-10">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse mx-auto mb-6">
            <Loader2 size={40} className="text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {status === 'loading' ? 'Initializing Payment...' : 'Processing Payment...'}
          </h2>
          <p className="text-gray-400">Please complete the payment in the popup window</p>
        </div>
      </div>
    </>
  );
}
