import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Star, ArrowRight, Utensils } from 'lucide-react';
import { Restaurant } from '@/types';
import { restaurantAPI } from '@/services/api';
import { formatCurrency } from '@/utils/helpers';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';

const HomePage: React.FC = () => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFeaturedRestaurants = async () => {
      try {
        const response = await restaurantAPI.getFeatured(6);
        setFeaturedRestaurants(response.data.restaurants);
      } catch (error) {
        console.error('Failed to fetch featured restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRestaurants();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/restaurants?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const cuisines = [
    { name: 'Italian', image: '🍝' },
    { name: 'Chinese', image: '🥡' },
    { name: 'Mexican', image: '🌮' },
    { name: 'American', image: '🍔' },
    { name: 'Indian', image: '🍛' },
    { name: 'Japanese', image: '🍱' },
    { name: 'Thai', image: '🍜' },
    { name: 'Pizza', image: '🍕' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading delicious restaurants..." />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container">
          <div className="py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Delicious Food Delivered to Your Door
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Order from hundreds of local restaurants and get your favorite meals delivered fast.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter your location or search for food..."
                      className="w-full pl-12 pr-4 py-4 rounded-lg text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-white text-primary-600 hover:bg-secondary-50 px-8"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search Food
                  </Button>
                </div>
              </form>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-primary-100">Restaurants</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">30min</div>
                  <div className="text-primary-100">Avg Delivery</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">4.8★</div>
                  <div className="text-primary-100">Customer Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cuisines Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Browse by Cuisine
            </h2>
            <p className="text-xl text-secondary-600">
              Choose from a variety of delicious cuisines
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {cuisines.map((cuisine) => (
              <Link
                key={cuisine.name}
                to={`/restaurants?cuisine=${cuisine.name}`}
                className="group bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 p-6 text-center"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {cuisine.image}
                </div>
                <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                  {cuisine.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="section bg-secondary-50">
        <div className="container">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                Featured Restaurants
              </h2>
              <p className="text-xl text-secondary-600">
                Top-rated restaurants in your area
              </p>
            </div>
            <Link to="/restaurants">
              <Button variant="outline">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {featuredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRestaurants.map((restaurant) => (
                <Link
                  key={restaurant._id}
                  to={`/restaurants/${restaurant._id}`}
                  className="group"
                >
                  <div className="card card-hover overflow-hidden">
                    {/* Restaurant Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {restaurant.rating && (
                        <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg shadow-soft flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          <span className="text-sm font-medium">{restaurant.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {/* Restaurant Info */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                          {restaurant.name}
                        </h3>
                      </div>

                      <p className="text-secondary-600 text-sm mb-4 line-clamp-2">
                        {restaurant.description}
                      </p>

                      <div className="flex items-center text-sm text-secondary-500 space-x-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {restaurant.deliveryTime}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {restaurant.cuisine}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-secondary-100 flex justify-between items-center">
                        <span className="text-sm text-secondary-500">
                          Delivery: {formatCurrency(restaurant.deliveryFee)}
                        </span>
                        <span className="text-sm text-secondary-500">
                          Min: {formatCurrency(restaurant.minOrder)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Utensils className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                No restaurants available
              </h3>
              <p className="text-secondary-600">
                Check back later for amazing restaurants in your area.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-secondary-600">
              Get your favorite food delivered in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Find Restaurants
              </h3>
              <p className="text-secondary-600">
                Browse through hundreds of restaurants and cuisines in your area.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Place Your Order
              </h3>
              <p className="text-secondary-600">
                Add your favorite items to cart and checkout with secure payment.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Enjoy Your Meal
              </h3>
              <p className="text-secondary-600">
                Track your order in real-time and enjoy delicious food at your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;