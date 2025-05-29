import { NavLink } from 'react-router-dom';
import { FiHome, FiTruck, FiTool, FiClipboard, FiBarChart2, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const BottomNav = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [showUserInfo, setShowUserInfo] = useState(false);

  // Close navigation when clicking outside
  const handleBackdropClick = () => {
    setShowUserInfo(false);
    onClose();
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: FiHome },
    { name: 'Cars', path: '/cars', icon: FiTruck },
    { name: 'Services', path: '/services', icon: FiTool },
    { name: 'Service Records', path: '/service-records', icon: FiClipboard },
    { name: 'Reports', path: '/reports', icon: FiBarChart2 },
  ];

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <>
      {/* User Info Popup */}
      {showUserInfo && (
        <div className="fixed bottom-52 left-8 bg-white rounded-xl shadow-2xl border border-primary-200 p-4 z-50 min-w-64">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 shadow-md">
              <FiUser className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {user?.fullName || 'User Name'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role || 'Member'} • {user?.username || 'username'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <FiLogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      )}

      {/* Half Circle Navigation */}
      <div className={`fixed bottom-16 left-4 z-30 transition-all duration-500 ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        {/* Main Half Circle Container */}
        <div className="relative">
          {/* Half Circle Background - Smaller size to fit better */}
          <div
            className="w-64 h-32 bg-gradient-to-tr from-primary-600 via-primary-500 to-primary-400 shadow-2xl transition-all duration-500 hover:shadow-3xl"
            style={{
              borderTopRightRadius: '100%',
              clipPath: 'polygon(0 0, 100% 0, 0 100%)'
            }}
          >
            {/* Animated Background Overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-primary-500 via-primary-400 to-primary-300 opacity-0 hover:opacity-20 transition-opacity duration-300"
              style={{
                borderTopRightRadius: '100%',
                clipPath: 'polygon(0 0, 100% 0, 0 100%)'
              }}
            />
          </div>

          {/* Navigation Items */}
          <div className="absolute inset-0 flex flex-col justify-center pl-6 pb-6">
            {/* Main Navigation Icons - Arranged in a more compact grid */}
            <div className="grid grid-cols-3 gap-2 max-w-48">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 transform hover:scale-110 ${
                        isActive
                          ? 'bg-white text-primary-600 shadow-lg scale-110'
                          : 'bg-white bg-opacity-20 text-white hover:bg-white hover:text-primary-600 hover:shadow-lg backdrop-blur-sm'
                      }`
                    }
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <Icon className="h-5 w-5" />

                    {/* Tooltip */}
                    <div className="absolute left-12 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-lg">
                      {item.name}
                    </div>
                  </NavLink>
                );
              })}

              {/* User Profile Icon - Added to the grid */}
              <button
                onClick={() => setShowUserInfo(!showUserInfo)}
                className={`group relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  showUserInfo
                    ? 'bg-white text-primary-600 shadow-xl scale-110'
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-300 hover:to-orange-400 shadow-lg backdrop-blur-sm'
                }`}
              >
                <FiUser className="h-5 w-5" />

                {/* Tooltip */}
                <div className="absolute left-12 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-lg">
                  Profile
                </div>
              </button>
            </div>
          </div>

          {/* Decorative Elements - Adjusted for smaller circle */}
          <div className="absolute top-3 left-4">
            <div className="w-2 h-2 bg-white bg-opacity-30 rounded-full animate-ping"></div>
          </div>
          <div className="absolute top-6 left-12">
            <div className="w-1.5 h-1.5 bg-white bg-opacity-40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          <div className="absolute top-4 left-20">
            <div className="w-1 h-1 bg-white bg-opacity-50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>

          {/* Brand Text */}
          <div className="absolute bottom-2 left-4 text-white text-opacity-60 text-xs font-medium">
            SmartPark
          </div>
        </div>
      </div>

      {/* Backdrop for navigation and user info */}
      <div
        className="fixed inset-0 z-30 bg-black bg-opacity-30 transition-opacity duration-300"
        onClick={handleBackdropClick}
      />
    </>
  );
};

export default BottomNav;
