import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Star, MessageCircle } from 'lucide-react';

export default function ReviewList({ maxItems = 6, refreshKey = 0 }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    loadReviews();
  }, [refreshKey]);

  const loadReviews = async () => {
    try {
      const q = query(
        collection(db, 'reviews'),
        orderBy('createdAt', 'desc'),
        limit(maxItems)
      );
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      }));
      setReviews(reviewsData);

      if (reviewsData.length > 0) {
        const avg = reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length;
        setAverageRating(avg);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-10 h-10 border-4 border-[#E94E24] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-400 mt-3">Loading reviews...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 glass-card rounded-3xl">
        <MessageCircle size={48} className="text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No reviews yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Average Rating Summary */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 glass-card rounded-2xl p-6">
        <div className="text-center sm:text-left">
          <p className="text-5xl font-black text-white">{averageRating.toFixed(1)}</p>
          <div className="flex gap-1 mt-1 justify-center sm:justify-start">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                className={averageRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
              />
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="glass-card rounded-3xl p-6 hover:border-[#E94E24]/30 transition-all">
            {/* Rating Stars */}
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={review.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                />
              ))}
            </div>

            {/* Review Text */}
            <p className="text-gray-300 text-base mb-6 leading-relaxed">"{review.text}"</p>

            {/* User Info */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
              <div className="w-10 h-10 bg-gradient-to-br from-[#E94E24] to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {review.userName?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{review.userName}</p>
                <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
