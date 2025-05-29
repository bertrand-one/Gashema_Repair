import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export const useRouteGuard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't check routes while authentication is loading
    if (loading) return;

    // List of protected routes
    const protectedRoutes = [
      '/',
      '/cars',
      '/services',
      '/service-records',
      '/reports'
    ];

    // List of public routes
    const publicRoutes = [
      '/login',
      '/register'
    ];

    const currentPath = location.pathname;

    // If user is not authenticated and trying to access protected route
    if (!user && protectedRoutes.some(route => 
      currentPath === route || currentPath.startsWith(route + '/')
    )) {
      toast.error('Please login to access this page.');
      navigate('/login', { 
        replace: true, 
        state: { from: location } 
      });
      return;
    }

    // If user is authenticated and trying to access public routes
    if (user && publicRoutes.includes(currentPath)) {
      navigate('/', { replace: true });
      return;
    }

    // Validate that the route exists (basic check)
    const validRoutes = [...protectedRoutes, ...publicRoutes];
    if (!validRoutes.includes(currentPath) && currentPath !== '/') {
      // Check if it's a valid nested route
      const isValidNestedRoute = validRoutes.some(route => 
        currentPath.startsWith(route + '/')
      );
      
      if (!isValidNestedRoute) {
        toast.error('Page not found.');
        navigate(user ? '/' : '/login', { replace: true });
      }
    }
  }, [user, loading, location, navigate]);

  return { user, loading };
};

// Hook to prevent back button access to login after authentication
export const usePreventBackToAuth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && (location.pathname === '/login' || location.pathname === '/register')) {
      // Replace the current history entry to prevent back button access
      navigate('/', { replace: true });
    }
  }, [user, location, navigate]);
};

// Hook to clear browser history on logout
export const useClearHistoryOnLogout = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      // Clear forward/back history by replacing current state
      window.history.replaceState(null, '', '/login');
    }
  }, [user]);
};
