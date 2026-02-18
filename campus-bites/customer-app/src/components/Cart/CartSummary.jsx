import { useCart } from '../../context/CartContext';

export default function CartSummary() {
  const { getTotal } = useCart();
  const subtotal = getTotal();
  const taxes = subtotal * 0.05;
  const total = subtotal + taxes;

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-800 p-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>💰</span> Order Summary
      </h2>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Subtotal:</span>
          <span className="font-semibold text-white">₹{subtotal}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Taxes (5%):</span>
          <span className="font-semibold text-white">₹{taxes.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
          <span className="text-xl font-bold text-white">Total:</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#E94E24] to-red-400 bg-clip-text text-transparent">₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
