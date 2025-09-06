import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Heart, Share2, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchItem();
    fetchReviews();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ITEMS.BY_ID(id));
      setItem(response.data);
      setError('');
    } catch (error) {
      console.error('Fetch item error:', error);
      setError('Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ITEMS.REVIEWS(id));
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Fetch reviews error:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    setAddingToCart(true);
    try {
      const result = await addToCart(id, quantity);
      if (result.success) {
        alert(`Added ${quantity} item(s) to cart!`);
      } else {
        alert(result.error || 'Failed to add item to cart');
      }
    } catch (error) {
      alert('Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to submit a review');
      return;
    }

    if (!userRating || !userReview.trim()) {
      alert('Please provide both rating and review');
      return;
    }

    setSubmittingReview(true);
    try {
      await axios.post(API_ENDPOINTS.ITEMS.REVIEWS(id), {
        rating: userRating,
        comment: userReview
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setUserRating(0);
      setUserReview('');
      fetchReviews();
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Submit review error:', error);
      alert('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center animate-fade-in-scale">
          <div className="spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/items')}
            className="btn-primary"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto container-padding py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/items')}
          className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <div className="animate-fade-in-up">
            <div className="card overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-96 md:h-[500px] object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6 animate-slide-in-right">
            <div>
              <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{item.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={`${
                        i < Math.floor(averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">{item.description}</p>

            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold gradient-text">${item.price}</span>
              <span className={`text-sm font-medium ${
                item.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(item.stock, quantity + 1))}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  disabled={quantity >= item.stock}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={item.stock === 0 || addingToCart}
                className={`flex-1 flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  item.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {addingToCart ? (
                  <span>Adding to Cart...</span>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    <span>{item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </>
                )}
              </button>
              
              <div className="flex space-x-2">
                <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <Heart size={20} />
                </button>
                <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="card p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h3>
          
          {/* Submit Review Form */}
          {isAuthenticated && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-xl">
              <h4 className="text-lg font-semibold mb-4">Write a Review</h4>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="transition-colors"
                    >
                      <Star
                        size={24}
                        className={`${
                          star <= userRating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                <textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="input-modern h-32 resize-none"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={submittingReview || !userRating || !userReview.trim()}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-teal-600 font-semibold">
                          {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{review.user?.name || 'Anonymous'}</p>
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
