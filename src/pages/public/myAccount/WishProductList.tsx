import { useWishList } from "@/components/context/WishListContext";
import Paragraph from "@/components/typography/Paragraph";
import { Button } from "@/components/ui/button";
import { CalendarDays, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const WishProductList = () => {
  const { removeFromWish } = useWishList();
  const [wishData, setWishData] = useState<any[]>([]);

  // Load cart data from localStorage only once
  useEffect(() => {
    const storedWish = localStorage.getItem("addToWish");
    if (storedWish) {
      setWishData(JSON.parse(storedWish));
    }
  }, []);

  // Function to update cart data and localStorage together
  const updateWish = (updatedWish: any[]) => {
    setWishData(updatedWish);
    localStorage.setItem("addToWish", JSON.stringify(updatedWish));
  };

  // Handle delete item
  const handleDelete = (id: number) => {
    removeFromWish(id);
    const updatedWish = wishData.filter((item) => item.id !== id);
    updateWish(updatedWish);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  console.log(wishData)

  return (
    <div className="container mx-auto py-16">
      {wishData.length === 0 ? (
        <div className="text-center text-gray-500 h-full flex items-center justify-center">
          <Paragraph>
            <span className="text-xl md:text-3xl text-red-600 font-bold">
              Your wishlist is empty.
            </span>{" "}
            <br /> Start adding products to your wishlist!
          </Paragraph>
        </div>
      ) : (
        wishData.map((product) => (
          <div
            key={product.id}
            className="flex flex-col md:flex-row items-center justify-between w-11/12 md:w-4/5 mx-auto border border-gray-200 rounded-lg shadow-sm p-4 mb-4"
          >
            {/* Product Image */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <button>
                <Trash2
                  className="hover:text-red-600"
                  onClick={() => handleDelete(product?.id)}
                />
              </button>
              <img
                src={product.image}
                alt={product.title}
                className="w-20 h-20 object-cover rounded-md border"
              />
              {/* Product Details */}
              <div>
                <h2 className="text-lg font-semibold">{product.title}</h2>
                <div className="flex justify-start gap-5 items-center my-1">
                  <h2 className="text-lg font-semibold flex items-center gap-1">
                    <span>{(product?.originalPrice)-(product?.discountPrice)}</span>৳
                  </h2>
                  {product?.discountPrice > 0 && (
                    <h2 className="text-sm line-through text-gray-500 flex items-center gap-3">
                      <span>{product?.originalPrice}৳</span>
                    </h2>
                  )}
                </div>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" /> {product.time}
                </p>
              </div>
            </div>

            {/* Stock and Add to Cart */}
            <div className="flex items-center gap-4 mt-3 md:mt-0">
              {/* <p className="text-gray-500 flex items-center gap-1">
                ⏳ {product.stock} in stock
              </p> */}

              <Button
                // disabled={product?.stock === 0}
                className="bg-blue-600 text-white px-0 py-0 rounded-full hover:bg-blue-700 transition"
              >
                <Link
                  to={`/products/${product?.title?.replace(/\s+/g, '-').toLowerCase()}`}
                  className="px-4 py-2"
                >
                  {" "}
                  ADD TO CART{" "}
                </Link>
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default WishProductList;














// import { useCart } from "@/components/context/CartContext";
// import { useWishList } from "@/components/context/WishListContext";
// import { useGetSingleProductQuery } from "@/components/store/api/products/productApi";
// import Paragraph from "@/components/typography/Paragraph";
// import { Button } from "@/components/ui/button";
// import { CalendarDays, Trash2 } from "lucide-react";
// import { useEffect, useState } from "react";

// const WishProductList = () => {
//   const { removeFromWish } = useWishList();
//   const { addToCart } = useCart();
//   const [wishData, setWishData] = useState<any[]>([]);
//   const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

//   // Load wishlist data from localStorage only once
//   useEffect(() => {
//     const storedWish = localStorage.getItem("addToWish");
//     if (storedWish) {
//       setWishData(JSON.parse(storedWish));
//     }
//   }, []);

//   // Function to update wishlist data and localStorage together
//   const updateWish = (updatedWish: any[]) => {
//     setWishData(updatedWish);
//     localStorage.setItem("addToWish", JSON.stringify(updatedWish));
//   };

//   // Handle delete item
//   const handleDelete = (id: number) => {
//     removeFromWish(id);
//     const updatedWish = wishData.filter((item) => item.id !== id);
//     updateWish(updatedWish);
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   // Fetch single product data when selectedProductId changes
//   const { data: singleProduct, isLoading: singleProductLoading } = 
//     useGetSingleProductQuery(selectedProductId, {
//       skip: !selectedProductId, // Skip query if no product is selected
//     });

//   const addToCartHandler = async (productId: string) => {
//     setSelectedProductId(productId); // This will trigger the product query
//   };

//   // Handle adding to cart after product data is fetched
//   useEffect(() => {
//     if (singleProduct && !singleProductLoading) {
//       const product = singleProduct.data;
//       console.log(singleProduct)
      
//       // For products with single variation
//       const variation = product.VariationProduct?.[0];
//       const defaultColor = variation?.ProductColor?.[0] || null;

//       const cartProduct = {
//         id: product.id,
//         image: product?.ProductImage?.[0]?.imageUrl || "",
//         title: product.productName,
//         discountPrice: variation?.discountPrice || variation?.price,
//         originalPrice: variation?.price,
//         freeEmiCharge: product?.freeEmiCharge,
//         isEmi: product?.isEmi,
//         quantity: 1,
//         colorName: defaultColor?.color?.color,
//         colorId: defaultColor?.id,
//         variationId: variation?.id,
//         bookingPrice: variation?.bookingPrice || 0,
//         extraWarrantyId: variation?.ExtraWarranty?.[0]?.id || null,
//         extraWarrantyPrice: variation?.ExtraWarranty?.[0]?.price || null,
//         purchasePoint: variation?.purchasePoint || 0,
//         paymentMethod: "COD",
//         productLink: product.productLink || `/products/${product?.id}`,
//         brand: product?.brand,
//         category: product?.category,
//         ramRom:
//           variation?.ram && variation?.rom
//             ? `${variation.ram}GB/${variation.rom}GB`
//             : null,
//         sim: variation?.sim || null,
//         isShippedFree: variation?.isShippedFree || null,
//         extraWarrantyName: null,
//         chipset: null,
//         region: null,
//         inSideDeliveryCharge: product?.inSideDeliveryCharge || 0,
//         outSideDeliveryCharge: product?.outSideDeliveryCharge || 0,
//         stock: product?.stock || 0,
//       };

//       addToCart(cartProduct);
//       setSelectedProductId(null); // Reset selected product
//     }
//   }, [singleProduct, singleProductLoading, addToCart]);

//   return (
//     <div className="container mx-auto py-16">
//       {wishData.length === 0 ? (
//         <div className="text-center text-gray-500 h-full flex items-center justify-center">
//           <Paragraph>
//             <span className="text-xl md:text-3xl text-red-600 font-bold">
//               Your wishlist is empty.
//             </span>{" "}
//             <br /> Start adding products to your wishlist!
//           </Paragraph>
//         </div>
//       ) : (
//         wishData.map((product) => (
//           <div
//             key={product.id}
//             className="flex flex-col md:flex-row items-center justify-between w-11/12 md:w-4/5 mx-auto border border-gray-200 rounded-lg shadow-sm p-4 mb-4"
//           >
//             {/* Product Image */}
//             <div className="flex flex-col md:flex-row items-center gap-4">
//               <button>
//                 <Trash2
//                   className="hover:text-red-600"
//                   onClick={() => handleDelete(product?.id)}
//                 />
//               </button>
//               <img
//                 src={product.image}
//                 alt={product.title}
//                 className="w-20 h-20 object-cover rounded-md border"
//               />
//               {/* Product Details */}
//               <div>
//                 <h2 className="text-lg font-semibold">{product.title}</h2>
//                 <div className="flex justify-start gap-5 items-center my-1">
//                   <h2 className="text-lg font-semibold flex items-center gap-1">
//                     <span>{(product?.originalPrice)-(product?.discountPrice)}</span>৳
//                   </h2>
//                   {product?.discountPrice > 0 && (
//                     <h2 className="text-sm line-through text-gray-500 flex items-center gap-3">
//                       <span>{product?.originalPrice}৳</span>
//                     </h2>
//                   )}
//                 </div>
//                 <p className="text-sm text-gray-400 flex items-center gap-1">
//                   <CalendarDays className="w-4 h-4" /> {product.time}
//                 </p>
//               </div>
//             </div>

//             {/* Stock and Add to Cart */}
//             <div className="flex items-center gap-4 mt-3 md:mt-0">
//               <Button 
//                 onClick={() => addToCartHandler(product.id)}
//                 disabled={singleProductLoading && selectedProductId === product.id}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
//               >
//                 {singleProductLoading && selectedProductId === product.id ? 
//                   "Adding..." : "ADD TO CART"}
//               </Button>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default WishProductList;

