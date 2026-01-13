import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../../pages/errorPage/ErrorPage";
import AdminLayout from "../layout/dashboard/admin/AdminLayout";
import PublicLayout from "../layout/public/PublicLaout";
import { adminRoutes } from "./routes/dashboard/adminRoute";
import { publicRoutes } from "./routes/public";
import AdminRoutes from "./routeWrapper/AdminRoute";
import AdminLoginLayout from "../layout/dashboard/admin/AdminLoginLayout";
import { adminLoginRoutes } from "./routes/dashboard/AdminLoginRoute";

const routers = createBrowserRouter([
  {
    path: "/kry-admin-portal",
    errorElement: <ErrorPage />,
    element: (
      <Suspense fallback={<div>Loading Admin Dashboard...</div>}>
        <AdminRoutes>
          <AdminLayout />
        </AdminRoutes>
      </Suspense>
    ),
    children: [...adminRoutes],
  },
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: (
      <Suspense fallback={<div>Loading Public Pages...</div>}>
        <PublicLayout />
      </Suspense>
    ),
    children: [...publicRoutes],
  },
  {
    path: "/kry-admin-portal",
    errorElement: <ErrorPage />,
    element: (
      <Suspense fallback={<div>Loading Public Pages...</div>}>
        <AdminLoginLayout />
      </Suspense>
    ),
    children: [...adminLoginRoutes],
  },
]);

export default routers;
