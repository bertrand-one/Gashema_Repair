import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiUser, FiLogOut, FiHome, FiTruck, FiTool, FiClipboard, FiBarChart2, FiChevronDown } from 'react-icons/fi';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <FiHome className="h-5 w-5" /> },
    { name: 'Cars', path: '/cars', icon: <FiTruck className="h-5 w-5" /> },
    { name: 'Services', path: '/services', icon: <FiTool className="h-5 w-5" /> },
    { name: 'Service Records', path: '/service-records', icon: <FiClipboard className="h-5 w-5" /> },
    { name: 'Reports', path: '/reports', icon: <FiBarChart2 className="h-5 w-5" /> },
  ];

  return (
    <header className="bg-gradient-to-r from-primary-700 to-primary-900 text-white shadow-lg z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-white focus:outline-none focus:text-white md:hidden"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-white ml-2 md:ml-0">
                SmartPark <span className="text-accent-300">CRPMS</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-white hover:bg-primary-600 hover:text-white'
                  }`
                }
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* User Profile */}
          <div className="relative">
            <div
              className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-primary-600"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white text-primary-600">
                <FiUser className="h-5 w-5" />
              </div>
              <div className="hidden md:block text-sm text-white">
                <span className="block font-medium">{user?.fullName}</span>
                <span className="block text-xs text-primary-200 capitalize">{user?.role}</span>
              </div>
              <FiChevronDown className="h-4 w-4 text-primary-200" />
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                  <p className="font-medium">{user?.fullName}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FiLogOut className="mr-2 h-4 w-4 text-gray-500" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
