import InputWrapper from "@/components/common/wrapper/InputWrapper";
import { useAddThumbnailMutation } from "@/components/store/api/file/fileApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/input";
import { useUpdatePopupMutation } from "@/components/store/api/popupList/popupApi";

export default function EditPopup({ setModalOpen, actionItem }: any) {
  const { toast } = useToast();
  const [altText, setAltText] = useState("");
  const { handleSubmit, setValue, watch } = useForm();
  const [uploadedImage, setUploadedImage] = useState<File | undefined>(
    undefined
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [addThumbnail, { isLoading: isThumbnailUploading }] =
    useAddThumbnailMutation();
  const [addCategory, { isLoading: isCategorySaving, error: categoryError }] =
    useUpdatePopupMutation();
    
  useEffect(() => {
    if (actionItem) {
      setValue("active", actionItem?.active);
      setPreview(actionItem?.image || null);
      setValue("image", actionItem?.image);
    }
  }, [actionItem, setValue]);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setUploadedImage(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSaveCategory = async (data: any) => {
    let imageUrl = null;

    if (uploadedImage) {
      const formData = new FormData();
      formData.append("image", uploadedImage);

      if (altText) {
        formData.append("alt", altText);
      }
      try {
        const response = await addThumbnail(formData).unwrap();
        imageUrl = response?.data[0];
        console.log(imageUrl);
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

    try {
      const updateData = {
        ...data,
        image: imageUrl || actionItem?.image || null,
      };
      await addCategory({ id: actionItem?.id, data: updateData }).unwrap();

      toast({
        title: "Success",
        description: "Popup added successfully!",
        variant: "default",
      });
      setModalOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error",
        description: "Failed to save category. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleSaveCategory)}
      className="p-6 bg-gray-100"
    >
      {/* Header */}

      <h1 className="text-2xl pb-4 font-semibold">Add Popup</h1>

      <div className="bg-white shadow  rounded-lg grid grid-cols-3 items-center gap-4 py-3 px-5">
        <div className="flex items-center gap-2">
          <InputWrapper label={"Upload Image (1280 × 720px)"}>
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
              <div className="relative w-20 h-20 border rounded-md overflow-hidden mt-4">
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
        </div>

        <div className="p-2">
          <label htmlFor="">{"Alt text"}</label>
          <Input
            placeholder={"Enter alt text"}
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 mt-1">
          <input
            type="checkbox"
            placeholder=""
            checked={watch("active") || false}
            onChange={(e) => setValue("active", e.target.checked)}
            className="w-5 h-5"
          />
          <label htmlFor="" className="-mt-1">
            isActive?
          </label>
        </div>
      </div>

      <div className="flex justify-between items-center gap-2 mb-6">
        <div></div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700"
            disabled={isThumbnailUploading || isCategorySaving}
          >
            {isThumbnailUploading
              ? "Uploading Image..."
              : isCategorySaving
              ? "Saving..."
              : "Save"}
          </button>
        </div>
      </div>
      {/* Persistent Error Alert for API Errors */}
      {categoryError && "data" in categoryError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Category Error</AlertTitle>
          <AlertDescription>
            {(categoryError.data as { message?: string })?.message ||
              "Something went wrong! Please try again."}
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
}
