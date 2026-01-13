import ButtonLoader from "@/components/loader/ButtonLoader";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/components/store/api/authenticationApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { removeFalsyValuesProperties } from "@/utils/helper/removeFalsyValuesProperties";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { AlertCircle, Star } from "lucide-react";
import { useEffect, useState } from "react";

// Star Rating Component
const StarRating = ({ rating, setRating }: { rating: number; setRating: (value: number) => void }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center">
      <label className="block text-gray-700 text-lg font-semibold mr-2">Star Mark</label>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <Star
              className={`h-5 w-5 ${
                (hoverRating || rating) >= star
                  ? "fill-blue-500 text-blue-500"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
      <span className="ml-2 text-gray-600">{rating}/5</span>
    </div>
  );
};

export default function EditCustomer({ id, setIsDialogOpen }: any) {
  const { toast } = useToast();
  const { data, isLoading, isError, refetch } = useGetUserByIdQuery(id);

  console.log(data)

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
  const [starMark, setStarMark] = useState(0);

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
        starMark,
      } = data.data;
      setName(name || "");
      setEmail(email || "");
      setContactNo(contactNo || "");
      setDateOfBirth(dateOfBirth || "");
      setGender(gender || "Male");
      setMaritalStatus(maritalStatus || "Married");
      setBloodGroup(bloodGroup || "");
      setAddress(address || "");
      setStarMark(starMark || 0);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
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
      starMark,
      ...(password ? { password } : {}),
    };

    const cleanData=removeFalsyValuesProperties(updatedUser, ["address", "dateOfBirth", "bloodGroup", "maritalStatus", "gender", "starMark", "contactNo"])

    try {
      const result = await updateUser({
        id: id,
        data: cleanData,
      }).unwrap();
      if (result.success) {
        toast({
          title: "Update User Message",
          description: toastMessageGenerator("update", "user"),
        });
        refetch();
        setPassword("");
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (isLoading)
    return <div className="h-full"><LoaderSpinner/></div>
  if (isError)
    return (
      <p className="text-center text-red-500 mt-10">Error loading user data.</p>
    );

  return (
    <div className="flex justify-center items-center px-6">
      <div className="w-full max-w-4xl backdrop-blur-lg shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Edit Customer
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
            label="Contact Number"
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

          {/* Star Rating */}
          <div className="mt-5">
            <StarRating rating={starMark} setRating={setStarMark} />
          </div>

          {/* Save Changes Button */}
          <div className="col-span-full flex justify-center mt-5">
            <button
              type="submit"
              disabled={isUpdating}
              className="bg-blue-600 font-semibold text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              {isLoading && <ButtonLoader />} Save 
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