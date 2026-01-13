import InputWrapper from "@/components/common/wrapper/InputWrapper";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { useAddThumbnailMutation } from "@/components/store/api/file/fileApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useGetAllCategoryQuery } from "@/components/store/api/category/categoryApi";
import MultiSelect from "@/components/ui/multiselect";

interface BrandType {
  id: number | null;
  brand: string;
  image?: string;
  isShippedFree?: boolean;
  offerImage?: string;
  description?: string;
  categories?: number[];
  BrandWiseCategory?: { categoryId: number }[];
}

interface AddEditBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    id: number | null,
    brand: string,
    image: string,
    isShippedFree: boolean,
    offerImage: string,
    description: string,
    categories: number[]
  ) => void;
  currentBrand?: BrandType;
  loading: boolean;
  err?: any;
}


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

export default function AddEditBrandModal({
  isOpen,
  onClose,
  onSave,
  currentBrand,
  loading,
  err,
}: AddEditBrandModalProps) {
  const { toast } = useToast();
  const [brand, setBrand] = useState(currentBrand?.brand || "");
   const [categories, setCategories] = useState<number[]>(
    []
  );
  
  const handleCategoryChange = (
    selectedValues: { label: string; value: string }[]
  ) => {
    const selectedIds = selectedValues.map((option) => Number(option.value));
    setCategories(selectedIds);
  };
  const [isShippedFree, setIsShippedFree] = useState(
    currentBrand?.isShippedFree || false
  );
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [altText, setAltText] = useState("");
  const [offerAltText, setOfferAltText] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined);
  const [offerFile, setOfferFile] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<string | null>(
    currentBrand?.image || null
  );
  const [offerPreview, setOfferPreview] = useState<string | null>(
    currentBrand?.offerImage || null
  );
  const [addThumbnail, { isLoading: addThumbnailLoading }] =
    useAddThumbnailMutation();

  // Fetch brands to get all available categories
  const { data: Categories } = useGetAllCategoryQuery({});

  //  console.log(categories?.data)
  // const Data = categories?.data
  // console.log(Data)

  // Reset form state when modal opens or currentBrand changes
  useEffect(() => {
    setBrand(currentBrand?.brand || "");
    setCategories(currentBrand?.BrandWiseCategory?.map((item) => item?.categoryId) || currentBrand?.categories || []);
    setPreview(currentBrand?.image || null);
    setOfferPreview(currentBrand?.offerImage || null);
    setDescription(currentBrand?.description || "");
    setIsShippedFree(currentBrand?.isShippedFree || false);
    setError(null);
  }, [currentBrand]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleOfferFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setOfferFile(selectedFile);
      setOfferPreview(URL.createObjectURL(selectedFile));
    }
  };

   const categoriesOptions =
    Categories?.data?.map((single) => ({
        label: single.name,
        value: single.id.toString(),
      })) || [];
  const handleSave = async () => {
    let image = preview || "";
    let offerImage = offerPreview || "";

    // Validate required fields
    if (brand.trim() === "") {
      toast({
        title: "Error",
        description: "Brand name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (!categories?.length) {
      toast({
        title: "Error",
        description: "Please select a category.",
        variant: "destructive",
      });
      return;
    }

    // Handle file upload for logo image
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      if (altText) {
        formData.append("alt", altText);
      }
      try {
        const uploadResponse = await addThumbnail(formData).unwrap();
        if (uploadResponse?.data) {
          image = uploadResponse.data[0] as string;
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        toast({
          title: "Error",
          description: "Failed to upload logo. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }

    // Handle file upload for offer image
    if (offerFile) {
      const formData = new FormData();
      formData.append("image", offerFile);
      if (offerAltText) {
        formData.append("alt", offerAltText);
      }
      try {
        const uploadResponse = await addThumbnail(formData).unwrap();
        if (uploadResponse?.data) {
          offerImage = uploadResponse.data[0] as string;
        }
      } catch (error) {
        console.error("Error uploading offer image:", error);
        toast({
          title: "Error",
          description: "Failed to upload offer image. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      onSave(
        currentBrand?.id || null,
        brand.trim(),
        image,
        isShippedFree,
        offerImage,
        description,
        categories
      );
    } catch (error) {
      console.error("Error saving brand:", error);
      toast({
        title: "Error",
        description: "Something went wrong! Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>
            {currentBrand?.id ? "Edit Brand" : "Add Brand"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-10">
            {/* Category Dropdown */}
            <div className="w-60">
              <label htmlFor="">
                Category <span className="text-red-600">✽</span>
              </label>
             
                <MultiSelect
                  name="categoryId"
                  label="categories"
                  options={categoriesOptions}
                  onChange={handleCategoryChange}
                  defaultValue={categoriesOptions.filter((option) =>
                    categories.includes(Number(option.value))
                  )}
                />
            </div>

            {/* Brand Name Input */}
            <div className="w-60">
              <label htmlFor="">
                Brand Name <span className="text-red-600">✽</span>
              </label>
              <InputField
                type="text"
                placeholder="Enter Brand Name"
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setError(null);
                }}
                errorMessage={error || undefined}
              />
            </div>

            <div className="flex items-center gap-1">
              <input
                checked={isShippedFree}
                type="checkbox"
                onChange={(e) => setIsShippedFree(e.target.checked)}
              />
              <span className="text-base font-semibold">Is shipped free?</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-5">
            <div>
              {/* File Upload for Logo */}
              <InputWrapper label={""}>
                <label htmlFor="">
                  Upload a logo <span className="text-red-600">✽</span>
                </label>
                <div className="border-2 border-dashed rounded-md py-3 px-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                  />
                </div>
              </InputWrapper>
            </div>

            <div>
              {/* Logo Image Preview */}
              {preview && (
                <div className="relative w-24 h-24 border rounded-md overflow-hidden mt-2">
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
                      setFile(undefined);
                    }}
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            <div className="p-2">
              <label htmlFor="" className="">
                {"Alt text"}
              </label>
              <div className="mt-2">
                <Input
                  placeholder={"Enter alt text"}
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </div>
            </div>
            <div>
              {/* File Upload for Offer Image */}
              <InputWrapper label={"Upload Offer Image"}>
                <div className="border-2 border-dashed rounded-md py-3 px-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleOfferFileChange}
                    className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                  />
                </div>
              </InputWrapper>
            </div>

            <div>
              {/* Offer Image Preview */}
              {offerPreview && (
                <div className="relative w-24 h-24 border rounded-md overflow-hidden mt-2">
                  <img
                    src={offerPreview}
                    alt="Offer Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    onClick={() => {
                      setOfferPreview(null);
                      setOfferFile(undefined);
                    }}
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            <div className="p-2">
              <label htmlFor="">{"Alt text"}</label>
              <div className="mt-2">
                <Input
                  placeholder={"Enter alt text"}
                  value={offerAltText}
                  onChange={(e) => setOfferAltText(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <label htmlFor="" className="mb-3 text-3xl block">
              Description
            </label>
            <ReactQuill
              className="custom-editor"
              formats={formats}
              modules={modules}
              value={description}
              onChange={(data) => {
                setDescription(data);
              }}
              placeholder="Write your description content..."
            />
          </div>
        </div>

        {/* Error Alert */}
        {err && "data" in err && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Brand Error</AlertTitle>
            <AlertDescription>
              {(err.data as { message?: string })?.message ||
                "Something went wrong! Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {/* Footer Buttons */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-500 text-white"
            disabled={!brand.trim() || !categories?.length || addThumbnailLoading}
          >
            {loading && <ButtonLoader />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
