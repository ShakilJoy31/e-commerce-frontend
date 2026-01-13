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

const Logo = () => {
  const [uploadedImage, setUploadedImage] = useState<File | undefined>(
    undefined
  );
  const [uploadedImageFooter, setUploadedImageFooter] = useState<
    File | undefined
  >(undefined);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewFooter, setPreviewFooter] = useState<string | null>(null);
  const [altTextLogo, setAltTextLogo] = useState("");
  const [altTextFooterLogo, setAltTextFooterLogo] = useState("");
  const { toast } = useToast();

  const { data: companyData, isLoading: isFetching } =
    useGetCompanyInfoAllQuery({});

  const [addBannerTwo, { isLoading, error }] = useUpdateCompanyMutation();
  const [addThumbnail, { isLoading: isThumbnailUploading }] =
    useAddThumbnailMutation();

  const { handleSubmit, setValue } = useForm();
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setUploadedImage(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };
  const handleFooterImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setUploadedImageFooter(selectedFile);
      setPreviewFooter(URL.createObjectURL(selectedFile));
    }
  };
  useEffect(() => {
    if (companyData?.data?.length > 0) {
      setValue("logo", companyData?.data[0].logo);
      setValue("footerLogo", companyData?.data[0].footerLogo);
      setPreview(companyData?.data[0].logo);
      setPreviewFooter(companyData?.data[0].footerLogo);
    }
  }, [companyData?.data, setValue]);
  const handleSaveWhyKry = async (data: any) => {
    try {
      let imageUrl = null;
      let footerUrl = null;

      if (uploadedImage) {
        const formData = new FormData();
        formData.append("image", uploadedImage);

        if (altTextLogo) {
          formData.append("alt", altTextLogo);
        }
        try {
          const response = await addThumbnail(formData).unwrap();
          imageUrl = response?.data[0];
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

      if (uploadedImageFooter) {
        const formData = new FormData();
        formData.append("image", uploadedImageFooter);

        if (altTextFooterLogo) {
          formData.append("alt", altTextFooterLogo);
        }
        try {
          const response = await addThumbnail(formData).unwrap();
          footerUrl = response?.data[0];
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
        logo: imageUrl,
        footerLogo: footerUrl,
      };

      await addBannerTwo({
        id: companyData?.data[0]?.id,
        data: updateData,
      }).unwrap();

      toast({
        title: "Success",
        description: "Logo added successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving logo:", error);
      toast({
        title: "Error",
        description: "Failed to save logo. Please try again.",
        variant: "destructive",
      });
    }
  };
  if (isFetching) return <LoaderSpinner />;
  return (
    <form onSubmit={handleSubmit(handleSaveWhyKry)}>
      <SectionWrapper>
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex gap-4">
            <div className="">
              <InputWrapper label={"Navbar Logo (PNG only, 120x40px recommended)"}>
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

              <div>
                {preview && (
                  <div className="relative w-full h-40 border rounded-md overflow-hidden mt-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      onClick={() => {
                        setPreview(null);
                        setUploadedImage(undefined);
                      }}
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-2">
              <label htmlFor="altText">Alt Text</label>
              <Input
                placeholder="Enter alt text"
                value={altTextLogo}
                onChange={(e) => setAltTextLogo(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="">
              <InputWrapper label={"Footer Logo (PNG only, 120x40px recommended)"}>
                <div className="border-2 border-dashed rounded-md py-3 px-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFooterImageUpload}
                    className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                  />
                </div>
              </InputWrapper>

              <div>
                {previewFooter && (
                  <div className="relative w-full h-40 border rounded-md overflow-hidden mt-4">
                    <img
                      src={previewFooter}
                      alt="Preview footer logo"
                      className="w-full h-full object-contain"
                    />

                    <button
                      type="button"
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      onClick={() => {
                        setPreviewFooter(null);
                        setUploadedImageFooter(undefined);
                      }}
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-2">
              <label htmlFor="altText">Alt Text</label>
              <Input
                placeholder="Enter alt text"
                value={altTextFooterLogo}
                onChange={(e) => setAltTextFooterLogo(e.target.value)}
              />
            </div>
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
          <AlertTitle>Logo Error</AlertTitle>
          <AlertDescription>
            {(error.data as { message?: string })?.message ||
              "Something went wrong! Please try again."}
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
};

export default Logo;
