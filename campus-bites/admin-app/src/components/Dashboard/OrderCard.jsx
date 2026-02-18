export default function OrderCard({ order, onUpdateStatus }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'preparing': return 'bg-blue-100 text-blue-700';
      case 'ready': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-bold text-lg">#{order.id.slice(0, 8)}</p>
          <p className="text-sm text-gray-600">{order.userName}</p>
          <p className="text-sm text-gray-600">{order.userPhone}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-2xl text-red-600">₹{order.totalAmount}</p>
          <p className="text-sm text-gray-600">{order.paymentMethod === 'cod' ? 'COD' : 'UPI Paid'}</p>
        </div>
      </div>

      <div className="mb-3">
        <p className="font-semibold text-sm text-gray-700 mb-2">Items:</p>
        <div className="space-y-1">
          {order.items.map((item, idx) => (
            <p key={idx} className="text-sm text-gray-600">
              {item.name} x{item.quantity} - ₹{item.price * item.quantity}
            </p>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
          {order.orderStatus.toUpperCase()}
        </span>

        <div className="flex gap-2">
          {order.orderStatus === 'pending' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'preparing')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm"
            >
              Start Preparing
            </button>
          )}
          {order.orderStatus === 'preparing' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'ready')}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm"
            >
              Mark Ready
            </button>
          )}
          {order.orderStatus === 'ready' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'completed')}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm"
            >
              Complete Order
            </button>
          )}
          <button
            onClick={() => onUpdateStatus(order.id, 'cancelled')}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
