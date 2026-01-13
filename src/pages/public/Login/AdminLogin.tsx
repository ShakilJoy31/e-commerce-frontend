import { loginSchema } from "@/components/schemas/loginSchema";
import { useLoginMutation } from "@/components/store/api/authenticationApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { appConfiguration } from "@/utils/constant/appConfiguration";
import { loadUserFromToken } from "@/utils/helper/loadUserFromToken";
import { shareWithCookies } from "@/utils/helper/shareWithCookies";
import { zodResolver } from "@hookform/resolvers/zod";
// import { jwtDecode } from "jwt-decode";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [login, { isLoading: loginLoading, error: loginError }] =
    useLoginMutation();

    console.log("Login Error:", login);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

 const onSubmit = async () => {
  try {
    // Simulate API response without actual server call
    const mockResult = {
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + 
                   "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIFVzZXIiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE1MTYyMzkwMjJ9." +
                   "dummy-signature-for-testing"
    };

    // Use mock data instead of actual API response
    const result = mockResult;
    
    // Decode the JWT token (even though it's mocked)
    const authData = {
      role: "ADMIN",  // Change to "USER" to test the error case
      name: "Admin User",
      sub: "1234567890"
    };

    const role = authData?.role?.toLowerCase();
    
    // Check role and show error if USER
    if (role === "user") {
      setError("role", {
        type: "manual",
        message: "Access Denied: Only admins can log in.",
      });
      toast({
        title: "User Not Found",
        description: "User not found",
        variant: "destructive",
      });
      return;
    }

    // Show success toast
    toast({
      title: "Welcome Admin",
      description: `Hello, ${authData.name}!`,
    });

    // Set token in cookies (this will work locally)
    shareWithCookies(
      "set",
      `${appConfiguration.appCode}token`,
      1440,
      result.accessToken
    );
    
    // Dispatch user data to Redux/store
    loadUserFromToken(dispatch);

    // Redirect to admin home
    window.location.href = "/kry-admin-portal/admin_home";
    
  } catch (error: any) {
    console.log("Login Error:", error);
    toast({
      title: "Login Failed",
      description: error?.message || "Invalid credentials",
      variant: "destructive",
    });
  }
};






//! The actual function.................. 
//  const onSubmit = async (data: any) => {
//     try {
//       const result = await login(data).unwrap();
//       const authData = jwtDecode(result?.accessToken || "") as any;

//       const role = authData?.role?.toLowerCase();
//       if (role === "USER") {
//         setError("role", {
//           type: "manual",
//           message: "Access Denied: Only admins can log in.",
//         });
//         toast({
//           title: "User Not Found",
//           description: "User not found",
//           variant: "destructive",
//         });
//         return;
//       }

//       toast({
//         title: "Welcome Admin",
//         description: `Hello, ${authData.name}!`,
//       });

//       shareWithCookies(
//         "set",
//         `${appConfiguration.appCode}token`,
//         1440,
//         result?.accessToken
//       );
//       loadUserFromToken(dispatch);

//       window.location.href = "/kry-admin-portal/admin_home"; // Redirect to admin home
//     } catch (error: any) {
//       console.log("Login Error:", error);
//       toast({
//         title: "Login Failed",
//         description: error?.message || "Invalid credentials",
//         variant: "destructive",
//       });
//     }
//   };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Admin Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message as string}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message as string}
              </p>
            )}
          </div>

          {/* Show Password Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showPassword"
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword" className="ml-2 text-sm">
              Show Password
            </label>
          </div>

            <Link to="/kry-admin-portal/admin-forget-password">
          <div>
            <p className="text-primary font-medium my-4">Forgot Password</p>
          </div>
          </Link>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loginLoading}
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            {loginLoading ? "Logging in..." : "Login"}
          </button>

          {/* Error Message */}
          {loginError && "data" in loginError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Login Error</AlertTitle>
              <AlertDescription>
                {(loginError.data as { message?: string })?.message ||
                  "Something went wrong!"}
              </AlertDescription>
            </Alert>
          )}

          {/* Role Restriction Error */}
          {errors.role && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>{String(errors.role.message)}</AlertDescription>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
}
