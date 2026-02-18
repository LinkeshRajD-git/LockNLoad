import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MenuCard from '../components/Menu/MenuCard';
import FilterBar from '../components/Menu/FilterBar';
import { Loader2 } from 'lucide-react';

export default function Desserts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vegFilter, setVegFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const q = query(
        collection(db, 'menuItems'),
        where('category', '==', 'desserts')
      );
      const querySnapshot = await getDocs(q);
      const menuItems = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(menuItems);
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (vegFilter === 'veg' && !item.isVeg) return false;
    if (vegFilter === 'non-veg' && item.isVeg) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🍰</div>
          <Loader2 className="w-8 h-8 animate-spin text-[#E94E24] mx-auto" />
          <p className="text-gray-400 mt-3">Loading desserts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 sm:pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 text-center">
          🍰 Desserts
        </h1>

        <FilterBar
          vegFilter={vegFilter}
          setVegFilter={setVegFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map(item => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
