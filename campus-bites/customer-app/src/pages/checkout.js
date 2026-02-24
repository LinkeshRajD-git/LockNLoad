import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ArrowLeft, Loader2 } from 'lucide-react';

function generateOrderId() {
  const now = new Date();
  const datePart =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `LNL-${datePart}-${randomPart}`;
}

// Order confirmation email removed

export default function Checkout() {
  const router = useRouter();
  const { cart, getTotal, clearCart } = useCart();
  const { user } = useAuth();

  
  const [payLoading, setPayLoading] = useState(false);

  const subtotal = getTotal();
  const discount = subtotal > 299 ? parseFloat((subtotal * 0.10).toFixed(2)) : 0;
  const totalAmount = parseFloat((subtotal - discount).toFixed(2));

  useEffect(() => {
    if (cart.length === 0) router.push('/cart');
  }, [cart]);

  useEffect(() => {
    // no-op (leftover effect placeholder) — depend only on totalAmount
  }, [totalAmount]);

  // OTP/email verification removed

  

  

  // Load external script helper
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) return resolve(true);
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error('Script load error'));
      document.body.appendChild(script);
    });
  };

  const handleRazorpay = async () => {
    if (!user) {
      toast.error('Please login to proceed with payment');
      return;
    }
    setPayLoading(true);
    try {
      const orderId = generateOrderId();
      // Create order on server
      const res = await fetch('/api/razorpay-create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, orderId }),
      });
      if (!res.ok) throw new Error('Could not create payment order');
      const data = await res.json();

      // Load Razorpay checkout script
      await loadScript('https://checkout.razorpay.com/v1/checkout.js');

      const options = {
        key: data.keyId, // public key id returned by server
        amount: data.amount, // amount in paise (server returned amount)
        currency: data.currency || 'INR',
        name: 'Lock N Load',
        description: `Order ${orderId}`,
        order_id: data.razorpayOrderId,
        handler: async function (paymentResult) {
          try {
            const rawPhone = (user.phone || user.phoneNumber || '9999999999')
              .replace(/^\+91/, '').replace(/\D/g, '').slice(-10).padStart(10, '9');

            const orderDoc = await addDoc(collection(db, 'orders'), {
              orderId,
              userId: user.uid,
              userName: user.displayName || user.name || 'Customer',
              userEmail: user.email,
              userPhone: rawPhone,
              items: cart,
              totalAmount,
              discount,
              paymentMethod: 'razorpay',
              razorpayPaymentId: paymentResult.razorpay_payment_id,
              razorpayOrderId: paymentResult.razorpay_order_id,
              razorpaySignature: paymentResult.razorpay_signature,
              orderStatus: 'paid',
              createdAt: serverTimestamp(),
            });

            clearCart();
            router.push(`/order-confirmation?orderId=${orderDoc.id}&method=razorpay`);
          } catch (err) {
            console.error('Razorpay order save error:', err);
            toast.error('Payment succeeded but could not save order. Contact support.');
          }
        },
        prefill: {
          name: user.displayName || user.name,
          email: user.email,
          contact: (user.phone || user.phoneNumber || '').replace(/^\+/, ''),
        },
        theme: { color: '#E94E24' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Razorpay checkout error:', err);
      toast.error('Could not start payment. Try again later.');
    } finally {
      setPayLoading(false);
    }
  };

  

  return (
    <>
      {/* UPI only — no external payment SDK */}

      <div className="min-h-screen bg-black pt-24 pb-8">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/cart">
              <button className="p-2 bg-gray-900 hover:bg-gray-800 rounded-xl text-white">
                <ArrowLeft size={24} />
              </button>
            </Link>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Checkout</h1>
          </div>

          {/* Razorpay Option */}
          <div className="max-w-3xl mx-auto px-4 relative z-10 mt-4">
            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 sm:p-6 mb-6">
              <h3 className="text-md font-bold text-white mb-2">Pay with Card / UPI (Razorpay)</h3>
              <p className="text-sm text-gray-400 mb-3">Secure payments via Razorpay — cards, netbanking, UPI and wallets.</p>
              <div className="flex items-center gap-3">
                <button onClick={handleRazorpay} disabled={payLoading} className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-indigo-600 disabled:opacity-50">
                  {payLoading ? 'Processing...' : `Pay ₹${totalAmount.toFixed(2)} with Razorpay`}
                </button>
              </div>
            </div>
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
            <div className="mt-4 border-t border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal:</span>
                <span className="text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount (10% off):</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-700">
                <span className="text-gray-300">Total:</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E94E24] to-red-400">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
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
            </div>
          </div>

          {/* Payment Method */}
          {/* Razorpay UI below */}
        </div>

        {/* UPI removed — Razorpay flow available above */}
      </div>
    </>
  );
}
