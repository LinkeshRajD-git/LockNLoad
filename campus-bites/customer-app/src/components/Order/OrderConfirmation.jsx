import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmation({ order, method }) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8 text-center">
      <CheckCircle size={80} className="text-green-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
      <p className="text-gray-600 mb-6">Thank you for your order. We'll prepare it right away!</p>

      {order && (
        <>
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="font-bold text-lg mb-4">Order Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-semibold">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-semibold">{method === 'cod' ? 'Cash on Delivery' : 'UPI Payment'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-red-600">₹{order.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold text-yellow-600 capitalize">{order.orderStatus}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="font-bold text-lg mb-4">Items</h2>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                <div>
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-gray-600 ml-2">x{item.quantity}</span>
                </div>
                <span className="font-semibold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-8 flex gap-4 justify-center">
        <Link href="/">
          <button className="bg-[#E94E24] text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-semibold">
            Back to Home
          </button>
        </Link>
        <Link href="/beverages">
          <button className="bg-white text-[#E94E24] border-2 border-[#E94E24] px-6 py-3 rounded-lg hover:bg-red-50 transition font-semibold">
            Order More
          </button>
        </Link>
      </div>
    </div>
  );
}
