import AddressCard from "@/components/common/card/AddressCard";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import {
  useGetUserByIdQuery,
  useUpdateBillingInfoMutation,
} from "@/components/store/api/authenticationApi";
import { selectUser } from "@/components/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddressForm from "./AddressForm";
import { useToast } from "@/components/ui/use-toast";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { useUpdateShippingInfoMutation } from "@/components/store/api/shippingAddressApi";


const AddressSection: React.FC = () => {
  const user = useSelector(selectUser);
  const { toast } = useToast();
  const { data: userData, isLoading } = useGetUserByIdQuery(user?.id);
  const [updateBillingInfo, {isLoading:billingAddressLoading, error:billingError}] = useUpdateBillingInfoMutation();
  const [updateShippingInfo, {isLoading:shippingAddressloading, error:shippingError}] = useUpdateShippingInfoMutation();

  const [billingAddress, setBillingAddress] = useState({
    address: "",
    city: "",
    zipCode: "",
    district: "",
    phone: "",
    email: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    zipCode: "",
    district: "",
    phone: "",
    email: "",
  });

  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [isEditingShipping, setIsEditingShipping] = useState(false);

  useEffect(() => {
    if (userData?.data) {
      const billing = userData.data.UserBillingInfo[0] || {};
      const shipping = userData.data.UserShippingInfo[0] || {};

      setBillingAddress({
        address: billing.address || "",
        city: billing.city || "",
        zipCode: billing.zipCode || "",
        district: billing.district || "",
        phone: billing.phone || "",
        email: userData.data.email || "",
      });

      setShippingAddress({
        address: shipping.address || "",
        city: shipping.city || "",
        zipCode: shipping.zipCode || "",
        district: shipping.district || "",
        phone: shipping.phone || "",
        email: userData.data.email || "",
      });
    }
  }, [userData]);

  const handleSaveBilling = async (data: any) => {
    try {
      const result = await updateBillingInfo({
        address: data.address,
        city: data.city,
        zipCode: data.zipCode,
        district: data.district,
        phone: data.phone,
      }).unwrap();
      if (result.success) {
        toast({
          title: "Update Billing Address Message",
          description: toastMessageGenerator("update", "billing-address"),
        });
        setBillingAddress(data);
        setIsEditingBilling(false);
      }
    } catch (error) {
      console.error("Failed to update billing address", error);
    }
  };

  const handleSaveShipping = async (data: any) => {
    try {
      const result = await updateShippingInfo({
        address: data.address,
        city: data.city,
        zipCode: data.zipCode,
        district: data.district,
        phone: data.phone,
      }).unwrap();
      if (result.success) {
        toast({
          title: "Update Shipping Address Message",
          description: toastMessageGenerator("update", "shipping-address"),
        });
        setShippingAddress(data);
        setIsEditingShipping(false);
      }
    } catch (error) {
      console.error("Failed to update shipping address", error);
    }
  };

  if (isLoading) {
    return <p className="text-center font-semibold mt-5">Loading...</p>;
  }

  return (
    <SectionWrapper>
      <div className="my-8 lg:px-4">
        <div className="bg-purple-100 text-gray-700 text-sm rounded-lg p-3 mb-4">
          <p>
            <span className="text-blue-500 font-semibold pr-1">●</span>
            The following addresses will be used on the checkout page by
            default.
          </p>
        </div>

        <div className="flex flex-wrap -mx-4">
          {isEditingBilling ? (
            <AddressForm
              title="BILLING ADDRESS"
              addressData={billingAddress}
              onSave={handleSaveBilling}
              loading={billingAddressLoading}
              err={billingError}
              onCancel={() => setIsEditingBilling(false)}
            />
          ) : (
            <AddressCard
              title="BILLING ADDRESS"
              address={Object.values(billingAddress)}
              onEdit={() => setIsEditingBilling(true)}
            />
          )}

          {isEditingShipping ? (
            <AddressForm
              title="SHIPPING ADDRESS"
              addressData={shippingAddress}
              loading={shippingAddressloading}
              err={shippingError}
              onSave={handleSaveShipping}
              onCancel={() => setIsEditingShipping(false)}
            />
          ) : (
            <AddressCard
              title="SHIPPING ADDRESS"
              address={Object.values(shippingAddress)}
              onEdit={() => setIsEditingShipping(true)}
            />
          )}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AddressSection;
