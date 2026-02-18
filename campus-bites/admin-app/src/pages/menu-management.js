import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Plus, Edit, Trash2, ArrowLeft, CheckCircle, Upload, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MenuManagement() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'beverages',
    isVeg: true,
    image: '🍔',
    imageUrl: '',
    available: true
  });

  useEffect(() => {
    // Check admin authentication
    const isAdmin = localStorage.getItem('adminAuth');
    if (!isAdmin) {
      router.push('/');
      return;
    }

    loadMenuItems();
  }, [router]);

  const loadMenuItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'menuItems'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMenuItems(items);
    } catch (error) {
      console.error('Error loading menu items:', error);
      toast.error('Failed to load menu items');
    }
  };

  // Compress image using canvas to keep Firestore document size small
  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Scale down if wider than maxWidth
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to compressed JPEG data URL
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Compress image client-side (resizes to 800px wide, JPEG 70% quality)
      const compressedDataUrl = await compressImage(file);

      // Show preview
      setImagePreview(compressedDataUrl);

      // Store directly as data URL (no Firebase Storage needed)
      setFormData(prev => ({ ...prev, imageUrl: compressedDataUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error(`Failed to process image: ${error.message || 'Unknown error'}`);
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploading) {
      toast.error('Please wait for the image to finish uploading');
      return;
    }

    try {
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        createdAt: new Date()
      };

      if (editingItem) {
        // Update existing item
        await updateDoc(doc(db, 'menuItems', editingItem.id), itemData);
        toast.success('Item updated successfully');
      } else {
        // Add new item
        await addDoc(collection(db, 'menuItems'), itemData);
        toast.success('Item added successfully');
      }

      resetForm();
      loadMenuItems();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      isVeg: item.isVeg,
      image: item.image,
      imageUrl: item.imageUrl || '',
      available: item.available
    });
    if (item.imageUrl) {
      setImagePreview(item.imageUrl);
    }
    setShowAddForm(true);
  };

  const handleDelete = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteDoc(doc(db, 'menuItems', itemId));
      toast.success('Item deleted successfully');
      loadMenuItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await updateDoc(doc(db, 'menuItems', item.id), {
        available: !item.available
      });
      toast.success('Availability updated');
      loadMenuItems();
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'beverages',
      isVeg: true,
      image: '🍔',
      imageUrl: '',
      available: true
    });
    setEditingItem(null);
    setShowAddForm(false);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const categories = {
    beverages: 'Beverages',
    desserts: 'Desserts',
    'loaded-fries': 'Loaded Fries'
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="fries-bg-dark"></div>
      {/* Header */}
      <header className="glass-dark shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-white/10 rounded-full text-white transition-all"
            >
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-lg sm:text-2xl font-black text-white">Menu Management</h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#E94E24] to-red-600 text-white px-3 sm:px-5 py-2 rounded-xl hover:from-red-600 hover:to-red-700 shadow-lg transition-all transform hover:scale-105 font-bold text-sm sm:text-base"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Item</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="glass-dark rounded-3xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn border border-white/10">
              <h2 className="text-3xl font-black gradient-text mb-6">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-300 font-semibold mb-2 ml-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:outline-none focus:border-[#E94E24] text-white placeholder-gray-500 transition-all focus:bg-gray-800"
                    placeholder="e.g. Spicy Fries"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-2 ml-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:outline-none focus:border-[#E94E24] text-white placeholder-gray-500 transition-all focus:bg-gray-800"
                    rows="3"
                    placeholder="Describe the item..."
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-2 ml-1">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:outline-none focus:border-[#E94E24] text-white placeholder-gray-500 transition-all focus:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-2 ml-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:outline-none focus:border-[#E94E24] text-white transition-all focus:bg-gray-800"
                  >
                    {Object.entries(categories).map(([key, value]) => (
                      <option key={key} value={key} className="bg-gray-800">{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-2 ml-1">Emoji/Icon</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:outline-none focus:border-[#E94E24] text-white placeholder-gray-500 transition-all focus:bg-gray-800"
                    placeholder="🍔"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-gray-300 font-semibold ml-1">Food Image</label>
                    <span className="text-xs text-gray-500">JPG/PNG up to 5MB</span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Item preview"
                        className="w-full h-48 object-cover rounded-2xl border border-gray-700"
                      />
                      <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="px-3 py-1.5 bg-white/90 text-gray-900 rounded-xl text-sm font-semibold hover:bg-white disabled:opacity-50"
                        >
                          {uploading ? 'Uploading...' : 'Replace Image'}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-black/70 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-600 rounded-2xl p-6 bg-gray-800/40 flex flex-col items-center justify-center gap-3 text-gray-400">
                      <ImageIcon size={32} />
                      <p className="text-sm">No image selected</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        <Upload size={16} />
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 p-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${formData.isVeg ? 'bg-green-500 border-green-500' : 'border-gray-500 group-hover:border-green-400'}`}>
                      {formData.isVeg && <CheckCircle size={16} className="text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.isVeg}
                      onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                      className="hidden"
                    />
                    <span className="font-semibold text-gray-300 group-hover:text-white transition-colors">Vegetarian</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${formData.available ? 'bg-blue-500 border-blue-500' : 'border-gray-500 group-hover:border-blue-400'}`}>
                      {formData.available && <CheckCircle size={16} className="text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                      className="hidden"
                    />
                    <span className="font-semibold text-gray-300 group-hover:text-white transition-colors">Available</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-700 text-gray-300 py-3 rounded-xl hover:bg-gray-600 font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#E94E24] to-red-600 text-white py-3 rounded-xl hover:from-red-600 hover:to-red-700 font-bold shadow-lg transition-all transform hover:scale-[1.02]"
                  >
                    {editingItem ? 'Update' : 'Add'} Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Menu Items Grid */}
        {Object.entries(categories).map(([categoryKey, categoryName]) => {
          const categoryItems = menuItems.filter(item => item.category === categoryKey);
          
          if (categoryItems.length === 0) return null;

          return (
            <div key={categoryKey} className="mb-12 animate-slide-up">
              <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E94E24] to-red-400">
                  {categoryName}
                </span>
                <span className="text-sm bg-gray-800 text-gray-400 px-3 py-1 rounded-full border border-gray-700">
                  {categoryItems.length} items
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryItems.map((item, idx) => (
                  <div 
                    key={item.id} 
                    className="glass-dark rounded-3xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-white/5 relative group"
                    style={{animationDelay: `${idx * 0.1}s`}}
                  >
                    <div className="absolute top-4 right-4 z-10">
                       <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          item.available 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {item.available ? '● In Stock' : '○ Out of Stock'}
                        </span>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2 py-1 text-[10px] font-black tracking-wider uppercase rounded border ${
                          item.isVeg 
                            ? 'bg-green-900/30 text-green-400 border-green-500/30' 
                            : 'bg-red-900/30 text-red-400 border-red-500/30'
                        }`}>
                          {item.isVeg ? 'VEG' : 'NON-VEG'}
                        </span>
                      </div>

                      {item.imageUrl ? (
                        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-black/30 mb-4">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="text-6xl text-center py-6 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                          {item.image}
                        </div>
                      )}
                      
                      <h3 className="font-bold text-xl text-white mb-2 leading-tight">{item.name}</h3>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2 min-h-[40px]">{item.description || 'No description available'}</p>
                      
                      <div className="flex items-end justify-between mb-6">
                        <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E94E24] to-yellow-400">₹{item.price}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => toggleAvailability(item)}
                          className={`px-2 py-2 rounded-xl text-xs font-bold transition-all border ${
                            item.available
                              ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                              : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
                          }`}
                        >
                          {item.available ? 'Disconnect' : 'Connect'}
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-2 rounded-xl hover:bg-blue-500/20 text-xs font-bold transition-all"
                        >
                          <Edit size={16} className="mx-auto" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-2 rounded-xl hover:bg-red-500/20 text-xs font-bold transition-all"
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

        {menuItems.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
            <div className="text-6xl mb-4 opacity-50">📝</div>
            <p className="text-gray-400 text-xl font-medium">No menu items yet.</p>
            <button 
              onClick={() => setShowAddForm(true)} 
              className="mt-4 text-[#E94E24] hover:text-red-400 font-bold underline"
            >
              Add your first item
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
