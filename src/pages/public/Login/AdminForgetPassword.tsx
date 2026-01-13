import { useForgetPasswordRequestMutation } from "@/components/store/api/authenticationApi";
import { useState } from "react"; 

const AdminForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [forgetPasswordRequest, { isLoading }] = useForgetPasswordRequestMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
     await forgetPasswordRequest({ email }).unwrap();
      setSuccessMessage("Please check your mail.");
    } catch (err) {
        console.log(err)
      setErrorMessage("Failed to send email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col -mt-16 bg-gray-100 justify-center items-center">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Admin Forgot Password
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {successMessage && (
              <p className="text-green-600 text-sm mt-2">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Mail"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminForgetPassword;
