import { Edit, Trash2 } from 'lucide-react';

export default function MenuManagement({ items, onEdit, onDelete, onToggleAvailability }) {
  const categories = {
    beverages: 'Beverages',
    burgers: 'Burgers',
    'loaded-fries': 'Loaded Fries'
  };

  return (
    <div>
      {Object.entries(categories).map(([categoryKey, categoryName]) => {
        const categoryItems = items.filter(item => item.category === categoryKey);
        
        if (categoryItems.length === 0) return null;

        return (
          <div key={categoryKey} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{categoryName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        item.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.available ? 'Available' : 'Out of Stock'}
                      </span>
                    </div>

                    <div className="text-5xl text-center py-4">{item.image}</div>
                    
                    <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    )}
                    <p className="text-2xl font-bold text-red-600 mb-4">₹{item.price}</p>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => onToggleAvailability(item)}
                        className={`px-3 py-2 rounded text-sm font-semibold ${
                          item.available
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {item.available ? 'Hide' : 'Show'}
                      </button>
                      <button
                        onClick={() => onEdit(item)}
                        className="bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-200 text-sm font-semibold"
                      >
                        <Edit size={16} className="mx-auto" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 text-sm font-semibold"
                      >
                        <Trash2 size={16} className="mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
