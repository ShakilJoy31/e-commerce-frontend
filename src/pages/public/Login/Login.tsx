import { loginCustomerSchema } from "@/components/schemas/loginSchema";
import { useLoginCustomerMutation } from "@/components/store/api/authenticationApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { appConfiguration } from "@/utils/constant/appConfiguration";
import { loadUserFromToken } from "@/utils/helper/loadUserFromToken";
import { shareWithCookies } from "@/utils/helper/shareWithCookies";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const navigate = useNavigate();
  const [login, { isLoading: loginLoading, error: loginError }] =
    useLoginCustomerMutation();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const location = useLocation();

   const from = location?.state?.from?.pathname || '/'
// console.log(from)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginCustomerSchema),
  });

  const onSubmit = async (data: any) => {
    if (!captchaChecked) {
      toast({
        title: "Captcha Required",
        description: "Please confirm you're not a robot.",
        variant: "destructive",
      });
      return;
    }

    const result = await login(data);
    const authData = jwtDecode(result?.data?.accessToken || "") as any;

    if (result?.data?.success) {
      const role = authData?.role?.toLowerCase();

      // Restrict Admins from logging in
      if (role === "admin") {
        toast({
          title: "User Not Found",
          description: "User not found",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "User Login Succesful.",
        description: toastMessageGenerator("login", result?.data?.message),
      });

      shareWithCookies(
        "set",
        `${appConfiguration.appCode}token`,
        1440,
        result?.data?.accessToken
      );
      loadUserFromToken(dispatch);

       navigate(from, { replace: true });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="max-w-xl w-full mx-auto px-10 py-16 bg-white shadow-lg sm:rounded-3xl">
        <div className="">
          <h1 className="text-4xl font-semibold text-center mb-3 text-primary">Login</h1>
          <p className="text-lg text-gray-500 text-center mb-2">Sign in to continue your journey</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium mb-1">
              Phone Number
              </label>
              <input
                type="text"
                placeholder="Enter Your Phone Number"
                {...register("contactNo")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.contactNo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contactNo.message as string}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message as string}
                </p>
              )}
            </div>

            <div>
              <Link to="/forget-password">
              <p className=" text-primary font-semibold">Forgot Password?</p>
              </Link>
            </div>

            {/* Captcha Checkbox */}
            <div className="flex items-center gap-4 p-4 border rounded-lg shadow-sm bg-gray-50 w-full sm:w-2/4 mx-auto">
              <input
                type="checkbox"
                id="captcha"
                checked={captchaChecked}
                onChange={() => setCaptchaChecked(!captchaChecked)}
                className="w-5 h-5"
              />
              <label
                htmlFor="captcha"
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className="text-sm font-medium">I'm not a robot</span>
                <img
                  src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                  alt="captcha"
                  className="w-6 h-6"
                />
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-indigo-500 text-white font-semibold rounded-lg px-6 py-2 hover:bg-indigo-600 transition"
              >
                {loginLoading ? "Logging in..." : "Login"}
              </button>
            </div>

            {/* Error Alert */}
            {loginError && "data" in loginError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login Error</AlertTitle>
                <AlertDescription>
                  {(loginError.data as { message?: string })?.message ||
                    "Something went wrong! Try again."}
                </AlertDescription>
              </Alert>
            )}
          </form>

          <p className="text-gray-600 text-sm mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/registration" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
