import ButtonLoader from "@/components/loader/ButtonLoader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { addressSchema } from "@/schemas/user/addressSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type AddressFormValues = z.infer<typeof addressSchema>;

const AddressForm: React.FC<{
  title: string;
  addressData: AddressFormValues;
  onSave: (data: AddressFormValues) => void;
  onCancel: () => void;
  loading: boolean;
  err?: any;
}> = ({ title, addressData, onSave, onCancel, loading, err }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    defaultValues: addressData,
    resolver: zodResolver(addressSchema),
  });

  const onSubmit = (data: AddressFormValues) => {
    onSave(data);
  };

  return (
    <div className="border rounded-lg shadow-sm p-5">
      <h3 className="font-semibold text-gray-700 mb-4">{title}</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Address */}
          <div>
            <input
              type="text"
              placeholder="Address"
              {...register("address")}
              className="w-full border p-2 rounded mb-2"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          {/* Town / City */}
          <div>
            <input
              type="text"
              placeholder="Town / City"
              {...register("city")}
              className="w-full border p-2 rounded mb-2"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city.message}</p>
            )}
          </div>

          {/* Postcode / ZIP */}
          <div>
            <input
              type="text"
              placeholder="Postcode / ZIP"
              {...register("zipCode")}
              className="w-full border p-2 rounded mb-2"
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
            )}
          </div>

          {/* District */}
          <div>
            <input
              type="text"
              placeholder="District"
              {...register("district")}
              className="w-full border p-2 rounded mb-2"
            />
            {errors.district && (
              <p className="text-red-500 text-sm">{errors.district.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              type="text"
              placeholder="Phone"
              {...register("phone")}
              className="w-full border p-2 rounded mb-2"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full border p-2 rounded mb-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Save and Cancel Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="bg-blue-500 flex items-center gap-1 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {loading && <ButtonLoader />} Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
        {err && "data" in err && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Address Error</AlertTitle>
            <AlertDescription>
              {(err.data as { message?: string })?.message ||
                "Something went wrong! Please try again."}
            </AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
};

export default AddressForm;
