import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useRouteGuard, useClearHistoryOnLogout } from './hooks/useRouteGuard';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Cars from './pages/Cars';
import Services from './pages/Services';
import ServiceRecords from './pages/ServiceRecords';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';
import NotFoundInLayout from './pages/NotFoundInLayout';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import SecurityWrapper from './components/SecurityWrapper';

function App() {
  const { user, loading } = useAuth();

  // Use route guards for additional security
  useRouteGuard();
  useClearHistoryOnLogout();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <SecurityWrapper>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />

        {/* Protected Routes - All routes require authentication */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="cars" element={<Cars />} />
          <Route path="services" element={<Services />} />
          <Route path="service-records" element={<ServiceRecords />} />
          <Route path="reports" element={<Reports />} />
          {/* 404 within layout for authenticated users */}
          <Route path="*" element={<NotFoundInLayout />} />
        </Route>

        {/* Catch all other routes and redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </SecurityWrapper>
  );
}

export default App;
