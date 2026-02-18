import { useState } from 'react';
import ReviewForm from '../components/Review/ReviewForm';
import ReviewList from '../components/Review/ReviewList';
import { Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Reviews() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <button className="p-2 bg-gray-900 hover:bg-gray-800 rounded-xl text-white transition-colors">
              <ArrowLeft size={24} />
            </button>
          </Link>
          <div>
            <h1 className="text-4xl font-black text-white flex items-center gap-3">
              <Star className="text-yellow-400 fill-yellow-400" size={32} />
              Reviews & Ratings
            </h1>
            <p className="text-gray-400 mt-1">See what our customers say about us!</p>
          </div>
        </div>

        {/* Review Form */}
        <div className="mb-12">
          <ReviewForm onReviewSubmitted={() => setRefreshKey(k => k + 1)} />
        </div>

        {/* Reviews List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Customer Reviews</h2>
          <ReviewList maxItems={20} refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}
