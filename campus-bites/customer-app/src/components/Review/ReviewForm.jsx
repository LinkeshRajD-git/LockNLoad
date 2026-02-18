import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Star, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReviewForm({ onReviewSubmitted }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        userId: user.uid,
        userName: user.displayName || user.name || user.email?.split('@')[0] || 'Anonymous',
        userEmail: user.email,
        rating,
        text: reviewText.trim(),
        createdAt: serverTimestamp(),
      });

      toast.success('Review submitted! Thanks for your feedback 🎉');
      setRating(0);
      setReviewText('');
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 md:p-8">
      <h3 className="text-2xl font-black text-white mb-2">Share Your Experience</h3>
      <p className="text-gray-400 mb-6">Tell us what you think about Lock & Load!</p>

      {/* Star Rating */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-gray-400 text-sm font-semibold mr-2">Your Rating:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-125"
            >
              <Star
                size={28}
                className={`transition-colors ${
                  (hoverRating || rating) >= star
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-600'
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <span className="text-sm text-yellow-400 font-bold ml-2">
            {rating === 5 ? '🔥 Amazing!' : rating === 4 ? '😍 Great!' : rating === 3 ? '😊 Good' : rating === 2 ? '😐 Okay' : '😞 Poor'}
          </span>
        )}
      </div>

      {/* Review Text */}
      <div className="mb-6">
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your experience... What did you love? What could be better?"
          rows={4}
          maxLength={500}
          className="w-full px-5 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl focus:outline-none focus:border-[#E94E24] focus:bg-gray-800 text-white placeholder-gray-500 transition-all resize-none"
        />
        <div className="text-right mt-1">
          <span className="text-xs text-gray-500">{reviewText.length}/500</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !user}
        className="w-full sm:w-auto bg-gradient-to-r from-[#E94E24] to-red-500 text-white py-3 px-8 rounded-xl hover:from-red-600 hover:to-red-600 transition-all font-bold text-lg shadow-lg shadow-[#E94E24]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Submitting...
          </>
        ) : (
          <>
            <Send size={18} />
            Submit Review
          </>
        )}
      </button>

      {!user && (
        <p className="text-[#E94E24] text-sm mt-3 font-medium">
          ⚠️ Please <a href="/login" className="underline">login</a> to submit a review.
        </p>
      )}
    </form>
  );
}
