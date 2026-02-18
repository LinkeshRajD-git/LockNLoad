import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Checkout({ onProceed }) {
  const { cart, getTotal } = useCart();
  const { user } = useAuth();
  const totalAmount = (getTotal() * 1.05).toFixed(2);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
      
      {cart.map(item => (
        <div key={item.id} className="flex justify-between py-2 border-b">
          <div>
            <span className="font-semibold">{item.name}</span>
            <span className="text-gray-600 ml-2">x{item.quantity}</span>
          </div>
          <span className="font-semibold">₹{item.price * item.quantity}</span>
        </div>
      ))}
      
      <div className="flex justify-between py-2 font-bold text-lg mt-4">
        <span>Total:</span>
        <span className="text-red-600">₹{totalAmount}</span>
      </div>

      {user && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Customer Details</h3>
          <p className="text-sm text-gray-600">Name: {user.displayName || 'N/A'}</p>
          <p className="text-sm text-gray-600">Email: {user.email}</p>
          <p className="text-sm text-gray-600">Phone: {user.phoneNumber || 'N/A'}</p>
        </div>
      )}
    </div>
  );
}
