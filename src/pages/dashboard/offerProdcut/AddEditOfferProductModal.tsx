import { useEffect } from "react";
import { useGetAllOffersQuery } from "@/components/store/api/products/offerApi";
import { useGetSearchProductsQuery } from "@/components/store/api/products/productApi";
import { useForm, useFieldArray } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ButtonLoader from "@/components/loader/ButtonLoader";
import SearchableSelect from "../products/SearchableSelect";

interface OfferProductFormData {
  productId: number[];
  offeredId: number;
}

interface AddEditOfferProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OfferProductFormData) => void;
  initialData?: OfferProductFormData | null;
  loading: boolean;
  err?: any;
}

const AddEditOfferProductModal: React.FC<AddEditOfferProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
  err,
}) => {
  const { data: products, isLoading: isProductLoading } = useGetSearchProductsQuery({
    page: 1,
    size: 2000,
  });
  const { data: offers, isLoading: isOfferLoading } = useGetAllOffersQuery({
    page: 1,
    size: 100,
  });
  const { control, handleSubmit, setValue, trigger, watch } =
    useForm<OfferProductFormData>({
      defaultValues: {
        productId: initialData?.productId || [],
        offeredId: initialData?.offeredId || 0,
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-ignore
    name: "productId",
  });

  useEffect(() => {
    if (initialData) {
      setValue("productId", initialData.productId || []);
      setValue("offeredId", initialData.offeredId || 0);
    }
  }, [initialData, setValue]);

  // Ensure at least one default product field
  useEffect(() => {
    if (fields.length === 0) {
      append(0);
    }
  }, [fields.length, append]);

  const handleOfferSelect = (offerId: string) => {
    setValue("offeredId", Number(offerId));
  };

  const handleProductSelect = (productId: string, index: number) => {
    setValue(`productId.${index}`, Number(productId));
    trigger(`productId.${index}`);
  };

  const handleAddProduct = () => {
    append(0);
  };

  const handleRemoveProduct = (index: number) => {
    remove(index);
  };

  const onSubmitForm = (data: OfferProductFormData) => {
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-1/3">
        <h2 className="text-lg font-semibold mb-4">
          {initialData ? "Edit Offer Product" : "Add Offer Product"}
        </h2>
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="max-h-[70vh] min-h-[50vh] overflow-y-auto px-5"
        >
          {/* Product Dropdown with Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Products</label>
            {fields.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2 mb-2">
                <div className="w-full">
                  <SearchableSelect
                    label="Product"
                    labelFor={`product-${index}`}
                    value={watch(`productId.${index}`)?.toString() || ""}
                    onValueChange={(value) => handleProductSelect(value, index)}
                    options={products?.data ?? []}
                    error={""}
                    loading={isProductLoading}
                    labelKey="productName"
                  />
                </div>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(index)}
                    className="text-red-500 self-end"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddProduct}
              className="px-4 py-2 rounded bg-primary text-white mt-2"
            >
              Add Product
            </button>
          </div>

          {/* Offer Dropdown with Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Offer</label>
            <SearchableSelect
              label="Offer"
              labelFor="offer"
              value={watch("offeredId")?.toString() || ""}
              onValueChange={handleOfferSelect}
              options={offers?.data ?? []}
              error={""}
              loading={isOfferLoading}
              labelKey="offerName"
            />
          </div>

          {/* Error Alert */}
          {err && "data" in err && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Offer product Error</AlertTitle>
              <AlertDescription>
                {(err.data as { message?: string })?.message ||
                  "Something went wrong! Please try again."}
              </AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 flex items-center gap-1 rounded bg-blue-500 text-white"
            >
              {loading && <ButtonLoader />} Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditOfferProductModal;
