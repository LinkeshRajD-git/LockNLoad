import { useCart } from '../../context/CartContext';
import { Plus, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export default function MenuCard({ item }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(item);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-800 overflow-hidden hover:shadow-2xl hover:shadow-[#E94E24]/10 transition-all duration-300 hover:-translate-y-1 group">
      {/* Veg/Non-Veg Indicator */}
      <div className="p-4 flex justify-between items-center">
        <span className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
          item.isVeg 
            ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
            : 'bg-red-500/20 text-red-400 border border-red-500/50'
        }`}>
          {item.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}
        </span>
        {!item.available && (
          <span className="px-3 py-1.5 text-xs font-bold bg-gray-800 text-gray-400 rounded-lg">
            Out of Stock
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative">
        {item.imageUrl ? (
          <div className="w-full h-48 overflow-hidden">
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="text-5xl sm:text-7xl text-center py-6 sm:py-8 bg-gradient-to-br from-gray-800 to-gray-900">
            {item.image || '🍟'}
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Details */}
      <div className="p-3 sm:p-5">
        <h3 className="font-bold text-base sm:text-lg text-white mb-1 sm:mb-2 group-hover:text-[#E94E24] transition-colors">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{item.description}</p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#E94E24] to-red-400 bg-clip-text text-transparent">₹{item.price}</span>
          <button
            onClick={handleAddToCart}
            disabled={!item.available}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
              item.available
                ? 'bg-gradient-to-r from-[#E94E24] to-red-500 text-white hover:shadow-lg hover:shadow-[#E94E24]/30 hover:scale-105 active:scale-95'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            } ${isAdding ? 'scale-95' : ''}`}
          >
            {isAdding ? (
              <ShoppingBag size={18} className="animate-bounce" />
            ) : (
              <Plus size={18} />
            )}
            {isAdding ? 'Added!' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
