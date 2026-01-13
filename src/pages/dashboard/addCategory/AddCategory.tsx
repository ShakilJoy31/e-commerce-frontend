import InputWrapper from "@/components/common/wrapper/InputWrapper";
import { useAddCategoryMutation } from "@/components/store/api/category/categoryApi";
import { useAddThumbnailMutation } from "@/components/store/api/file/fileApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, XCircle } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/input";
import ReactQuill from "react-quill";
import { removeFalsyValuesProperties } from "@/utils/helper/removeFalsyValuesProperties";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [{ font: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
  "image",
  "video",
];

export default function AddCategory({ setModalOpen }: any) {
  const { toast } = useToast();
  const [altTextBanner, setAltTextBanner] = useState("");
  const [altText, setAltText] = useState("");
  const { handleSubmit, setValue, watch } = useForm();
  const [uploadedImage, setUploadedImage] = useState<File | undefined>(
    undefined
  );
  const [uploadedImageBanner, setUploadedImageBanner] = useState<File | undefined>(
    undefined
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);

  const [addThumbnail, { isLoading: isThumbnailUploading }] =
    useAddThumbnailMutation();
  const [addCategory, { isLoading: isCategorySaving, error: categoryError }] =
    useAddCategoryMutation();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setUploadedImage(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };
  const handleImageUploadBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setUploadedImageBanner(selectedFile);
      setPreviewBanner(URL.createObjectURL(selectedFile));
    }
  };

  const handleSaveCategory = async () => {
    const name = watch("name").trim();
    const serialNo = parseInt(watch("serialNo"));

    if (!name) {
      toast({
        title: "Error",
        description: "Category name is required.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(serialNo)) {
      toast({
        title: "Error",
        description: "Serial Number must be a number.",
        variant: "destructive",
      });
      return;
    }

    let imageUrl = null;
    let bannerUrl=null;

    if (uploadedImage) {
      const formData = new FormData();
      formData.append("image", uploadedImage);

      if (altText) {
        formData.append("alt", altText);
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
    if (uploadedImageBanner) {
      const formData = new FormData();
      formData.append("image", uploadedImageBanner);

      if (altTextBanner) {
        formData.append("alt", altTextBanner);
      }
      try {
        const response = await addThumbnail(formData).unwrap();
        bannerUrl = response?.data[0];
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
        name,
        serialNo,
        description: watch("description"),
        image: imageUrl,
        banner:bannerUrl
      };

      const cleanData=removeFalsyValuesProperties(updateData, ["banner", "description"])

      await addCategory(cleanData).unwrap();

      toast({
        title: "Success",
        description: "Category added successfully!",
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
      <h1 className="text-2xl pb-4 font-semibold">Add Category</h1>

      <div className="bg-white shadow rounded-lg grid grid-cols-3 items-center gap-4 py-3 px-5">
        <div>
          <label>
            Serial Number <span className="text-red-600">✽</span>
          </label>
          <Input
            type="number"
            placeholder="Enter Serial Number"
            value={watch("serialNo")}
            onChange={(e) => setValue("serialNo", e.target.value)}
          />
        </div>

        <div>
          <label>
            Category Name <span className="text-red-600">✽</span>
          </label>
          <Input
            type="text"
            placeholder="Category Name"
            value={watch("name") || ""}
            onChange={(e) => setValue("name", e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1">
          <input
           className="w-5 h-5" 
            type="checkbox"
            onChange={(e) => setValue("isShippedFree", e.target.checked)}
          />
          <span className="text-base font-semibold">Is shipped free?</span>
        </div>
         <div className="flex items-center gap-1">
            <input  className="w-5 h-5" type="checkbox" onChange={(e)=>setValue("isFullPay", e.target.checked)} />
            <span className="text-base font-semibold">Is Full Pay?</span>
          </div>
        <div className="flex items-center gap-2">
          <InputWrapper label={""}>
            <label htmlFor="" className="block mb-1">
              Upload category logo<span className="text-red-600">✽</span>
            </label>
            <div className="border-2 border-dashed rounded-md py-3 px-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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

        <div className="p-2 col-span-1">
          <label htmlFor="">Alt text</label>
          <Input
            placeholder="Enter alt text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-5 bg-white shadow rounded-lg p-4">
        <div className="flex items-center gap-2">
          <InputWrapper label={""}>
            <label htmlFor="" className="block mb-1">
              Upload category banner
            </label>
            <div className="border-2 border-dashed rounded-md py-3 px-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUploadBanner}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </InputWrapper>

          <div>
            {previewBanner && (
              <div className="relative w-20 h-20 border rounded-md overflow-hidden mt-4">
                <img
                  src={previewBanner}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  onClick={() => {
                    setPreviewBanner(null);
                    setUploadedImageBanner(undefined);
                  }}
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-2 col-span-1">
          <label htmlFor="">Alt text</label>
          <Input
            placeholder="Enter alt text"
            value={altTextBanner}
            onChange={(e) => setAltTextBanner(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-10">
        <label className="mb-3 text-3xl block">Category Description</label>
        <ReactQuill
          className="custom-editor"
          formats={formats}
          modules={modules}
          value={watch("description") || ""}
          onChange={(data) => setValue("description", data)}
          placeholder="Write your description content..."
        />
      </div>

      <div className="flex justify-between items-center gap-2 mb-6">
        <div></div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => setModalOpen(false)}
            type="button"
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
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
