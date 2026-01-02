import React, { useState } from 'react';
import './Reviews.css';

const Reviews = ({ user, showForm = true }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([
    {
      id: '1',
      userName: 'John Doe',
      rating: 5,
      comment: 'Excellent service and beautiful rooms! Highly recommended.',
      date: '2024-11-15'
    },
    {
      id: '2',
      userName: 'Jane Smith',
      rating: 4,
      comment: 'Great experience, but could use better WiFi.',
      date: '2024-11-10'
    },
    {
      id: '3',
      userName: 'Michael Chen',
      rating: 5,
      comment: 'Amazing stay! The staff was very helpful and rooms were spotless.',
      date: '2024-11-20'
    },
    {
      id: '4',
      userName: 'Sarah Johnson',
      rating: 4,
      comment: 'Beautiful hotel with great amenities. Would definitely come back!',
      date: '2024-11-18'
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user && showForm) {
      alert('Please login to submit a review');
      return;
    }
    if (!comment.trim()) {
      alert('Please enter a review comment');
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      userName: user.name || user.email.split('@')[0],
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews([newReview, ...reviews]);
    setComment('');
    setRating(5);
    alert('Thank you for your feedback!');
  };

  return (
    <div className="reviews">
      {showForm && <h2>Reviews & Feedback</h2>}

      {showForm && user && (
        <div className="review-form-card">
        <h3>Write a Review</h3>
        <form onSubmit={handleSubmit} className="review-form">
          <div className="rating-input">
            <label>Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`star ${star <= rating ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows="5"
              required
            />
          </div>

          <button type="submit" className="submit-review-btn">Submit Review</button>
        </form>
      </div>
      )}

      {!showForm && !user && (
        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
          <a href="/login" style={{ color: '#667eea', textDecoration: 'underline' }}>Sign in</a> to submit a review
        </p>
      )}

      <div className="reviews-list">
        {showForm && <h3>Recent Reviews</h3>}
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div>
                  <h4>{review.userName}</h4>
                  <p className="review-date">{new Date(review.date).toLocaleDateString()}</p>
                </div>
                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className={star <= review.rating ? 'filled' : ''}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default Reviews;

