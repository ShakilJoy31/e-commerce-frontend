import { useGetSingleUserQuery } from "@/components/store/api/user/userApi";
import { selectUser } from "@/components/store/store";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import {
  RiContactsLine,
  RiSmartphoneLine,
  RiMailLine,
  RiUploadLine,
} from "react-icons/ri";
import { FaBoxOpen } from "react-icons/fa";
import TextArea from "@/components/ui/text-area";
import { useAddThumbnailMutation } from "@/components/store/api/file/fileApi";
import { useToast } from "@/components/ui/use-toast";
import { useCreatePreOrderMutation } from "@/components/store/api/preOrder/preorderApi";
import { removeFalsyValuesProperties } from "@/utils/helper/removeFalsyValuesProperties";

const PreOrderForm = () => {
  const { toast } = useToast();
  const user = useSelector(selectUser);
  const { data: singleUser } = useGetSingleUserQuery(user?.id);
  const [addThumbnail, { isLoading: addThumbnailLoading }] =
    useAddThumbnailMutation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createPreOrder, { isLoading }] = useCreatePreOrderMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productName: "",
      image: "",
      name: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  useEffect(() => {
    if (singleUser?.data?.OrderShippingInfo?.[0]) {
      const shippingInfo = singleUser.data.OrderShippingInfo[0];
      reset({
        name: shippingInfo.name || "",
        phone: shippingInfo.phone || "",
        email: shippingInfo.email || "",
        address: shippingInfo.address || "",
      });
    }
  }, [singleUser, reset, watch]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set preview immediately
    setPreviewUrl(URL.createObjectURL(file));

    // Prepare form data for upload
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await addThumbnail(formData).unwrap();
      if (response?.data) {
        setValue("image", response.data[0]);
      }
    } catch (error) {
      console.error("Upload error:", error);
      // Reset preview if upload fails
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onSubmit = async (data: any) => {
    
    try {
    const cleanDate=removeFalsyValuesProperties(data, ["image"])
      const result = await createPreOrder(cleanDate).unwrap();
      if (result.success) {
        toast({
          title: "Pre-order created successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Pre-order error",
        // @ts-ignore
        description: `${error?.data?.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-full mb-4 mx-auto">
          <FaBoxOpen className="text-indigo-600 text-3xl" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Pre-Order Request</h2>
        <p className="text-gray-500 mt-2">
          Reserve your product before release
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              Product Name / Link <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                {...register("productName", {
                  required: "Product name is required",
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Enter product name or link"
              />
              <FaBoxOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {errors.productName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.productName.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              Product Image
            </label>
            <div className="relative">
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors"
                >
                  <RiUploadLine className="text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {previewUrl ? "Change image" : "Choose an image"}
                  </span>
                </button>
              </div>
              <input type="hidden" {...register("image")} />
              {previewUrl && (
                <div className="mt-2">
                  <div className="relative w-20 h-20 border rounded-md overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setValue("image", "");
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="absolute -top-2 right-0.5"
                    >
                      <span className="text-red-600 text-xl">x</span>
                    </button>
                  </div>
                  {addThumbnailLoading && (
                    <p className="text-xs text-gray-500 mt-1">
                      Uploading image...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="font-medium text-gray-800 mb-4 flex items-center text-lg">
            <RiContactsLine className="mr-2 text-indigo-600" />
            Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Your full name"
                />
                <RiContactsLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  {...register("phone", {
                    required: "Phone number is required",
                    minLength: { value: 11, message: "Must be 11 digits" },
                    maxLength: { value: 11, message: "Must be 11 digits" },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Only numbers allowed",
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="01XXXXXXXXX"
                />
                <RiSmartphoneLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register("email", {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="your@email.com"
                />
                <RiMailLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            Delivery Address <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <TextArea
              currentValue={watch("address") || ""}
              placeHolder="Full delivery address"
              {...register("address", { required: "Address is required" })}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px]"
            />
          </div>
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-md transition-all text-lg"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Submit Pre-Order"}
        </Button>
      </form>
    </div>
  );
};

export default PreOrderForm;
