import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const SessionTimeout = () => {
  const { user, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!user) return;

    let warningTimer;
    let logoutTimer;
    let countdownTimer;

    const resetTimers = () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
      clearInterval(countdownTimer);
      setShowWarning(false);

      // Show warning 2 minutes before logout (28 minutes after login)
      warningTimer = setTimeout(() => {
        setShowWarning(true);
        setTimeLeft(120); // 2 minutes in seconds
        
        toast.warning('Your session will expire in 2 minutes. Please save your work.', {
          autoClose: false,
          closeOnClick: false,
        });

        // Countdown timer
        countdownTimer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(countdownTimer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, 28 * 60 * 1000); // 28 minutes

      // Auto logout after 30 minutes
      logoutTimer = setTimeout(() => {
        toast.error('Session expired due to inactivity.');
        logout();
      }, 30 * 60 * 1000); // 30 minutes
    };

    // Reset timers on user activity
    const resetOnActivity = () => {
      if (showWarning) {
        setShowWarning(false);
        toast.dismiss();
        toast.success('Session extended due to activity.');
      }
      resetTimers();
    };

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, resetOnActivity, true);
    });

    // Initial timer setup
    resetTimers();

    // Cleanup
    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
      clearInterval(countdownTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetOnActivity, true);
      });
    };
  }, [user, logout, showWarning]);

  const extendSession = () => {
    setShowWarning(false);
    toast.dismiss();
    toast.success('Session extended successfully.');
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-800 border border-dark-600 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">Session Expiring Soon</h3>
          <p className="text-dark-300 mb-4">
            Your session will expire in <span className="font-bold text-yellow-400">{formatTime(timeLeft)}</span>
          </p>
          <p className="text-dark-400 text-sm mb-6">
            Please save your work and click "Extend Session" to continue.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={extendSession}
              className="flex-1 px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors duration-200"
            >
              Extend Session
            </button>
            <button
              onClick={logout}
              className="flex-1 px-4 py-2 bg-dark-600 text-white font-medium rounded-lg hover:bg-dark-500 transition-colors duration-200"
            >
              Logout Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeout;
