import InputWrapper from "@/components/common/wrapper/InputWrapper";
import ButtonLoader from "@/components/loader/ButtonLoader";
import { useGetBrandsQuery } from "@/components/store/api/brand/brandApi";
import { useGetAllCategoryQuery } from "@/components/store/api/category/categoryApi";
import { useUpdateBulkProductMutation } from "@/components/store/api/products/productApi";
import { useGetSubCategoryQuery } from "@/components/store/api/subCategory/subCategoryApi";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { FC, useState } from "react";

interface IBulkOption {
  selectOption?: any;
  selectedRows?: any;
  setSelectedRows?: any;
  refetch: any;
  closeBulkModal: any;
}
const BulkActions: FC<IBulkOption> = ({
  selectOption,
  selectedRows,
  setSelectedRows,
  refetch,
  closeBulkModal,
}) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<boolean>(false);
  const { data: categoryList, isLoading: categoryLoading } =
    useGetAllCategoryQuery({});
  const { data: subCategoryList, isLoading: subCategoryLoading } =
    useGetSubCategoryQuery({});
  const { data: brandList, isLoading: brandLoading } = useGetBrandsQuery(
    {}
  ) as any;

  const [updateBulkProduct, { isLoading: updatingBulk }] =
    useUpdateBulkProductMutation();

  const handleBulkApply = async () => {
    try {
      if (selectOption === "CategoryChange") {
        await updateBulkProduct({
          products: selectedRows,
          categoryId: Number(selectedCategory),
        }).unwrap();
      } else if (selectOption === "SubCategoryChange") {
        await updateBulkProduct({
          products: selectedRows,
          subCategoryId: Number(selectedSubCategory),
        }).unwrap();
      } else if (selectOption === "Brand") {
        await updateBulkProduct({
          products: selectedRows,
          brandId: Number(selectedBrand),
        }).unwrap();
      } else if (selectOption === "MoveToPublished") {
        await updateBulkProduct({
          products: selectedRows,
          type: selectedType,
        }).unwrap();
      } else if (selectOption === "StockStatus") {
        await updateBulkProduct({
          products: selectedRows,
          inStock: selectedStatus,
        }).unwrap();
      }

      toast({
        title: "Success",
        description: "Products updated successfully!",
        variant: "default",
      });

      refetch();
      setSelectedRows([]);
      closeBulkModal();
    } catch (err) {
      console.error("Error updating products:", err);
      toast({
        title: "Error",
        description: "Failed to update products!",
        variant: "destructive",
      });
    }
  };
  return (
    <div>
      <DialogHeader>
        {selectOption === "CategoryChange" && (
          <DialogTitle>Change Category</DialogTitle>
        )}
        {selectOption === "SubCategoryChange" && (
          <DialogTitle>Change Subcategory</DialogTitle>
        )}
        {selectOption === "Brand" && <DialogTitle>Change Brand</DialogTitle>}
        {selectOption === "MoveToPublished" && (
          <DialogTitle>Change Type</DialogTitle>
        )}
        {selectOption === "StockStatus" && (
          <DialogTitle>Change Stock-Status</DialogTitle>
        )}
      </DialogHeader>

      {selectOption === "CategoryChange" && (
        <InputWrapper label="Select Category" labelFor="category">
          <Select
            value={selectedCategory || ""}
            onValueChange={(value) => setSelectedCategory(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {categoryList?.data?.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
              {!categoryList?.data?.length && categoryLoading && (
                <div className="flex justify-center w-full h-8 items-center bg-accent rounded-md">
                  <ButtonLoader />
                </div>
              )}
            </SelectContent>
          </Select>
        </InputWrapper>
      )}

      {selectOption === "SubCategoryChange" && (
        <InputWrapper label="Select SubCategory" labelFor="subcategory">
          <Select
            value={selectedSubCategory || ""}
            onValueChange={(value) => setSelectedSubCategory(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a sub-category" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {subCategoryList?.data?.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
              {!subCategoryList?.data?.length && subCategoryLoading && (
                <div className="flex justify-center w-full h-8 items-center bg-accent rounded-md">
                  <ButtonLoader />
                </div>
              )}
            </SelectContent>
          </Select>
        </InputWrapper>
      )}

      {selectOption === "Brand" && (
        <InputWrapper label="Select Brand" labelFor="brand">
          <Select
            value={selectedBrand || ""}
            onValueChange={(value) => setSelectedBrand(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a brand" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {brandList?.data?.map((brand) => (
                <SelectItem key={brand.id} value={brand.id.toString()}>
                  {brand.brand}
                </SelectItem>
              ))}
              {!brandList?.data?.length && brandLoading && (
                <div className="flex justify-center w-full h-8 items-center bg-accent rounded-md">
                  <ButtonLoader />
                </div>
              )}
            </SelectContent>
          </Select>
        </InputWrapper>
      )}

      {selectOption === "MoveToPublished" && (
        <InputWrapper label={"Select a Type"} labelFor="product_category">
          <Select
            value={selectedType || ""}
            onValueChange={(value) => setSelectedType(value)}
          >
            <SelectTrigger id="product_category">
              <SelectValue placeholder={"Select a Type"} />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              <SelectItem value="Published">Move To Published</SelectItem>
              <SelectItem value="Draft">Move To Draft</SelectItem>
              <SelectItem value="Trust">Move To Trash</SelectItem>
            </SelectContent>
          </Select>
        </InputWrapper>
      )}

      {selectOption === "StockStatus" && (
        <div className="mt-5 flex items-center gap-2">
          <input
           className="w-4 h-4"
            type="checkbox"
            onChange={(e) => setSelectedStatus(e.target.checked)}
          />
          <label htmlFor="inStock">inStock</label>
        </div>
      )}

      <DialogFooter className="mt-3">
        <button
          onClick={closeBulkModal}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleBulkApply}
          disabled={
            (selectOption === "CategoryChange" && !selectedCategory) ||
            (selectOption === "SubCategoryChange" && !selectedSubCategory) ||
            (selectOption === "Brand" && !selectedBrand) ||
            selectOption === "MoveToPublished" && !selectedType ||
            selectOption === "StockStatus" && !selectedStatus ||
            updatingBulk
          }
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {updatingBulk ? <ButtonLoader /> : "Apply"}
        </button>
      </DialogFooter>
    </div>
  );
};

export default BulkActions;
