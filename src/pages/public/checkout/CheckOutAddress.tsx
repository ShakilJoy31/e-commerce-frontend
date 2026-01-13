import InputWrapper from "@/components/common/wrapper/InputWrapper";
import Input from "@/components/ui/input";
import { useEffect, useState } from "react";
// import SearchableSelect from "@/pages/dashboard/products/SearchableSelect";
import { selectUser } from "@/components/store/store";
import { useSelector } from "react-redux";
import { useGetSingleUserQuery } from "@/components/store/api/user/userApi";
import { FaStarOfLife } from "react-icons/fa";

const CheckOutAddress = ({ errors, setValue, watch }: any) => {
  const [divisions, setDivisions] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [thanas, setThanas] = useState<any[]>([]);
  const [phone, setPhone] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedThana, setSelectedThana] = useState<string>(""); 
  const [loading, setLoading] = useState<boolean>(true);

  console.log(selectedThana, selectedDistrict, selectedDivision, thanas, districts, divisions);

  const user = useSelector(selectUser);
  const { data: singleUser, isSuccess } = useGetSingleUserQuery(user?.id);

  const loadDivisions = async (shippingAddress: any) => {
    try {
      const response = await fetch("/division.json");
      const data = await response.json(); 
      setDivisions(data);

      if (shippingAddress?.district) {
        const division = data.find(
          (d: any) => d.division === shippingAddress.district
        );
        if (division) {
          setSelectedDivision(division.division);
          setDistricts(division.districts);

          if (shippingAddress?.city) {
            const district = division.districts.find(
              (d: any) => d.name === shippingAddress.city
            );
            if (district) {
              setSelectedDistrict(district.name);
              setThanas(district.thanas);

              if (shippingAddress?.thana) {
                setSelectedThana(shippingAddress.thana);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to load divisions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuccess && singleUser) {
      const shippingAddress =
        singleUser?.data?.OrderShippingInfo?.[0] || singleUser?.data;

      setValue("shippingAddress.0.name", shippingAddress.name || "");
      setValue("shippingAddress.0.email", shippingAddress.email || "");
      setValue("shippingAddress.0.address", shippingAddress.address || "");
      setValue("shippingAddress.0.district", shippingAddress.district || "");
      setValue("shippingAddress.0.city", shippingAddress.city || "");
      setValue("shippingAddress.0.thana", shippingAddress.thana || "");

      const phoneNumber = shippingAddress.phone || singleUser.data.contactNo;
      if (phoneNumber && phoneNumber !== "N/A") {
        // Remove +880 prefix if present and ensure it starts with 0
        let formattedPhone = phoneNumber.replace(/^\+880/, '');
        if (!formattedPhone.startsWith('0') && formattedPhone.length > 0) {
          formattedPhone = '0' + formattedPhone;
        }
        setPhone(formattedPhone);
        setValue("shippingAddress.0.phone", formattedPhone);
      }

      loadDivisions(shippingAddress);
    }
  }, [isSuccess, singleUser, setValue]);
 

  // Phone number handling
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Only allow numbers
    if (/[^0-9]/.test(value)) return;
    
    // Ensure it starts with 0 and has max 11 digits
    if (value.length > 0 && !value.startsWith('0')) {
      value = '0' + value;
    }
    
    if (value.length <= 11) {
      setPhone(value);
      setValue("shippingAddress.0.phone", value);
    }
  };

  if (loading) {
    return <div>Loading address data...</div>;
  }

  return (
    <>
      {/* Name */}
      <InputWrapper
        label=""
        labelFor="shippingAddress.0.name"
        error={errors?.shippingAddress?.[0]?.name?.message}
      >
        <div className="flex items-center gap-2 mb-1">
          <label
            htmlFor="shippingAddress.0.name"
            className="text-sm font-medium"
          >
            Name
          </label>
          <FaStarOfLife className="h-2 w-2 text-red-500" />
        </div>
        <Input
          placeholder="Name"
          value={watch("shippingAddress.0.name") || ""}
          onChange={(e) => setValue("shippingAddress.0.name", e.target.value)}
          errorMessage={errors?.shippingAddress?.[0]?.name?.message}
        />
      </InputWrapper>

      {/* Email */}
      <InputWrapper
        label=""
        labelFor="shippingAddress.0.email"
        error={errors?.shippingAddress?.[0]?.email?.message}
      >
        <div className="flex items-center gap-2 mb-1">
          <label
            htmlFor="shippingAddress.0.email"
            className="text-sm font-medium"
          >
            Email
          </label>
          <FaStarOfLife className="h-2 w-2 text-red-500" />
        </div>
        <Input
          placeholder="Email"
          value={watch("shippingAddress.0.email") || ""}
          onChange={(e) => setValue("shippingAddress.0.email", e.target.value)}
          errorMessage={errors?.shippingAddress?.[0]?.email?.message}
        />
      </InputWrapper>

      {/* Phone */}
      <InputWrapper
        label=""
        labelFor="shippingAddress.0.phone"
        error={errors?.shippingAddress?.[0]?.phone?.message}
      >
        <div className="flex items-center gap-2 mb-1">
          <label
            htmlFor="shippingAddress.0.phone"
            className="text-sm font-medium"
          >
            Phone
          </label>
          <FaStarOfLife className="h-2 w-2 text-red-500" />
        </div>
        <Input
          placeholder="Phone (e.g. 01761043883)"
          value={watch("shippingAddress.0.phone") || phone}
          onChange={handlePhoneChange}
          errorMessage={errors?.shippingAddress?.[0]?.phone?.message}
        />
      </InputWrapper>
    </>
  );
};

export default CheckOutAddress;