import {
  useOtpGenerateForgetMutation,
  useVerifyOtpForgetMutation,
  useForgetPasswordMutation,
} from "@/components/store/api/authenticationApi";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ApiError {
  data?: {
    message?: string;
  };
}

const ForgetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [contactNo, setContactNo] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  const [otpGenerateForget, { isLoading: isSendingOtp }] = useOtpGenerateForgetMutation();
  const [verifyOtpForget, { isLoading: isVerifyingOtp }] = useVerifyOtpForgetMutation();
  const [forgetPassword, { isLoading: isResetting }] = useForgetPasswordMutation();

  // Check for existing verification state on mount
  useEffect(() => {
    const savedState = localStorage.getItem('forgetPasswordState');
    if (savedState) {
      const { contactNo, otpSent, otpVerified, expiry } = JSON.parse(savedState);
      const now = new Date().getTime();

      if (expiry > now) {
        setContactNo(contactNo);
        setOtpSent(otpSent);
        setOtpVerified(otpVerified);

        if (otpSent && !otpVerified) {
          const remainingTime = Math.max(0, Math.floor((expiry - now) / 1000));
          setTimeLeft(remainingTime);
          startTimer(remainingTime);
        }
      } else {
        // Clear expired state
        localStorage.removeItem('forgetPasswordState');
        Cookies.remove("otpForgetToken");
      }
    }
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (otpSent && !otpVerified && otpInputRefs.current[0]) {
      otpInputRefs.current[0]?.focus();
    }
  }, [otpSent, otpVerified]);

  const startTimer = (duration: number) => {
    setTimeLeft(duration);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveStateToStorage = (state: {
    contactNo: string;
    otpSent: boolean;
    otpVerified: boolean;
    expiry?: number;
  }) => {
    localStorage.setItem('forgetPasswordState', JSON.stringify(state));
  };

  const clearStateFromStorage = () => {
    localStorage.removeItem('forgetPasswordState');
    Cookies.remove("otpForgetToken");
  };

  const handleResetForm = () => {
    setContactNo("");
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setTimeLeft(0);
    clearStateFromStorage();
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleSendOtp = async () => {
    if (!contactNo) {
      return toast({
        title: "Error",
        description: "Phone number is required",
        variant: "destructive",
      });
    }

    // Check if phone number is exactly 11 digits
    if (!/^\d{11}$/.test(contactNo)) {
      return toast({
        title: "Error",
        description: "Phone number must be exactly 11 digits",
        variant: "destructive",
      });
    }

    try {
      const response = await otpGenerateForget({ contactNo }).unwrap();
      if (response.success) {
        Cookies.set("otpForgetToken", response.token, { expires: 5 / 60 / 24 }); // 5 minutes
        setOtpSent(true);

        // Set OTP expiry time (2 minutes from now)
        const expiryTime = new Date().getTime() + 2 * 60 * 1000;
        saveStateToStorage({
          contactNo,
          otpSent: true,
          otpVerified: false,
          expiry: expiryTime
        });

        startTimer(2 * 60);

        toast({
          title: "OTP Sent",
          description: "OTP has been sent to your phone number",
        });
      }
    } catch (err: unknown) {
      console.error("Send OTP error:", err);
      const apiError = err as ApiError;
      toast({
        title: "Error",
        description: apiError?.data?.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^[0-9]*$/.test(value)) {
      const newOtp = otp.split('');
      newOtp[index] = value;
      const joinedOtp = newOtp.join('');
      setOtp(joinedOtp);

      // Auto focus to next input
      if (value && index < 5 && otpInputRefs.current[index + 1]) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpInputRefs.current[index - 1]) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter' && otp.length === 6) {
      handleVerifyOtp();
    }
  };

  const handleVerifyOtp = async () => {
    const token = Cookies.get("otpForgetToken");
    if (!otp || otp.length !== 6 || !token) {
      return toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
    }

    if (timeLeft <= 0) {
      return toast({
        title: "Error",
        description: "OTP has expired. Please request a new one.",
        variant: "destructive",
      });
    }

    try {
      const response = await verifyOtpForget({ token, otp }).unwrap();
      if (response.success) {
        // Update the token cookie with the new verified token
        Cookies.set("otpForgetToken", response.token, { expires: 10 / 60 / 24 }); // 10 minutes

        setOtpVerified(true);
        clearInterval(timerRef.current);

        // Update state in storage
        saveStateToStorage({
          contactNo,
          otpSent: true,
          otpVerified: true,
          expiry: new Date().getTime() + 10 * 60 * 1000 // 10 minutes for password reset
        });

        toast({
          title: "OTP Verified",
          description: "Your OTP has been verified",
        });
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
    }

    try {
      const token = Cookies.get("otpForgetToken");

      const response = await forgetPassword({
        token,
        newPassword,
        confirmPassword,
      }).unwrap();

      if (response.success) {
        toast({
          title: "Success",
          description: "Password reset successfully. You can now log in.",
        });
        clearStateFromStorage();
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.error("Password reset error:", err);

      let errorMessage = "An unknown error occurred";

      // Check if it's an error with a message
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      // Check if it's your specific API error structure
      else if (typeof err === 'object' && err !== null && 'data' in err) {
        const apiError = err as { data: { message?: string } };
        if (apiError.data?.message) {
          errorMessage = apiError.data.message;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !otpSent && contactNo) {
      handleSendOtp();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 -mt-16 flex flex-col justify-center items-center sm:py-12">
      <div className="max-w-xl w-full mx-auto px-10 py-16 bg-white shadow-lg sm:rounded-3xl">
        <h1 className="text-4xl font-semibold text-center mb-6">
          Forgot Password
        </h1>

        <form onSubmit={handleResetPassword} className="">
          {/* Phone input */}
          {!otpSent && (
            <>
              <label className="block text-sm font-medium mb-3">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="Enter your phone number"
                value={contactNo}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                  setContactNo(value);
                }}
                onKeyDown={handleKeyDown}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSendingOtp}
                className="bg-primary text-white mt-6 font-medium rounded-lg px-4 py-2 w-full hover:bg-indigo-600 transition"
              >
                {isSendingOtp ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {/* OTP input */}
          {otpSent && !otpVerified && (
            <>
              <div className="flex justify-between items-center text-center my-4">
                <label className="block text-sm font-medium">
                  Enter the 6-digit code sent to {contactNo}
                </label>
                {timeLeft > 0 ? (
                  <div className="text-sm text-gray-600">
                    OTP expires in: <span className="font-medium">{formatTime(timeLeft)}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
              <div className="flex gap-3 my-4 justify-between">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={otp[index] || ''}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-8 h-8 lg:w-12 lg:h-12 border border-gray-300 rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ))}
              </div>

              <div className="flex justify-between items-center mb-4">
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp || otp.length !== 6}
                  className="bg-primary text-white font-medium rounded-lg px-4 py-2 mt-4 hover:bg-indigo-600 transition disabled:opacity-70 w-full"
                >
                  {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                </button>
              </div>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-sm text-gray-600 hover:text-gray-800 font-medium underline"
                >
                  Wrong number? Reset form
                </button>
              </div>
            </>
          )}

          {/* Password reset */}
          {otpVerified && (
            <>
              <div className="relative">
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-1 mt-2">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <Eye size={18} />
                  ) : (
                    <EyeOff size={18} />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="bg-indigo-500 text-white font-medium rounded-lg mt-4 px-4 py-2 w-full hover:bg-indigo-600 transition"
              >
                {isResetting ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;