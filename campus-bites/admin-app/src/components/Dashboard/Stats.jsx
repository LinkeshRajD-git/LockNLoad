import { Package, Clock, CheckCircle } from 'lucide-react';

export default function Stats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-yellow-100 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
            <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
          </div>
          <Clock size={48} className="text-yellow-600" />
        </div>
      </div>

      <div className="bg-blue-100 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Preparing</p>
            <p className="text-3xl font-bold text-blue-700">{stats.preparing}</p>
          </div>
          <Package size={48} className="text-blue-600" />
        </div>
      </div>

      <div className="bg-green-100 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Ready</p>
            <p className="text-3xl font-bold text-green-700">{stats.ready}</p>
          </div>
          <CheckCircle size={48} className="text-green-600" />
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Completed Today</p>
            <p className="text-3xl font-bold text-gray-700">{stats.completed}</p>
          </div>
          <CheckCircle size={48} className="text-gray-600" />
        </div>
      </div>
    </div>
  );
}
