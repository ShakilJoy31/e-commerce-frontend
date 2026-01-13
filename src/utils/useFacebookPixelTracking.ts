import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Extend the Window interface to include fbq
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

const useFacebookPixel = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname]);
};

export default useFacebookPixel;
