
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import SessionTimeout from './SessionTimeout';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="h-screen bg-dark-900 flex overflow-hidden">
      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header - Fixed */}
        <header className="bg-dark-800 border-b border-dark-700 shadow-lg flex-shrink-0">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Hamburger Menu Button */}
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-md text-dark-400 hover:text-white hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-3"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">SmartPark CRPMS</h1>
                  <p className="text-dark-400 text-xs sm:text-sm hidden sm:block">Car Repair Management System</p>
                </div>
              </div>

              <div className="hidden md:block">
                <p className="text-dark-400 text-sm">
                  Professional Car Service Management
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-6 h-full">
            <div className="bg-dark-800 rounded-xl shadow-lg border border-dark-700 h-full">
              <div className="p-3 sm:p-6 h-full overflow-y-auto">
                <Outlet />
              </div>
            </div>
          </div>
        </main>

        {/* Footer - Fixed */}
        <Footer />
      </div>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Fixed on Right */}
      <div className={`
        ${isMobile ? 'fixed inset-y-0 right-0' : 'relative'}
        ${isMobile && !isSidebarOpen ? 'translate-x-full' : 'translate-x-0'}
        transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 h-full w-64
      `}>
        <Sidebar onClose={closeSidebar} isMobile={isMobile} />
      </div>

      {/* Session Timeout Component */}
      <SessionTimeout />
    </div>
  );
};

export default Layout;