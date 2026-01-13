import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-4EE1NYCNQT', {
        page_path: location.pathname,
      });
    }
  }, [location.pathname]);
};

export default usePageTracking;