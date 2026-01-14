import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import "../src/assets/fonts/style.css";
import "./App.css";
import routers from "./components/routers/router";
import { Toaster } from "./components/ui/toaster";
import { loadUserFromToken } from "./utils/helper/loadUserFromToken";
import HomeLoader from "./components/loader/HomeLoader";
import TrackingProvider from "./utils/TrackingProvider";
import { useGetCompanyInfoAllQuery } from "./components/store/api/company/companyApi";
// import ScriptInjection from "./components/common/ExternalTracking";
function App() {
  const dispatch = useDispatch();
  // usePageTracking();
  // useFacebookPixel();
  const { data: companyData, isLoading } = useGetCompanyInfoAllQuery({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    // Load user data from token
    loadUserFromToken(dispatch);
  }, [dispatch]); // Get the entire user object

  if (loading || isLoading) {
    return <HomeLoader />;
  }

  return (
    <div>
      {/* <ScriptInjection
        googleScript={companyData?.data[0]?.googleScript}
        facebookScript={companyData?.data[0]?.facebookScript}
        googleNoScript={companyData?.data[0]?.googleNoScript}
        facebookNoScript={companyData?.data[0]?.facebookNoScript}
      /> */}
      {/* @ts-expect-error: RouterProvider does not accept children, but we are injecting TrackingProvider anyway */}
      <RouterProvider router={routers}>
        <TrackingProvider />
      </RouterProvider>
      <Toaster />
    </div>
  );
}

export default App;
