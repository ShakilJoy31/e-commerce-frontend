import AdminForgetPassword from "@/pages/public/Login/AdminForgetPassword";
import AdminLogin from "@/pages/public/Login/AdminLogin";
import AdminResetPassword from "@/pages/public/Login/AdminResetPassword";
import React, { ReactNode } from "react";

export interface IRouteProps {
  path: string;
  element: ReactNode;
  loader?: any;
}

export const adminLoginRoutes: IRouteProps[] = [
  {
    path: "admin-login",
    element: React.createElement(AdminLogin),
  },
  {
    path: "admin-forget-password",
    element: React.createElement(AdminForgetPassword),
  },
  {
    path: "reset-password",
    element: React.createElement(AdminResetPassword),
  },
];
