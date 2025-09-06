import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { items, totalAmount, loading, updateCartItem, removeFromCart, clearCart, loadCart } = useCart();
  const { user } = useAuth();
  const [updatingItems, setUpdatingItems] = useState({});

  // Refresh cart data when component mounts
  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 0) return;
    
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
    
    try {
      if (newQuantity === 0) {
        await removeFromCart(itemId);
      } else {
        await updateCartItem(itemId, newQuantity);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
      
      try {
        await removeFromCart(itemId);
      } catch (error) {
        console.error('Error removing item:', error);
      } finally {
        setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
      }
    }
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 md:py-8">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-12 text-center">
          <ShoppingBag size={48} className="sm:w-16 sm:h-16 md:w-20 md:h-20 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3 sm:mb-4">Your cart is empty</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Start shopping to find amazing products!
          </p>
          <Link 
            to="/items" 
            className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            <ShoppingBag size={16} className="sm:w-5 sm:h-5" />
            <span>Start Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Link 
            to="/items" 
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
          >
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 md:mb-6">Items in Cart</h3>
              
              <div className="space-y-4 md:space-y-6">
                {items.map((cartItem) => {
                  const item = cartItem.item;
                  const isUpdating = updatingItems[item._id];
                  
                  return (
                    <div 
                      key={item._id} 
                      className={`pb-4 md:pb-6 border-b border-gray-200 last:border-b-0 last:pb-0 transition-opacity ${
                        isUpdating ? 'opacity-60' : 'opacity-100'
                      }`}
                    >
                        <div className="flex flex-col gap-4">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-32 sm:w-20 sm:h-20 object-cover rounded-md"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                            }}
                          />
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start gap-2 mb-3">
                              <div className="flex-1">
                                <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                                  {item.name}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  {item.category}
                                </p>
                              </div>
                              <button
                                onClick={() => handleRemoveItem(item._id)}
                                disabled={isUpdating}
                                className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                              >
                                <Trash2 size={14} className="sm:w-4 sm:h-4" />
                              </button>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                              <div className="flex items-center justify-center sm:justify-start space-x-3">
                                <button
                                  onClick={() => handleQuantityChange(item._id, cartItem.quantity - 1)}
                                  disabled={isUpdating || cartItem.quantity <= 1}
                                  className="p-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus size={12} className="sm:w-[14px] sm:h-[14px]" />
                                </button>
                                
                                <span className="text-sm sm:text-base font-semibold min-w-[40px] text-center">
                                  {cartItem.quantity}
                                </span>
                                
                                <button
                                  onClick={() => handleQuantityChange(item._id, cartItem.quantity + 1)}
                                  disabled={isUpdating || cartItem.quantity >= item.stock}
                                  className="p-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Plus size={12} className="sm:w-[14px] sm:h-[14px]" />
                                </button>
                              </div>
                              
                              <div className="text-center sm:text-right">
                                <p className="text-xs sm:text-sm text-gray-500">
                                  ${item.price} each
                                </p>
                                <p className="text-sm sm:text-base font-semibold text-gray-900">
                                  ${(item.price * cartItem.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md sticky top-4">
            <div className="p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 md:mb-6">Order Summary</h3>
              
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                  <span className="font-medium">${totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${(totalAmount * 0.08).toFixed(2)}</span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-semibold text-green-600">
                    ${(totalAmount + (totalAmount * 0.08)).toFixed(2)}
                  </span>
                </div>
                
                <button 
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
                  onClick={() => alert('Checkout functionality would be implemented here!')}
                >
                  Proceed to Checkout
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  Your cart will be saved and available when you return
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;