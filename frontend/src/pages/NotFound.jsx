import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold text-primary-300 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <FiAlertTriangle className="h-16 w-16 text-primary-500" />
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
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-sm text-gray-500">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <FiHome className="mr-2 h-5 w-5" />
            Go to Dashboard
          </Link>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 text-primary-600 font-medium rounded-lg border border-primary-300 hover:bg-primary-50 transition-colors duration-200"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Need Help?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            If you think this is an error, here are some helpful links:
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link
              to="/cars"
              className="text-primary-600 hover:text-primary-800 hover:underline"
            >
              Manage Cars
            </Link>
            <Link
              to="/services"
              className="text-primary-600 hover:text-primary-800 hover:underline"
            >
              View Services
            </Link>
            <Link
              to="/service-records"
              className="text-primary-600 hover:text-primary-800 hover:underline"
            >
              Service Records
            </Link>
            <Link
              to="/reports"
              className="text-primary-600 hover:text-primary-800 hover:underline"
            >
              View Reports
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-400">
          <p>SmartPark Car Repair Management System</p>
          <p>© {new Date().getFullYear()} All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
