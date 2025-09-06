import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Eye, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Items = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [filters, currentPage]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...filters
      });
      
      Object.keys(filters).forEach(key => {
        if (!filters[key] || filters[key] === 'all') {
          params.delete(key);
        }
      });
      
      const response = await axios.get(`http://localhost:5000/api/items?${params}`);
      setItems(response.data.items);
      setPagination(response.data.pagination);
      setError('');
    } catch (error) {
      console.error('Fetch items error:', error);
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Fetch categories error:', error);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handleAddToCart = async (itemId) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [itemId]: true }));
    
    try {
      const result = await addToCart(itemId, 1);
      if (result.success) {
        alert('Item added to cart!');
      } else {
        alert(result.error || 'Failed to add item to cart');
      }
    } catch (error) {
      alert('Failed to add item to cart');
    } finally {
      setAddingToCart(prev => ({ ...prev, [itemId]: false }));
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto container-padding py-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-responsive-xl font-bold gradient-text mb-4">
              Discover Premium Products
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our curated collection of high-quality items designed to enhance your lifestyle
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="container mx-auto container-padding py-8">
        <div className="card p-6 mb-8 animate-fade-in-scale">
          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <Filter size={24} className="text-teal-600" />
              Find Your Perfect Product
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="What are you looking for?"
                  className="input-modern pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input-modern"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="$0"
                className="input-modern"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="$1000"
                className="input-modern"
                min="0"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 animate-fade-in-scale">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {items.map((item, index) => (
              <div 
                key={item._id} 
                className="card group cursor-pointer overflow-hidden animate-fade-in-scale"
                style={{animationDelay: `${index * 0.1}s`}}
                onClick={() => navigate(`/items/${item._id}`)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white rounded-full p-3 shadow-lg">
                        <Eye size={20} className="text-teal-600" />
                      </div>
                    </div>
                  </div>
                  <span className="absolute top-3 right-3 px-2 py-1 bg-teal-600 text-white text-xs font-medium rounded-full">
                    {item.category}
                  </span>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold gradient-text">${item.price}</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="text-yellow-400 fill-current" />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">(0)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      item.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.stock > 0 ? `${item.stock} available` : 'Out of stock'}
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item._id);
                      }}
                      disabled={item.stock === 0 || addingToCart[item._id]}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        item.stock === 0 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-teal-600 text-white hover:bg-teal-700 transform hover:scale-105'
                      }`}
                    >
                      {addingToCart[item._id] ? (
                        <span className="text-sm">Adding...</span>
                      ) : (
                        <>
                          <ShoppingCart size={16} />
                          <span className="text-sm">{item.stock === 0 ? 'Sold Out' : 'Add'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-16 animate-fade-in-up">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-6">We couldn't find any products matching your criteria. Try adjusting your filters.</p>
                <button
                  onClick={() => {
                    setFilters({
                      search: '',
                      category: 'all',
                      minPrice: '',
                      maxPrice: '',
                      sortBy: 'createdAt',
                      sortOrder: 'desc'
                    });
                    setCurrentPage(1);
                  }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Items;