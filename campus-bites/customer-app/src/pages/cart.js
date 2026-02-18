import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Cart() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = getTotal();
  const discount = couponApplied && subtotal > 300 ? (subtotal * 0.15).toFixed(2) : 0;
  const finalTotal = (subtotal - discount).toFixed(2);

  const handleCheckout = () => {
    if (!user) {
      router.push('/login?returnUrl=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  const applyCoupon = () => {
    if (subtotal > 300) {
      setCouponApplied(true);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center relative z-10">
          <ShoppingBag size={80} className="text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
          <Link href="/loaded-fries">
            <button className="bg-gradient-to-r from-[#E94E24] to-red-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-600 transition font-semibold shadow-lg shadow-[#E94E24]/30">
              Browse Menu 🍟
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-8">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/loaded-fries">
              <button className="p-2 bg-gray-900 hover:bg-gray-800 rounded-xl text-white transition-colors">
                <ArrowLeft size={20} />
              </button>
            </Link>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Shopping Cart</h1>
          </div>
          <button
            onClick={clearCart}
            className="text-red-400 hover:text-red-300 font-semibold transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-3 sm:p-6 mb-6">
          {cart.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-800 py-4 last:border-b-0 gap-3 sm:gap-0">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="text-2xl sm:text-4xl shrink-0">{item.image}</div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg text-white truncate">{item.name}</h3>
                  <p className="text-[#E94E24] font-bold text-sm sm:text-base">₹{item.price}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.isVeg ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'
                  }`}>
                    {item.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 justify-between sm:justify-end pl-9 sm:pl-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="bg-gray-800 hover:bg-gray-700 rounded-full p-1.5 text-white transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold w-8 text-center text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-[#E94E24] hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="w-16 sm:w-24 text-right">
                  <span className="font-bold text-sm sm:text-base text-white">₹{item.price * item.quantity}</span>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 hover:text-red-300 p-1.5 sm:p-2 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-base sm:text-lg font-semibold text-gray-400">Subtotal:</span>
            <span className="text-lg font-bold text-white">₹{subtotal.toFixed(2)}</span>
          </div>

          {/* Coupon Section */}
          {subtotal > 300 && !couponApplied && (
            <div className="mb-4 p-4 bg-gradient-to-r from-[#E94E24]/20 to-yellow-500/20 border border-[#E94E24]/50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={20} className="text-[#E94E24]" />
                <p className="font-semibold text-[#E94E24]">Exclusive Offer Available!</p>
              </div>
              <p className="text-sm text-amber-200 mb-3">
                Order amount is above ₹300! Claim <span className="font-bold">15% OFF</span> on your purchase.
              </p>
              <button
                onClick={applyCoupon}
                className="w-full bg-gradient-to-r from-[#E94E24] to-yellow-500 text-black py-2 rounded-lg font-bold hover:from-red-600 hover:to-yellow-600 transition-all text-sm"
              >
                Claim 15% Discount
              </button>
            </div>
          )}

          {couponApplied && subtotal > 300 && (
            <div className="mb-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-xl">
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-green-400" />
                <p className="font-semibold text-green-300">✓ 15% Discount Applied!</p>
              </div>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between items-center mb-4">
              <span className="text-base sm:text-lg font-semibold text-green-400">Discount (15%):</span>
              <span className="text-lg font-bold text-green-400">-₹{discount}</span>
            </div>
          )}

          <div className="border-t border-gray-700 pt-4 flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-white">Total:</span>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E94E24] to-red-400">₹{finalTotal}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-[#E94E24] to-red-500 text-white py-4 rounded-xl hover:from-red-600 hover:to-red-600 transition-all font-bold text-lg shadow-lg shadow-[#E94E24]/30 transform hover:scale-[1.02]"
          >
            {user ? 'Proceed to Checkout →' : 'Login to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}
