import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onClose, isMobile }) => {
  const { user, logout } = useAuth();

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Cars', path: '/cars' },
    { name: 'Services', path: '/services' },
    { name: 'Service Records', path: '/service-records' },
    { name: 'Reports', path: '/reports' },
  ];

  return (
    <div className="bg-dark-800 border-r border-dark-700 text-white w-64 h-full flex flex-col overflow-hidden">
      {/* Logo Section - Fixed */}
      <div className="p-4 sm:p-6 border-b border-dark-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-primary-500">SmartPark</h2>
            <p className="text-dark-400 text-xs sm:text-sm font-medium">Car Repair Management</p>
          </div>

          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 rounded-md text-dark-400 hover:text-white hover:bg-dark-700 lg:hidden"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Navigation - Scrollable if needed */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-dark-300 hover:bg-dark-700 hover:text-white'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Section - Fixed at bottom */}
      <div className="p-4 border-t border-dark-700 flex-shrink-0">
        <div className="bg-dark-700 rounded-lg p-4 mb-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold text-lg">
                {(user?.fullName || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="font-medium text-white text-sm">
              {user?.fullName || 'User Name'}
            </p>
            <p className="text-dark-400 text-xs capitalize">
              {user?.role || 'Member'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full px-4 py-2 bg-accent-600 text-white text-sm font-medium rounded-lg hover:bg-accent-700 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
