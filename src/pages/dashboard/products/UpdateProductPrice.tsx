import { useEffect, useState } from "react";
import {
  useGetSingleProductQuery,
  useUpdateProductPriceMutation,
} from "@/components/store/api/products/productApi";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import ButtonLoader from "@/components/loader/ButtonLoader";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import React from "react";

const UpdateProductPrice = ({ product }:any) => {
  const { data: singleProduct, isLoading } =
    useGetSingleProductQuery(product);
    
  const [updatePrice, { isLoading: updatePriceLoading }] =
    useUpdateProductPriceMutation();
  const { toast } = useToast();

  // State for variations
  const [variationPrices, setVariationPrices] = useState<
    {
      id: number;
      price: number;
      discountPrice: number;
      bookingPrice: number;
      label: string;
    }[]
  >([]);

  // Load variations when data is available
  useEffect(() => {
    console.log(singleProduct?.data?.VariationProduct);
  
    if (singleProduct?.data?.VariationProduct) {
      const mappedVariations = singleProduct?.data?.VariationProduct?.map((variation: any) => {
        // Collect all valid specs
        const specs = [
          variation?.ram && (
            <p key="ram">
              <span className="text-primary">{`${variation.ram}GB`}</span> RAM
            </p>
          ),
          variation?.rom && (
            <p key="rom">
              <span className="text-primary">{`${variation.rom}GB`}</span> ROM
            </p>
          ),
          variation?.size && (
            <p key="size">
              <span className="text-primary">{variation.size}</span> Size
            </p>
          ),
          variation?.sim && (
            <p key="sim">
              <span className="text-primary">{variation.sim}</span> SIM
            </p>
          ),
          variation?.region && (
            <p key="region">
              <span className="text-primary">{variation.region}</span> Region
            </p>
          ),
          variation?.chipset && (
            <p key="chipset">
              <span className="text-primary">{variation.chipset}</span> Chipset
            </p>
          ),
        ].filter(Boolean); 
      
        return {
          id: variation.id,
          price: variation.price,
          discountPrice: variation.discountPrice,
          bookingPrice: variation.bookingPrice,
          label: (
            <div className="flex gap-2 flex-wrap">
              {specs.map((spec, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span>-</span>} 
                  {spec}
                </React.Fragment>
              ))}
            </div>
          ),
        };
      });
      
  
      setVariationPrices(mappedVariations);
    }
  }, [singleProduct]);
  

  // Handle price change
  const handlePriceChange = (index: number, field: string, value: string) => {
    setVariationPrices((prev) =>
      prev.map((variation, i) =>
        i === index ? { ...variation, [field]: Number(value) } : variation
      )
    );
  };

  // Submit updated prices
  const handleSubmit = async () => {
    try {
      const payload = {
        variationProducts: variationPrices.map(
          ({ id, price, discountPrice, bookingPrice }) => ({
            id,
            price,
            discountPrice,
            bookingPrice,
          })
        ),
      };

      await updatePrice(payload).unwrap();

      toast({
        title: "Success",
        description: "Product prices updated successfully!",
        variant: "default",
      });
    } catch (err) {
      console.error("Error updating prices:", err);

      // Show toast error message
      toast({
        title: "Error",
        description: "Failed to update prices. Please try again!",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <LoaderSpinner />;

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Update Product Prices</h2>
      <div className="space-y-4">
        {variationPrices?.map((variation, index) => (
          <div key={variation.id} className="border p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700">
              {variation.label}
            </h3>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <InputField
                type="text"
                label="Price"
                value={variation.price.toString()} 
                onChange={(e) =>
                  handlePriceChange(index, "price", e.target.value)
                }
              />
              <InputField
                type="text"
                label="Discount Price"
                value={variation.discountPrice.toString()} 
                onChange={(e) =>
                  handlePriceChange(index, "discountPrice", e.target.value)
                }
              />
              <InputField
                type="text"
                label="Booking Price"
                value={variation.bookingPrice.toString()} 
                onChange={(e) =>
                  handlePriceChange(index, "bookingPrice", e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit} disabled={updatePriceLoading}>
          {updatePriceLoading ? <ButtonLoader /> : "Update Prices"}
        </Button>
      </div>
    </div>
  );
};

export default UpdateProductPrice;
