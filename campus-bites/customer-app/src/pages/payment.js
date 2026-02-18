import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Generate unique order ID: LNL-YYYYMMDD-XXXXX
function generateOrderId() {
  const now = new Date();
  const datePart = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `LNL-${datePart}-${randomPart}`;
}

// Send order confirmation SMS
async function sendOrderSMS(orderDetails) {
  try {
    await fetch('/api/send-order-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderDetails)
    });
  } catch (error) {
    console.error('Failed to send order SMS:', error);
  }
}

// Send order confirmation Email
async function sendOrderEmail(orderDetails) {
  try {
    await fetch('/api/send-order-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderDetails)
    });
  } catch (error) {
    console.error('Failed to send order email:', error);
  }
}

export default function Payment() {
  const router = useRouter();
  const { method } = router.query;
  const { cart, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || cart.length === 0) {
      router.push('/');
      return;
    }

    if (method) {
      processPayment();
    }
  }, [method, user, cart]);

  const processPayment = async () => {
    setLoading(true);

    try {
      const totalAmount = getTotal().toFixed(2);
      const uniqueOrderId = generateOrderId();
      const customerPhone = user.phone || user.phoneNumber || '';
      const customerName = user.displayName || user.name || 'Customer';

      // Create order in Firestore (OTP already verified in checkout)
      const orderData = {
        userId: user.uid,
        userName: customerName,
        userEmail: user.email,
        userPhone: customerPhone,
        orderId: uniqueOrderId,
        items: cart.map(item => ({
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          isVeg: item.isVeg
        })),
        totalAmount: parseFloat(totalAmount),
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        orderStatus: 'pending',
        otpVerified: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);

      // Send SMS with order details (orderId, contents, price)
      if (customerPhone) {
        await sendOrderSMS({
          phone: customerPhone,
          customerName: customerName,
          orderId: uniqueOrderId,
          orderItems: orderData.items,
          totalAmount: totalAmount,
          paymentMethod: 'cod'
        });
      }

      // Send confirmation email
      if (user.email) {
        await sendOrderEmail({
          email: user.email,
          customerName: customerName,
          orderId: uniqueOrderId,
          orderItems: orderData.items,
          totalAmount: totalAmount,
          paymentMethod: 'cod'
        });
      }

      clearCart();
      router.push(`/order-confirmation?orderId=${docRef.id}&method=cod`);
    } catch (error) {
      console.error('Order processing error:', error);
      toast.error('Failed to place order');
      router.push('/checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center relative z-10">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-[#E94E24] to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-[#E94E24]/30 animate-pulse">
            <Loader2 size={40} className="text-white animate-spin" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Placing Your Order...</h2>
        <p className="text-gray-400">Please wait while we confirm your order</p>
      </div>
    </div>
  );
}
