import { useEffect } from "react";
import { useGetSearchProductsQuery } from "@/components/store/api/products/productApi";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { useGetAllCategoryQuery } from "@/components/store/api/category/categoryApi";
import SearchableSelect from "../products/SearchableSelect";
import { useForm } from "react-hook-form";

interface CategoryProductFormData {
  productId: number;
  categoryId: number;
}

interface AddEditCategoryWiseProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryProductFormData) => void;
  initialData?: CategoryProductFormData | null;
  loading: boolean;
  err?: any;
}

const AddEditCategoryWiseProductModal: React.FC<
  AddEditCategoryWiseProductModalProps
> = ({ isOpen, onClose, onSubmit, initialData, loading, err }) => {
  const { data: products, isLoading:isProductLoading } = useGetSearchProductsQuery({ page: 1, size: 1000000 });
  const { data: offers, isLoading: isCategoryLoading } = useGetAllCategoryQuery(
    { page: 1, size: 1000000 }
  );

  const { handleSubmit, setValue, watch } = useForm<CategoryProductFormData>({
    defaultValues: {
      productId: initialData?.productId || 0,
      categoryId: initialData?.categoryId || 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue("productId", initialData.productId || 0);
      setValue("categoryId", initialData.categoryId || 0);
    }
  }, [initialData, setValue]);

  const onSubmitForm = (data: CategoryProductFormData) => {
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-1/3">
        <h2 className="text-lg font-semibold mb-4 pl-5">
          {initialData
            ? "Edit Category Wise Product"
            : "Add Category Wise Product"}
        </h2>
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className=" px-5"
        >
          {/* Product Dropdown with Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium pb-2">Products</label>

            <div className="mb-4">
              <SearchableSelect
                label="Product"
                labelFor="product"
                value={watch("productId")?.toString()}
                onValueChange={(value) => {
                  setValue("productId", +value);
                }}
                options={products?.data ?? []}
                error={""}
                loading={isProductLoading}
                labelKey="productName"
              />
            </div>
          </div>

          {/* Offer Dropdown with Search */}
          <div className="">
            <label className="block text-sm font-medium pb-2">Category</label>

            <div className="mb-4">
              <SearchableSelect
                label="Category"
                labelFor="product_category"
                value={watch("categoryId")?.toString()}
                onValueChange={(value) => {
                  setValue("categoryId", +value);
                }}
                options={offers?.data ?? []}
                error={""}
                loading={isCategoryLoading}
                labelKey="name"
              />
            </div>
          </div>

          {/* Error Alert */}
          {err && "data" in err && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Category Wise product Error</AlertTitle>
              <AlertDescription>
                {(err.data as { message?: string })?.message ||
                  "Something went wrong! Please try again."}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-4 mt-10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 flex items-center gap-1 py-2 rounded bg-blue-500 text-white"
            >
              {loading && <ButtonLoader />} Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditCategoryWiseProductModal;
