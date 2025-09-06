import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Home, Package, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const cartCount = getCartCount();

  const navLinks = [
    { path: '/', label: 'Home', icon: Home, hideOnMobile: false },
    { path: '/items', label: 'Shop', icon: Package, hideOnMobile: false },
  ];

  const isActiveLink = (path) => location.pathname === path;

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto container-padding">
          <div className="flex justify-between items-center h-16 md:h-18">
            {/* Logo */}
            <Link 
              to="" 
              className="text-2xl md:text-3xl font-bold gradient-text hover:scale-105 transition-transform duration-300"
            >
              E-shop
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover-glow ${
                    isActiveLink(path)
                      ? 'bg-teal-100 text-teal-700 shadow-md'
                      : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            {/* Desktop Auth & Cart */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/cart"
                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover-glow ${
                      isActiveLink('/cart')
                        ? 'bg-teal-100 text-teal-700 shadow-md'
                        : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
                    }`}
                  >
                    <ShoppingCart size={18} />
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse-custom">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>
                  
                  <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                    <User size={18} className="text-teal-600" />
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-300 font-medium"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-teal-600 hover:bg-teal-50 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300" onClick={() => setIsMobileMenuOpen(false)} />
          
          <div className="fixed top-16 left-0 right-0 bg-white shadow-xl border-t border-gray-100 animate-fade-in-scale">
            <div className="container-padding py-6">
              {/* Mobile Navigation Links */}
              <div className="space-y-3 mb-6">
                {navLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      isActiveLink(path)
                        ? 'bg-teal-100 text-teal-700 shadow-md'
                        : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </Link>
                ))}
                
                {isAuthenticated && (
                  <Link
                    to="/cart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      isActiveLink('/cart')
                        ? 'bg-teal-100 text-teal-700 shadow-md'
                        : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <ShoppingCart size={20} />
                      <span>Cart</span>
                    </div>
                    {cartCount > 0 && (
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>
                )}
              </div>

              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <User size={20} className="text-teal-600" />
                    <span className="font-medium text-gray-700">{user?.name}</span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all duration-300 font-medium"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center btn-primary"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;