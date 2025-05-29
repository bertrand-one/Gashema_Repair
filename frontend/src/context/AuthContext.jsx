import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Logout function (defined early so it can be used in interceptor)
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    toast.info('Logged out successfully');
  };

  useEffect(() => {
    // Set up API response interceptor for automatic logout on 401
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && user) {
          toast.error('Session expired. Please login again.');
          logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // Check if user is logged in
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Validate token format
          if (!isValidTokenFormat(token)) {
            throw new Error('Invalid token format');
          }

          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/api/auth/me');
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Clear invalid authentication data
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);

        // Show error message if token was present but invalid
        const token = localStorage.getItem('token');
        if (token) {
          toast.error('Session expired. Please login again.');
        }
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();

    // Cleanup interceptor on unmount
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [user]);

  // Helper function to validate token format
  const isValidTokenFormat = (token) => {
    if (!token || typeof token !== 'string') return false;
    // Basic JWT format check (header.payload.signature)
    const parts = token.split('.');
    return parts.length === 3;
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', { username, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      toast.success('Login successful');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      toast.success('Registration successful. You can now login.');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return false;
    }
  };



  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
