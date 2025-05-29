import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiAlertTriangle, FiTruck, FiTool, FiClipboard, FiBarChart2 } from 'react-icons/fi';

const NotFoundInLayout = () => {
  const quickLinks = [
    { name: 'Dashboard', path: '/', icon: <FiHome className="h-5 w-5" />, color: 'bg-gradient-to-r from-primary-500 to-primary-600' },
    { name: 'Cars', path: '/cars', icon: <FiTruck className="h-5 w-5" />, color: 'bg-gradient-to-r from-emerald-500 to-emerald-600' },
    { name: 'Services', path: '/services', icon: <FiTool className="h-5 w-5" />, color: 'bg-gradient-to-r from-teal-500 to-teal-600' },
    { name: 'Service Records', path: '/service-records', icon: <FiClipboard className="h-5 w-5" />, color: 'bg-gradient-to-r from-green-500 to-green-600' },
    { name: 'Reports', path: '/reports', icon: <FiBarChart2 className="h-5 w-5" />, color: 'bg-gradient-to-r from-lime-500 to-lime-600' },
  ];

  return (
    <div className="flex items-center justify-center min-h-full py-12">
      <div className="max-w-2xl w-full text-center px-4">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="text-8xl font-bold text-primary-200 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <FiAlertTriangle className="h-12 w-12 text-primary-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            The page you're looking for doesn't exist in the SmartPark CRPMS.
          </p>
          <p className="text-sm text-gray-500">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 space-y-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <FiHome className="mr-2 h-5 w-5" />
            Go to Dashboard
          </Link>

          <div className="flex justify-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 text-primary-600 font-medium rounded-lg border border-primary-300 hover:bg-primary-50 transition-colors duration-200"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Navigation
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Navigate to any section of the SmartPark CRPMS:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center p-4 rounded-xl border border-primary-200 hover:border-primary-400 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all duration-200 group hover:shadow-md"
              >
                <div className={`p-2 rounded-lg ${link.color} text-white mr-3 group-hover:scale-110 transition-transform duration-200`}>
                  {link.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-800 group-hover:text-primary-700">
                    {link.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-400">
          <p>SmartPark Car Repair Management System</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundInLayout;
