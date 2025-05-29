import { useEffect } from 'react';
import { toast } from 'react-toastify';

const SecurityWrapper = ({ children }) => {
  useEffect(() => {
    // Only apply security measures in production
    if (process.env.NODE_ENV !== 'production') return;

    // Disable right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      toast.warning('Right-click is disabled for security reasons.');
      return false;
    };

    // Disable common developer tools shortcuts
    const handleKeyDown = (e) => {
      // Disable F12 (Developer Tools)
      if (e.keyCode === 123) {
        e.preventDefault();
        toast.warning('Developer tools access is restricted.');
        return false;
      }

      // Disable Ctrl+Shift+I (Developer Tools)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        toast.warning('Developer tools access is restricted.');
        return false;
      }

      // Disable Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        toast.warning('Console access is restricted.');
        return false;
      }

      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        toast.warning('View source is disabled.');
        return false;
      }

      // Disable Ctrl+S (Save Page)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        toast.warning('Saving page is disabled.');
        return false;
      }

      // Disable Ctrl+A (Select All) - Optional
      if (e.ctrlKey && e.keyCode === 65) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+C (Copy) - Optional, might be too restrictive
      // if (e.ctrlKey && e.keyCode === 67) {
      //   e.preventDefault();
      //   return false;
      // }
    };

    // Detect developer tools opening
    let devtools = {
      open: false,
      orientation: null
    };

    const threshold = 160;

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          toast.error('Developer tools detected. Please close them for security.');
          // Optionally redirect to login or show warning
          // window.location.href = '/login';
        }
      } else {
        devtools.open = false;
      }
    }, 500);

    // Disable text selection (optional - might be too restrictive)
    const disableSelection = (e) => {
      if (typeof e.onselectstart !== "undefined") {
        e.onselectstart = () => false;
      } else if (typeof e.style.MozUserSelect !== "undefined") {
        e.style.MozUserSelect = "none";
      } else {
        e.onmousedown = () => false;
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    // Optional: Disable text selection
    // document.addEventListener('selectstart', disableSelection);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      // document.removeEventListener('selectstart', disableSelection);
    };
  }, []);

  // Disable drag and drop to prevent file access
  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.effectAllowed = "none";
      e.dataTransfer.dropEffect = "none";
    };

    const handleDrop = (e) => {
      e.preventDefault();
      toast.warning('File drop is disabled for security.');
    };

    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Detect if page is loaded in iframe (clickjacking protection)
  useEffect(() => {
    if (window.top !== window.self) {
      toast.error('This application cannot be loaded in a frame for security reasons.');
      window.top.location = window.self.location;
    }
  }, []);

  // Clear console in production
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      console.clear();
      console.log('%cSTOP!', 'color: red; font-size: 50px; font-weight: bold;');
      console.log('%cThis is a browser feature intended for developers. Do not enter any code here as it may compromise your account security.', 'color: red; font-size: 16px;');
    }
  }, []);

  return children;
};

export default SecurityWrapper;
