import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center justify-between border-b border-gray-800 py-5 last:border-b-0">
      <div className="flex items-center gap-4 flex-1">
        {item.imageUrl ? (
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-800">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl bg-gray-800 flex items-center justify-center text-3xl">
            {item.image || '🍟'}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-lg text-white">{item.name}</h3>
          <p className="text-[#E94E24] font-bold">₹{item.price}</p>
          <span className={`text-xs px-2 py-1 rounded-lg ${
            item.isVeg ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {item.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-2 py-1">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-1.5 transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="font-bold w-8 text-center text-white">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="bg-gradient-to-r from-[#E94E24] to-red-500 hover:shadow-lg hover:shadow-[#E94E24]/30 text-white rounded-lg p-1.5 transition-all"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="w-24 text-right">
          <span className="font-bold text-white">₹{item.price * item.quantity}</span>
        </div>

        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-lg transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
