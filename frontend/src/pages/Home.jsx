import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Shield, Truck, ArrowRight, Sparkles, Award, Clock } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section - Inspired by reference */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-float" />
          <div className="absolute top-32 right-20 w-20 h-20 bg-orange-400 rounded-lg rotate-45 animate-pulse-custom" />
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-teal-300 rounded-full animate-float" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white rounded-lg rotate-12 animate-pulse-custom" style={{animationDelay: '2s'}} />
        </div>
        
        <div className="relative container mx-auto container-padding section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-6">
                <h1 className="text-responsive-xl font-bold leading-tight">
                  Refresh your
                  <br />
                  <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    state of mind.
                  </span>
                </h1>
                <p className="text-xl md:text-2xl opacity-90 leading-relaxed max-w-lg">
                  Functional products to energize, calm and focus you in the moment.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/items" 
                  className="group flex items-center justify-center space-x-3 bg-white text-teal-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  <span>SHOP</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/signup" 
                  className="group flex items-center justify-center space-x-3 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-teal-700 transition-all duration-300"
                >
                  <span>Join Now</span>
                </Link>
              </div>
            </div>
            
            {/* Right Content - Product Showcase */}
            <div className="relative animate-slide-in-right">
              <div className="relative h-96 md:h-[500px]">
                {/* Main Product Cards */}
                <div className="absolute top-0 right-0 w-48 h-64 bg-gradient-to-br from-teal-400 to-teal-500 rounded-2xl shadow-2xl transform rotate-12 animate-float">
                  <div className="p-6 text-white">
                    <Sparkles size={24} className="mb-4" />
                    <h3 className="font-bold text-lg mb-2">Energy & Focus</h3>
                    <p className="text-sm opacity-90">Enhanced with L-theanine</p>
                  </div>
                </div>
                
                <div className="absolute top-16 left-0 w-48 h-64 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-2xl transform -rotate-6 animate-float" style={{animationDelay: '1s'}}>
                  <div className="p-6 text-white">
                    <Award size={24} className="mb-4" />
                    <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
                    <p className="text-sm opacity-90">Clinically tested formula</p>
                  </div>
                </div>
                
                <div className="absolute bottom-0 right-8 w-40 h-56 bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl transform rotate-6 animate-float" style={{animationDelay: '2s'}}>
                  <div className="p-6 text-gray-700">
                    <Clock size={24} className="mb-4 text-teal-600" />
                    <h3 className="font-bold text-lg mb-2">Fast Acting</h3>
                    <p className="text-sm opacity-75">Results in 30 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" className="fill-current text-gray-50">
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-responsive-lg font-bold text-gray-900 mb-4">
              Why Choose <span className="gradient-text">E-shop</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our premium, scientifically-backed products
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center group hover-lift animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Star size={32} className="text-teal-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                Carefully curated selection of high-quality products from trusted brands with rigorous testing.
              </p>
            </div>
            
            <div className="card p-8 text-center group hover-lift animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Shield size={32} className="text-orange-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Secure & Safe</h3>
              <p className="text-gray-600 leading-relaxed">
                Your data and payments are protected with industry-leading security measures and encryption.
              </p>
            </div>
            
            <div className="card p-8 text-center group hover-lift animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Truck size={32} className="text-teal-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Quick and reliable delivery to your doorstep with real-time tracking and premium packaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-responsive-lg font-bold text-gray-900 mb-4">
              Trusted by <span className="gradient-text-warm">Thousands</span>
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers are saying
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah M.", role: "Wellness Enthusiast", text: "These products have completely transformed my daily routine. I feel more focused and energized than ever!" },
              { name: "David K.", role: "Busy Professional", text: "Perfect for my hectic lifestyle. The quality is outstanding and delivery is always on time." },
              { name: "Maria L.", role: "Fitness Coach", text: "I recommend these to all my clients. The results speak for themselves - pure quality!" }
            ].map((testimonial, index) => (
              <div key={index} className="card-gradient p-8 animate-fade-in-up" style={{animationDelay: `${(index + 1) * 0.1}s`}}>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-teal-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-teal-600 to-teal-800 text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 bg-white rounded-full animate-pulse-custom" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-400 rounded-lg rotate-45 animate-float" />
        </div>
        
        <div className="relative container mx-auto container-padding text-center animate-fade-in-up">
          <h2 className="text-responsive-lg font-bold mb-6">
            Ready to Transform Your Mind?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover the power of premium wellness products today!
          </p>
          <Link 
            to="/items" 
            className="inline-flex items-center justify-center space-x-3 bg-white text-teal-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <ShoppingBag size={20} />
            <span>Start Shopping</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;