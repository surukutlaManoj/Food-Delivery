import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '@/services/api';
import { User, LoginCredentials, RegisterData, AuthContextType } from '@/types';

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Auth action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('authToken'),
  loading: false,
  error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload.user,
        token: action.payload.token,
      };

    case 'AUTH_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
        token: null,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Verify token by fetching current user
          const response = await authAPI.getCurrentUser();
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: response.data.user,
              token,
            },
          });
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await authAPI.login(credentials);
      const { user, token } = response.data;

      // Store in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });

      toast.success('Welcome back! 🎉');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterData): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await authAPI.register(userData);
      const { user, token } = response.data;

      // Store in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });

      toast.success('Account created successfully! 🎉');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    }

    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  // Update user function
  const updateUser = (userData: Partial<User>): void => {
    dispatch({ type: 'UPDATE_USER', payload: userData });

    // Update localStorage
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Context value
  const value: AuthContextType = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;