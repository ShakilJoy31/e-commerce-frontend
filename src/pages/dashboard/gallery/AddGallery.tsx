import InputWrapper from "@/components/common/wrapper/InputWrapper";
import { useAddThumbnailMutation } from "@/components/store/api/file/fileApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { AlertCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/input";
import ButtonLoader from "@/components/loader/ButtonLoader";

const AddGallery = ({setModalOpen}:any) => {
  const [uploadedImage, setUploadedImage] = useState<File | undefined>(
    undefined
  );
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const [addThumbnail, { isLoading: uploadLoading, error }] =
    useAddThumbnailMutation();

  const { handleSubmit, setValue, reset, watch } = useForm();
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setUploadedImage(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleAddPage = async () => {
    if (!uploadedImage) {
      toast({
        title: "Upload Error",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", uploadedImage);

    const alt = watch("alt");
    if (alt) {
      formData.append("alt", alt);
    }

    try {
      const response = await addThumbnail(formData).unwrap();

      if (response?.success) {
        toast({
          title: "Add Image Message",
          description: toastMessageGenerator("add", "gallery"),
        });
        reset();
        setPreview(null);
        setUploadedImage(undefined);
        setModalOpen(false)
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(handleAddPage)} className="overflow-hidden">
        <div className="p-2">
          <InputWrapper label={"Upload Image"}>
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

          {preview && (
            <div className="relative w-20 h-20 border rounded-md overflow-hidden mt-2">
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
                  setUploadedImage(undefined);
                }}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="p-2">
          <label htmlFor="">{"Alt text"}</label>
          <Input
            placeholder={"Enter alt text"}
            value={watch("alt") || ""}
            onChange={(e) => setValue("alt", e.target.value)}
          />
        </div>

        <div className="flex justify-end my-5">
          <div className="flex justify-between items-center gap-2">
            {error && "data" in error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Add gallery error</AlertTitle>
                <AlertDescription>
                  {(error.data as { message?: string })?.message ||
                    "Something went wrong! Please try again."}
                </AlertDescription>
              </Alert>
            )}
            <button
              type="submit"
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
            >
              {uploadLoading && <ButtonLoader />}
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddGallery;
