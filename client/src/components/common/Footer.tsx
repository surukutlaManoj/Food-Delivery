import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
    cities: [
      { name: 'New York', href: '/restaurants/new-york' },
      { name: 'Los Angeles', href: '/restaurants/los-angeles' },
      { name: 'Chicago', href: '/restaurants/chicago' },
      { name: 'Houston', href: '/restaurants/houston' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'Instagram', href: '#', icon: Instagram },
  ];

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-xl font-bold">FoodDelivery</span>
              </div>
              <p className="text-secondary-300 mb-6">
                Delivering delicious food from your favorite restaurants right to your doorstep.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-secondary-300">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">support@fooddelivery.com</span>
                </div>
                <div className="flex items-center text-secondary-300">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">1-800-FOOD-123</span>
                </div>
                <div className="flex items-center text-secondary-300">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">123 Food St, New York, NY</span>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-secondary-300 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-secondary-300 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cities & Social */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Popular Cities</h3>
              <ul className="space-y-2 mb-6">
                {footerLinks.cities.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-secondary-300 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-secondary-300 hover:text-white transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-300 text-sm mb-4 md:mb-0">
              © {currentYear} FoodDelivery. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-secondary-300 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-secondary-300 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-secondary-300 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;