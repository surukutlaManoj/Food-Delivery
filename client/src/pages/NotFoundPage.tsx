import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import Button from '@/components/common/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-secondary-600 mb-6">
            Oops! The page you're looking for seems to have vanished into thin air.
          </p>
          <p className="text-secondary-600">
            Let's get you back to finding delicious food instead.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link to="/restaurants">
            <Button variant="outline" className="w-full sm:w-auto">
              <Search className="w-4 h-4 mr-2" />
              Browse Restaurants
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;