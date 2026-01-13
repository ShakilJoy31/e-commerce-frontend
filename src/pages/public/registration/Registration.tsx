import {
  useOtpGenerateMutation,
  useVerifyOtpMutation,
  useCreateCustomerMutation,
  useVerifyPhoneNumberMutation,
} from "@/components/store/api/authenticationApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { requiredStar } from "@/utils/helper/requiredStar";

type ApiError = {
  status: number;
  data: {
    message?: string;
    error?: string;
  };
};

export default function Registration() {
  const otpToken = Cookies.get("otpToken");
  const verifyToken = Cookies.get("verifiedToken");

  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    contactNo: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(otpToken || verifyToken);
  const [otpVerified, setOtpVerified] = useState(verifyToken);
  const [countdown, setCountdown] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const [otpGenerate, { isLoading: isOtpLoading }] = useOtpGenerateMutation();
  const [verifyOtp, { isLoading: isVerifyLoading }] = useVerifyOtpMutation();
  const [verifyPhoneNumber] = useVerifyPhoneNumberMutation();
  const [createCustomer, { isLoading: isCreateLoading, error }] =
    useCreateCustomerMutation();

  // Load timer and phone number from localStorage on component mount
  useEffect(() => {
    const savedEndTime = localStorage.getItem("otpTimerEnd");
    if (savedEndTime) {
      const endTime = parseInt(savedEndTime);
      const now = new Date().getTime();
      const remainingTime = Math.max(0, Math.floor((endTime - now) / 1000));

      if (remainingTime > 0) {
        setCountdown(remainingTime);
        setTimerActive(true);
        setOtpSent(true);
      } else {
        localStorage.removeItem("otpTimerEnd");
      }
    }

    // Load saved phone number from localStorage
    const savedPhoneNumber = localStorage.getItem("registrationPhoneNumber");
    if (savedPhoneNumber) {
      setFormData((prev) => ({
        ...prev,
        contactNo: savedPhoneNumber,
      }));
    }
  }, []);

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimerActive(false);
            localStorage.removeItem("otpTimerEnd");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerActive, countdown]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate password when it changes
    if (name === "password") {
      if (value.length > 0 && value.length < 6) {
        setPasswordError("Password must be at least 6 characters");
      } else {
        setPasswordError("");
      }
    }

    // Save phone number to localStorage when it changes
    if (name === "contactNo") {
      localStorage.setItem("registrationPhoneNumber", value);
    }
  };

  const handleSendOtp = async () => {
    if (!formData.contactNo) {
      toast({
        title: "Error",
        description: "Phone number is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await otpGenerate({
        contactNo: formData.contactNo,
      }).unwrap();

      if (response.success) {
        Cookies.set("otpToken", response.token, { expires: 5 / 60 / 24 }); // 5 minutes
        setOtpSent(true);

        // Set 30 second countdown
        const endTime = new Date().getTime() + 30 * 1000;
        localStorage.setItem("otpTimerEnd", endTime.toString());
        setCountdown(30);
        setTimerActive(true);

        toast({
          title: "OTP Sent",
          description: "OTP has been sent to your phone number",
        });
      }
    } catch (err) {
      console.error("OTP generation failed:", err);
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckPhoneNumberExists = async () => {
    try {
      const result = await verifyPhoneNumber({
        phone: formData.contactNo,
      }).unwrap();
      console.log(result);
      if (result?.isUser) {
        toast({
          title: "Error",
          description: "This phone number is already registered.",
          variant: "destructive",
        });
      } else {
        handleSendOtp();
      }
    } catch (error) {
      console.error("Error verifying phone number:", error);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await otpGenerate({
        contactNo: formData.contactNo,
      }).unwrap();

      if (response.success) {
        Cookies.set("otpToken", response.token, { expires: 5 / 60 / 24 });

        // Reset timer to 30 seconds
        const endTime = new Date().getTime() + 30 * 1000;
        localStorage.setItem("otpTimerEnd", endTime.toString());
        setCountdown(30);
        setTimerActive(true);

        toast({
          title: "OTP Resent",
          description: "New OTP has been sent to your phone number",
        });
      }
    } catch (err) {
      console.error("OTP resend failed:", err);
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast({
        title: "Error",
        description: "OTP is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = Cookies.get("otpToken");
      if (!token) {
        throw new Error("OTP token not found");
      }

      const response = await verifyOtp({ token, otp }).unwrap();

      if (response.success) {
        Cookies.set("verifiedToken", response.token, { expires: 15 / 60 / 24 }); // 15 minutes
        setOtpVerified(true);
        localStorage.removeItem("otpTimerEnd");
        setTimerActive(false);
        toast({
          title: "OTP Verified",
          description: "Your phone number has been verified",
        });
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (!captchaChecked) {
      toast({
        title: "Captcha Required",
        description: "Please confirm you are not a robot.",
        variant: "destructive",
      });
      return;
    }

    if (!otpVerified) {
      toast({
        title: "OTP Required",
        description: "Please verify your phone number first",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = Cookies.get("verifiedToken");
      if (!token) {
        throw new Error("Verification token not found");
      }

      const userData = {
        name: formData.firstName,
        email: formData.email,
        contactNo: formData.contactNo.toString(),
        password: formData.password,
        role: "USER" as const,
      };

      const response = await createCustomer({ token, userData }).unwrap();

      if (response?.success) {
        // Clear saved phone number on successful registration
        localStorage.removeItem("registrationPhoneNumber");

        toast({
          title: "Registration Successful",
          description: "Your account has been created. Please log in.",
        });

        Cookies.remove("otpToken");
        Cookies.remove("verifiedToken");
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.error("Registration failed:", err);
      toast({
        title: "Registration Error",
        description: "Please check your information or try again.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex py-16 border justify-center bg-gray-100  px-4">
      <div className="w-full max-w-xl p-8 bg-white shadow-lg rounded-xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-[#2C298E]">Register</h1>
          <p className="text-lg text-gray-500 mt-3">
            Create an account to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name {requiredStar}</label>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address {requiredStar}
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number {requiredStar}
            </label>
            <input
              type="number"
              name="contactNo"
              placeholder="Phone number"
              value={formData.contactNo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {!otpSent && (
              <button
                type="button"
                onClick={handleCheckPhoneNumberExists}
                disabled={isOtpLoading}
                className="bg-indigo-500 text-white font-medium rounded-lg px-4 py-2 hover:bg-indigo-600 transition disabled:opacity-70 w-full mt-3"
              >
                {isOtpLoading ? "Sending..." : "Send OTP"}
              </button>
            )}
          </div>

          {otpSent && !otpVerified && (
            <div className="items-end gap-2">
              <div className="">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium">
                    Enter the 6-digit code
                  </label>

                  {countdown > 0 ? (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">
                        Resend in: {formatTime(countdown)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <label className="block text-sm font-medium">
                        Didn't receive the code?
                      </label>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        Resend OTP
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 my-4 w-full justify-between">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={otp[index] || ""}
                      onChange={(e) => {
                        const newOtp = otp.split("");
                        newOtp[index] = e.target.value;
                        setOtp(newOtp.join(""));

                        // Auto focus to next input
                        if (e.target.value && index < 5) {
                          document
                            .getElementById(`otp-input-${index + 1}`)
                            ?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        // Handle backspace to focus previous input
                        if (e.key === "Backspace" && !otp[index] && index > 0) {
                          document
                            .getElementById(`otp-input-${index - 1}`)
                            ?.focus();
                        }
                      }}
                      id={`otp-input-${index}`}
                      className="w-8 h-8 lg:w-12 lg:h-12 border border-gray-300 rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifyLoading || otp.length !== 6}
                  className="bg-indigo-500 text-white font-medium rounded-lg px-4 py-2 hover:bg-indigo-600 transition disabled:opacity-70 w-full"
                >
                  {isVerifyLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </div>
          )}

          {otpVerified && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
              Phone number verified successfully
            </div>
          )}
          {otpVerified && (
            <>
              {/* password */}
              {/* password */}
              <div className="relative">
                <label className="block text-sm font-medium mb-1">
                  Password {requiredStar}
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min-6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full border ${
                    passwordError ? "border-red-500" : "border-gray-300"
                  } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                )}
              </div>

              {/* confirm password */}
              <div className="relative">
                <label className="block text-sm font-medium mb-1">
                  Confirm Password {requiredStar}
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <Eye size={18} />
                  ) : (
                    <EyeOff size={18} />
                  )}
                </button>
              </div>

              {/* captcha */}
              <div className="flex items-center gap-4 p-4 border rounded-lg shadow-sm bg-gray-50 w-full sm:w-2/4 mx-auto">
                <input
                  type="checkbox"
                  id="captcha"
                  checked={captchaChecked}
                  onChange={() => setCaptchaChecked(!captchaChecked)}
                  className="w-5 h-5"
                  required
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

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-indigo-500 text-white font-medium rounded-lg px-6 py-2 hover:bg-indigo-600 transition disabled:opacity-70"
                  disabled={isCreateLoading || !otpVerified}
                >
                  {isCreateLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </>
          )}

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </p>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Registration Error</AlertTitle>
              <AlertDescription>
                {(error as ApiError)?.data?.message ||
                  (error as ApiError)?.data?.error ||
                  "Something went wrong! Try again."}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
}
