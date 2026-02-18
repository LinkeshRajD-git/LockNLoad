import { Search } from 'lucide-react';

export default function FilterBar({ vegFilter, setVegFilter, searchQuery, setSearchQuery }) {
  return (
    <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-800 p-5 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E94E24] focus:border-transparent transition"
          />
        </div>

        {/* Veg Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setVegFilter('all')}
            className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
              vegFilter === 'all'
                ? 'bg-gradient-to-r from-[#E94E24] to-red-500 text-white shadow-lg shadow-[#E94E24]/30'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setVegFilter('veg')}
            className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
              vegFilter === 'veg'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            🟢 Veg
          </button>
          <button
            onClick={() => setVegFilter('non-veg')}
            className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
              vegFilter === 'non-veg'
                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            🔴 Non-Veg
          </button>
        </div>
      </div>
    </div>
  );
}
