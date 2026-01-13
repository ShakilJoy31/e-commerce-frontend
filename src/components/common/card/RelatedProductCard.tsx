import { useCompare } from "@/components/context/CompareContext";
import { useWishList } from "@/components/context/WishListContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import ProductCompare from "@/pages/public/myAccount/ProductCompare";
import { toastMessageGenerator } from "@/utils/helper/toastMessageGenerator";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { TbArrowsShuffle } from "react-icons/tb";
import { Link } from "react-router-dom";

export default function RelatedProductCard({ product }: any) {
  const { selectedProducts, setSelectedProducts, productIds, setProductIds } =
    useCompare();
  const { addToWish, isProductInWishList } = useWishList();
  const [wishIsSuccess, setWishIsSuccess] = useState(false);
  const [modalOpen, setModalOpen]=useState(false)

  const finalPrice =
    (product?.VariationProduct?.[0]?.price || 0) -
    (product?.VariationProduct?.[0]?.discountPrice || 0);

  const handleWishList = () => {
    const wishProduct = {
      id: product?.id,
      image: product?.ProductImage?.[0]?.imageUrl || "",
      title: product?.productName || "Unknown Product",
      discountPrice: product?.VariationProduct?.[0]?.discountPrice || 0,
      originalPrice: product?.VariationProduct?.[0]?.price || 0,
      stock: product?.stock || 0,
      time: new Date().toLocaleString(),
    };
    addToWish(wishProduct);
    setWishIsSuccess(true);
  };

   const handleAddToCompare = () => {
    const activeVariation = product?.VariationProduct?.[0] ?? {};

    const compareProduct = {
      ...product,
      variation: activeVariation,
    };

    const updatedProducts   = [...selectedProducts];
    const updatedProductIds = [...productIds];

    if (!updatedProducts[0]) {
      updatedProducts[0]   = compareProduct;
      updatedProductIds[0] = compareProduct.id;
    } else if (!updatedProducts[1]) {
      updatedProducts[1]   = compareProduct;
      updatedProductIds[1] = compareProduct.id;
    } else {
      toast({
        title:
          "Both comparison slots are full! Clear one slot to add a new product.",
        variant: "destructive",
      });
      return;
    }

    setSelectedProducts(updatedProducts);
    setProductIds(updatedProductIds);

    toast({ title: `"${product?.productName}" added to compare` });
  };

  const isInCompare = productIds.includes(product?.id);

  useEffect(() => {
    if (wishIsSuccess) {
      toast({
        title: "Added to Wish List",
        description: toastMessageGenerator("add", product.productName),
      });
      setWishIsSuccess(false);
    }
  }, [wishIsSuccess, product.productName]);

  return (
    <div className="relative bg-white rounded-lg shadow-sm p-5 flex gap-3 items-start">
      {/* Product Image */}
      <Link to={`/products/${product?.productLink}`} className="flex-shrink-0">
        <img
          src={product?.ProductImage?.[0]?.imageUrl || ""}
          alt={product?.productName}
          className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] object-contain"
        />
      </Link>

      {/* Product Details */}
      <div>
        <div className="flex flex-col">
          <Link to={`/products/${product?.productLink}`}>
            <h3 className="text-sm md:text-base pr-2 font-semibold text-black">
              {product?.productName || "Unknown Product"}
            </h3>
          </Link>

          {/* Price Display */}
          <h2 className="text-md md:text-lg font-bold text-black mt-1">
            Tk {finalPrice.toLocaleString("en-IN")}
          </h2>
        </div>
        {/* Add to Compare Button */}

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddToCompare}
              size="sm"
              variant={"outline"}
              className={`mt-2 flex items-center gap-2  text-xs md:text-sm px-2 py-1 rounded-full ${
                isInCompare
                  ? "bg-primary text-white"
                  : "border-gray-400 text-gray-700"
              }`}
            >
              <TbArrowsShuffle className="text-lg" />
              Add to Compare
            </Button>
          </DialogTrigger>
          <DialogContent  className="p-6 rounded-lg shadow-lg sm:max-w-[700px] h-[90vh] overflow-y-auto">
            <ProductCompare setModalOpen={setModalOpen}/>
          </DialogContent>
        </Dialog>
      </div>

      {/* Wishlist Heart Icon */}
      <FaHeart
        onClick={(event) => {
          event.stopPropagation();
          handleWishList();
        }}
        className={`absolute top-3 right-3 text-lg cursor-pointer ${
          isProductInWishList(product?.id) ? "text-red-500" : "text-gray-400"
        }`}
      />
    </div>
  );
}
