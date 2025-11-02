// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

// Restaurant Types
export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  address: RestaurantAddress;
  menu: MenuCategory[];
  isActive: boolean;
}

export interface RestaurantAddress {
  street: string;
  city: string;
  coordinates: [number, number];
}

export interface MenuCategory {
  category: string;
  items: MenuItem[];
}

export interface MenuItem {
  name: string;
  description: string;
  price: number;
  image: string;
  dietary: string[];
  customizations?: Customization[];
  isAvailable: boolean;
}

export interface Customization {
  name: string;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  name: string;
  price: number;
}

// Order Types
export interface Order {
  _id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  tax: number;
  finalAmount: number;
  deliveryAddress: Address;
  status: OrderStatus;
  paymentId: string;
  paymentStatus: PaymentStatus;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
  restaurant?: {
    name: string;
    image: string;
    cuisine: string;
    address: RestaurantAddress;
  };
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  customizations: Record<string, any>;
  menuItemId?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// Cart Types
export interface CartItem extends OrderItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
}

export interface Cart {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// UI State Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface FilterOptions {
  cuisine?: string;
  minRating?: number;
  maxDeliveryTime?: number;
  search?: string;
  sortBy?: 'rating' | 'deliveryFee' | 'deliveryTime' | 'name';
  order?: 'asc' | 'desc';
}

// Form Types
export interface PaymentFormData {
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'cash';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  saveCard?: boolean;
}

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
  icon?: string;
  current?: boolean;
  children?: NavItem[];
}

// Context Types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export interface CartContextType {
  cart: Cart;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setRestaurant: (restaurantId: string, restaurantName: string) => void;
}

// Error Types
export interface AppError {
  message: string;
  statusCode?: number;
  isOperational?: boolean;
}

// Search and Filter Types
export interface SearchParams {
  query?: string;
  cuisine?: string;
  rating?: number;
  page?: number;
  limit?: number;
}

// Restaurant List Props
export interface RestaurantListProps {
  restaurants: Restaurant[];
  loading?: boolean;
  error?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

// Component Props Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// Theme Types
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}