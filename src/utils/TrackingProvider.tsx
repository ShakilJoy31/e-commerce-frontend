import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TrackingProvider = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    // Facebook Pixel tracking
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }

    // Google Analytics tracking
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-4EE1NYCNQT', {
        page_path: location.pathname,
      });
    }
  }, [location.pathname]);

  return <>{children}</>;
};

export default TrackingProvider;