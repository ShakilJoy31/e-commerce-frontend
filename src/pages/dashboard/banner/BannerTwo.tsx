import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import {
  useGetCompanyInfoAllQuery,
  useUpdateCompanyMutation,
} from "@/components/store/api/company/companyApi";
import { useAddThumbnailMutation } from "@/components/store/api/file/fileApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/input";
import InputWrapper from "@/components/common/wrapper/InputWrapper";



const BannerTwo = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const { toast } = useToast();
  const { data: companyData, isLoading: isFetching } = useGetCompanyInfoAllQuery({});

  const [addBannerTwo, { isLoading, error }] = useUpdateCompanyMutation();
  const [addThumbnail, { isLoading: isThumbnailUploading }] = useAddThumbnailMutation();

  const { handleSubmit, setValue, watch } = useForm();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setUploadedImage(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  useEffect(() => {
    if (companyData?.data?.length > 0) {
      setValue("bannerTwo", companyData.data[0].bannerTwo);
      setPreview(companyData.data[0].bannerTwo || null);
      setValue("bannerTwoLink",companyData.data[0].bannerTwoLink || ""); 
    }
  }, [companyData?.data, setValue]);

  const handleSaveBanner = async (data: any) => {
    try {
      let imageUrl: string | null = null;

      if (uploadedImage) {
        const formData = new FormData();
        formData.append("image", uploadedImage);

        if (altText) {
          formData.append("alt", altText);
        }
        try {
          const response = await addThumbnail(formData).unwrap();
          imageUrl = response?.data[0] || null;
        } catch (error) {
          console.error("Error uploading image:", error);
          toast({
            title: "Error",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }

      const updateData = {
        ...data,
        bannerTwo: imageUrl || companyData?.data[0]?.bannerTwo,
      };

      await addBannerTwo({
        id: companyData?.data[0]?.id,
        data: updateData,
      }).unwrap();

      toast({
        title: "Success",
        description: "Banner-2 updated successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving banner:", error);
      toast({
        title: "Error",
        description: "Failed to save banner. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isFetching) return <LoaderSpinner />;

  return (
    <form onSubmit={handleSubmit(handleSaveBanner)}>
      <SectionWrapper>
        <div className="grid grid-cols-3 gap-4 w-full">
          <div>
            <InputWrapper label="Link">
              <Input
                type="text"
                placeholder="Enter link (e.g., link)"
                value={watch("bannerTwoLink")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue("bannerTwoLink", e.target.value)}
                
              />
            </InputWrapper>
          </div>
          <div className="">
            <InputWrapper label={"Banner Image (300 X 400 px)"}>
              <div className="border-2 border-dashed rounded-md py-3 px-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                />
              </div>
            </InputWrapper>

            <div className="w-[300px] h-[400px]">
              {preview && (
                <div className="relative w-full h-full border rounded-md overflow-hidden mt-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    onClick={() => {
                      setPreview(null);
                      setUploadedImage(null);
                    }}
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-2">
            <label htmlFor="altText" className="block text-sm font-medium text-gray-700 mb-1">
              Alt Text
            </label>
            <Input
              placeholder="Enter alt text"
              value={altText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAltText(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end my-5">
          <Button
            type="submit"
            variant={"default"}
            disabled={isLoading || isThumbnailUploading}
          >
            {isThumbnailUploading ? "Uploading" : isLoading ? "Saving" : "Save"}
          </Button>
        </div>
      </SectionWrapper>

      {error && "data" in error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Banner Two Error</AlertTitle>
          <AlertDescription>
            {(error.data as { message?: string })?.message ||
              "Something went wrong! Please try again."}
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
};

export default BannerTwo;