import ButtonLoader from "@/components/loader/ButtonLoader";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/components/store/api/authenticationApi";
import { selectUser } from "@/components/store/store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { removeFalsyValuesProperties } from "@/utils/helper/removeFalsyValuesProperties";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

export default function AccountDetails() {
  const user = useSelector(selectUser);
  const { id: userId } = user || {};
  const { toast } = useToast();
  const { data, isLoading, isError, refetch } = useGetUserByIdQuery(
    userId as string,
    {
      skip: !userId,
    }
  );

  const [updateUser, { isLoading: isUpdating, error }] =
    useUpdateUserMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("Male");
  const [maritalStatus, setMaritalStatus] = useState("Married");
  const [bloodGroup, setBloodGroup] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (data?.data) {
      const {
        name,
        email,
        contactNo,
        dateOfBirth,
        gender,
        maritalStatus,
        bloodGroup,
        address,
      } = data.data;
      setName(name || "");
      setEmail(email || "");
      setContactNo(contactNo || "");
      setDateOfBirth(dateOfBirth || "");
      setGender(gender || "Male");
      setMaritalStatus(maritalStatus || "Married");
      setBloodGroup(bloodGroup || "");
      setAddress(address || "");
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast({
        title: "User Id is missing!",
      });
      return;
    }

    const updatedUser = {
      name,
      email,
      contactNo,
      dateOfBirth,
      gender,
      maritalStatus,
      bloodGroup,
      address,
      ...(password ? { password } : {}),
    };

    try {
      const cleanData=removeFalsyValuesProperties(updatedUser, ["address", "bloodGroup", "maritalStatus", "gender", "dateOfBirth", "email"])
      const result = await updateUser({
        id: userId,
        data: cleanData,
      }).unwrap();
      if (result.success) {
        toast({
          title: "Update User Message",
          description: toastMessageGenerator("update", "user"),
        });
        refetch();
        setPassword("");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (!userId)
    return (
      <p className="text-center text-gray-600 mt-10">
        You must be logged in to view or update account details.
      </p>
    );
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#2563EB" size={50} />
      </div>
    );
  if (isError)
    return (
      <p className="text-center text-red-500 mt-10">Error loading user data.</p>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 pb-10 px-6">
      <div className="w-full max-w-4xl bg-white/80  backdrop-blur-lg shadow-lg rounded-xl p-6">
        <h2 className="text-lg lg:text-2xl font-semibold text-center text-gray-800 mb-6">
          Edit Account Details
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {/* Full Name */}
          <InputField
            label="Full Name *"
            type="text"
            value={name}
            setValue={setName}
            placeholder="Enter your full name"
            required
          />

          {/* Email */}
          <InputField
            label="Email *"
            type="email"
            value={email}
            setValue={setEmail}
            placeholder="Enter your email"
            required
          />

          {/* Contact Number */}
          <InputField
            label="Contact Number *"
            type="text"
            value={contactNo}
            setValue={setContactNo}
            placeholder="e.g. +880123456789"
          />

          {/* Date of Birth */}
          <InputField
            placeholder
            label="Date of Birth"
            type="date"
            value={dateOfBirth}
            setValue={setDateOfBirth}
          />

          {/* Gender */}
          <SelectField
            label="Gender"
            value={gender}
            setValue={setGender}
            options={["Male", "Female", "Other"]}
          />

          {/* Marital Status */}
          <SelectField
            label="Marital Status"
            value={maritalStatus}
            setValue={setMaritalStatus}
            options={["Married", "Unmarried"]}
          />

          {/* Blood Group */}
          <InputField
            label="Blood Group"
            type="text"
            value={bloodGroup}
            setValue={setBloodGroup}
            placeholder="e.g. A+, O-"
          />

          {/* Address */}
          <InputField
            label="Address"
            type="text"
            value={address}
            setValue={setAddress}
            placeholder="Enter your address"
          />

         

          {/* Save Changes Button */}
          <div className="col-span-full flex justify-center mt-5">
            <button
              type="submit"
              disabled={isUpdating}
              className="bg-blue-600 text-sm lg:text-lg font-semibold text-white px-3 lg:px-6 py-1.5 lg:py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
             {isLoading && <ButtonLoader/>} Save Changes
            </button>
          </div>

          {error && "data" in error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Update User</AlertTitle>
              <AlertDescription>
                {(error.data as { message?: string })?.message ||
                  "Something went wrong! Please try again."}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
}

// Reusable InputField Component
const InputField = ({
  label,
  type,
  value,
  setValue,
  placeholder,
  required = false,
}) => (
  <div>
    <label className="block text-gray-700 font-medium">{label}</label>
    <input
      type={type}
      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      required={required}
    />
  </div>
);

// Reusable SelectField Component
const SelectField = ({ label, value, setValue, options }) => (
  <div>
    <label className="block text-gray-700 font-medium">{label}</label>
    <select
      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);
