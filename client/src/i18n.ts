// Basic internationalization setup (stub for future implementation)
export const i18n = {
  locale: 'en',
  fallback: 'en',
  messages: {
    en: {
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
      'common.search': 'Search',

      // Navigation
      'nav.home': 'Home',
      'nav.restaurants': 'Restaurants',
      'nav.profile': 'Profile',
      'nav.orders': 'Orders',
      'nav.cart': 'Cart',
      'nav.login': 'Login',
      'nav.logout': 'Logout',

      // Auth
      'auth.welcome': 'Welcome',
      'auth.login': 'Sign In',
      'auth.register': 'Create Account',
      'auth.logout': 'Logout',

      // Restaurant
      'restaurant.rating': 'Rating',
      'restaurant.delivery': 'Delivery Time',
      'restaurant.minOrder': 'Minimum Order',
      'restaurant.deliveryFee': 'Delivery Fee',

      // Cart
      'cart.title': 'Shopping Cart',
      'cart.empty': 'Your cart is empty',
      'cart.total': 'Total',
      'cart.checkout': 'Checkout',

      // Order
      'order.status': 'Order Status',
      'order.tracking': 'Track Order',
      'order.history': 'Order History',
    }
  }
};

export const t = (key: string): string => {
  return i18n.messages[i18n.locale]?.[key] || key;
};

export default i18n;