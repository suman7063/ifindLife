
import React from 'react';
import { Star, Shield } from 'lucide-react';
import { ProgramDetail } from '@/types/programDetail';

interface ReviewsSectionProps {
  reviews: ProgramDetail['reviews'];
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{reviews.averageRating.toFixed(1)}</p>
            <div className="flex justify-center mt-1">
              {renderStars(Math.round(reviews.averageRating))}
            </div>
            <p className="text-sm text-gray-600 mt-1">Average Rating</p>
          </div>
          
          <div className="border-l pl-6">
            <p className="text-xl font-semibold text-gray-900">{reviews.totalReviews}</p>
            <p className="text-sm text-gray-600">Total Reviews</p>
          </div>
        </div>
      </div>

      {/* Featured Reviews */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
        <div className="space-y-4">
          {reviews.featured.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {review.userName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{review.userName}</p>
                      {review.verified && (
                        <Shield className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Review Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          View All Reviews
        </button>
        <button className="flex-1 bg-ifind-teal text-white px-4 py-2 rounded-lg hover:bg-ifind-teal/90 transition-colors">
          Write a Review
        </button>
      </div>
    </div>
  );
};

export default ReviewsSection;
