import ButtonLoader from "@/components/loader/ButtonLoader";
import { useGetAllCategoryQuery } from "@/components/store/api/category/categoryApi";
import { useGetSubCategoryQuery } from "@/components/store/api/subCategory/subCategoryApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface AddEditSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: {
    id: number | null;
    name: string;
    isShippedFree: boolean;
    isFullPay: boolean;
    categoryId: number;
    parentSubCategoryId?: number | null;
  }) => void;
  currentSubCategory?: {
    id: number | null;
    name: string;
    isShippedFree: boolean;
    isFullPay: boolean;
    categoryId: number;
    parentSubCategoryId?: number | null;
    children?: Array<{ id: number; name: string }>;
  };
  loading: boolean;
  err?: FetchBaseQueryError | SerializedError;
}

export default function AddEditSubCategoryModal({
  isOpen,
  onClose,
  onSave,
  currentSubCategory,
  loading,
  err,
}: AddEditSubCategoryModalProps) {
  const [name, setName] = useState(currentSubCategory?.name || "");
  const [isShippedFree, setIsShippedFree] = useState(
    currentSubCategory?.isShippedFree || false
  );
  const [isFullPay, setIsFullPay] = useState(
    currentSubCategory?.isFullPay || false
  );
  const [categoryId, setCategoryId] = useState<number | "">(
    currentSubCategory?.categoryId || ""
  );
  const [parentSubCategoryId, setParentSubCategoryId] = useState<number | "">(
    currentSubCategory?.parentSubCategoryId || ""
  );
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [childSubCategories, setChildSubCategories] = useState<
    Array<{ id: number; name: string }>
  >(currentSubCategory?.children || []);

  // Fetch categories for the dropdown
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useGetAllCategoryQuery({});

  const {
    data: subCategories,
    isLoading: isSubCategoriesLoading,
    isError: isSubCategoriesError,
  } = useGetSubCategoryQuery({});

  const parentSubCategories = categoryId
    ? subCategories?.data?.filter(
        (subCat: any) =>
          subCat.categoryId === categoryId &&
          subCat.parentSubCategoryId === null
      ) || []
    : [];

  // Reset state when modal opens or currentSubCategory changes
  useEffect(() => {
    setName(currentSubCategory?.name || "");
    setIsShippedFree(currentSubCategory?.isShippedFree || false);
    setIsFullPay(currentSubCategory?.isFullPay || false);
    setCategoryId(currentSubCategory?.categoryId || "");
    setParentSubCategoryId(currentSubCategory?.parentSubCategoryId || "");
    setChildSubCategories(currentSubCategory?.children || []);
  }, [currentSubCategory]);

  const handleSave = async () => {
    if (!name.trim() || !categoryId) {
      toast({
        title: "Error",
        description: "Name and Category are required",
        variant: "destructive",
      });
      return;
    }

    try {
      onSave({
        id: currentSubCategory?.id || null,
        name: name.trim(),
        isShippedFree: isShippedFree,
        isFullPay: isFullPay,
        categoryId: categoryId as number,
        parentSubCategoryId: parentSubCategoryId || null,
      });
    } catch (error) {
      console.error("Error saving subcategory:", error);
      toast({
        title: "Error",
        description: "Something went wrong! Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentSubCategory ? "Edit Subcategory" : "Add Subcategory"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Subcategory Name */}
          <InputField
            type="text"
            placeholder="Enter Subcategory Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            errorMessage={error || undefined}
          />

          <div className="flex items-center gap-1">
            <input
              className="w-5 h-5"
              checked={isShippedFree}
              type="checkbox"
              onChange={(e) => setIsShippedFree(e.target.checked)}
            />
            <span className="text-base font-semibold">Is shipped free?</span>
          </div>
          {/* <div className="flex items-center gap-1">
          <input
            checked={isFullPay}
            className="w-5 h-5"
            type="checkbox"
            onChange={(e) => setIsFullPay(e.target.checked)}
          />
          <span className="text-base font-semibold">Is Full Pay?</span>
        </div> */}

          {/* Category Dropdown */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Select Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(Number(e.target.value) || "");
                setParentSubCategoryId(""); // Reset parent when category changes
                setError(null);
              }}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="" disabled>
                {isCategoriesLoading
                  ? "Loading categories..."
                  : isCategoriesError
                  ? "Failed to load categories"
                  : "Select a category"}
              </option>
              {categories?.data?.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {error && !categoryId && (
              <p className="text-red-500 text-sm mt-1">Category is required</p>
            )}
          </div>

          {/* Parent Subcategory Dropdown - Always visible but disabled until category is selected */}
          <div>
            <label
              htmlFor="parentSubCategory"
              className="block text-sm font-medium text-gray-700"
            >
              Parent Subcategory (Optional)
            </label>
            <select
              id="parentSubCategory"
              value={parentSubCategoryId}
              onChange={(e) => {
                setParentSubCategoryId(Number(e.target.value) || "");
                setError(null);
              }}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200 ${
                !categoryId ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!categoryId || isSubCategoriesLoading}
            >
              <option value="">
                {!categoryId
                  ? "Select a category first"
                  : isSubCategoriesLoading
                  ? "Loading subcategories..."
                  : isSubCategoriesError
                  ? "Failed to load subcategories"
                  : parentSubCategories.length === 0
                  ? "No parent subcategories available"
                  : "Select a parent subcategory (optional)"}
              </option>
              {categoryId &&
                parentSubCategories.map((subCat: any) => (
                  <option key={subCat.id} value={subCat.id}>
                    {subCat.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Display child subcategories when editing */}
          {currentSubCategory?.id && childSubCategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Child Subcategories
              </label>
              <div className="mt-1 border rounded p-2 max-h-40 overflow-y-auto">
                {childSubCategories.map((child) => (
                  <div
                    key={child.id}
                    className="py-1 px-2 hover:bg-gray-100 rounded"
                  >
                    {child.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {err && "data" in err && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Sub Category Error</AlertTitle>
            <AlertDescription>
              {(err.data as { message?: string })?.message ||
                "Something went wrong! Please try again."}
            </AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-500 text-white"
            disabled={!name.trim() || !categoryId}
          >
            {loading && <ButtonLoader />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
