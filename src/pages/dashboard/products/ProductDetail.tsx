import ButtonLoader from "@/components/loader/ButtonLoader";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import {
  useDeleteVariationMutation,
  useGetSingleProductQuery,
} from "@/components/store/api/products/productApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import DOMPurify from "dompurify";
import { FaTrash } from "react-icons/fa";
const ProductDetail = ({ product }: any) => {
  const { toast } = useToast();
  const { data: singleProduct, isLoading } = useGetSingleProductQuery(product);
  const [deleteVariation, { isLoading: deleteLoading }] =
    useDeleteVariationMutation();

  const handleDelete = async (
    id: string,
    type: "variation" | "color" | "warranty"
  ) => {
    try {
      const result = await deleteVariation({ id, type });
      if (result.data.success) {
        toast({
          title: "Variation deleted successfully",
          description: "The variation has been deleted.",
        });
      } else {
        toast({
          title: "Variation delete failed",
          description: "There is a problem deleting this variation",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (isLoading) {
    return <LoaderSpinner />;
  }

  const sanitizedSortDescription = DOMPurify.sanitize(
    singleProduct?.data?.sortDescription
  );
  const sanitizedDescription = DOMPurify.sanitize(
    singleProduct?.data?.description
  );
  const filteredContent = sanitizedDescription
    .replace(/<h1>/g, '<h1 class="text-2xl font-bold mb-2">')
    .replace(/<\/h1>/g, "</h1>")
    .replace(/<h2>/g, '<h2 class="text-xl font-semibold mb-2">')
    .replace(/<\/h2>/g, "</h2>")
    .replace(/<h3>/g, '<h3 class="text-lg font-semibold mb-2">')
    .replace(/<\/h3>/g, "</h3>")
    .replace(/<h4>/g, '<h4 class="text-base font-semibold mb-2">')
    .replace(/<\/h4>/g, "</h4>")
    .replace(/<p>/g, '<p class="mb-4 text-base leading-relaxed">')
    .replace(/<\/p>/g, "</p>")
    .replace(/<ul>/g, '<ul class="list-disc pl-5">')
    .replace(/<\/ul>/g, "</ul>")
    .replace(/<ol>/g, '<ol class="list-decimal pl-5">')
    .replace(/<\/ol>/g, "</ol>");
  const filteredContents = sanitizedSortDescription
    .replace(/<h1>/g, '<h1 class="text-2xl font-bold mb-2">')
    .replace(/<\/h1>/g, "</h1>")
    .replace(/<h2>/g, '<h2 class="text-xl font-semibold mb-2">')
    .replace(/<\/h2>/g, "</h2>")
    .replace(/<h3>/g, '<h3 class="text-lg font-semibold mb-2">')
    .replace(/<\/h3>/g, "</h3>")
    .replace(/<h4>/g, '<h4 class="text-base font-semibold mb-2">')
    .replace(/<\/h4>/g, "</h4>")
    .replace(/<p>/g, '<p class="mb-4 text-base leading-relaxed">')
    .replace(/<\/p>/g, "</p>")
    .replace(/<ul>/g, '<ul class="list-disc pl-5">')
    .replace(/<\/ul>/g, "</ul>")
    .replace(/<ol>/g, '<ol class="list-decimal pl-5">')
    .replace(/<\/ol>/g, "</ol>");

  return (
    <div className="product-details">
      {/* Product Name */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">
            {singleProduct?.data?.productName}
          </h1>
          <p className="font-bold border border-primary p-1 rounded-md text-primary">
            {singleProduct?.data?.type}
          </p>
        </div>
        <div className="flex items-center justify-start">
          <img
            src={singleProduct?.data?.brand?.image}
            alt={`${singleProduct?.data.brand.brand}`}
            className="w-[30px] h-[30px] object-contain"
          />
          <p>{singleProduct?.data?.brand?.brand}</p>
        </div>
      </div>

      {/* Product Images */}
      <div className="flex items-center justify-start mt-5">
        {singleProduct?.data?.ProductImage?.map((img, idx) => (
          <img
            key={idx}
            src={img.imageUrl}
            alt={`${singleProduct?.data.productName} - Color ${img.colorId}`}
            className="w-[150px] h-[150px] object-contain"
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-5 items-center my-5">
        <div className="border border-primary rounded-md p-1.5 flex  gap-1 items-center">
          <strong>Category:</strong>{" "}
          <img
            src={singleProduct?.data.category.image}
            alt={`${singleProduct?.data.category.name}`}
            className="w-[30px] h-[30px] object-contain"
          />
          <span className="text-lg ml-1">
            {singleProduct?.data?.category?.name}
          </span>
        </div>
        <div className="border border-primary rounded-md p-1.5">
          <strong>Sub Category:</strong>{" "}
          <span className="text-lg ml-1">
            {singleProduct?.data?.subCategory?.map(
              (sub) => sub?.subCategory?.name
            )}
          </span>
        </div>
        <div className="border border-primary rounded-md p-1.5">
          <strong>Highlight Text:</strong>{" "}
          <span className="text-lg ml-1">
            {singleProduct?.data?.highlightText}
          </span>
        </div>
        <div className="border border-primary rounded-md p-1.5">
          <strong>Whatsapp Number:</strong>{" "}
          <span className="text-lg ml-1">
            {singleProduct?.data?.whatsAppNumber}
          </span>
        </div>
      </div>

      {/* Price and Stock for All Variations */}
      <div className="mt-5">
        <h3 className="text-xl font-semibold text-primary border-b border-primary pb-1">
          Variations
        </h3>
        <div className=" gap-3 mt-2">
          {singleProduct?.data?.VariationProduct?.length > 0 &&
            singleProduct?.data.VariationProduct.map((variation, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-center gap-5 border p-4 border-primary rounded-md"
              >
                <div className="flex flex-wrap  gap-2">
                  {" "}
                  {/* <h4 className="font-semibold">Variation {idx + 1}</h4> */}
                  <p className="border border-primary rounded-md p-1.5">
                    <strong>RAM:</strong>{" "}
                    <span className="text-lg ml-1">{variation.ram}</span>
                  </p>
                  <p className="border border-primary rounded-md p-1.5">
                    <strong>ROM:</strong>{" "}
                    <span className="text-lg ml-1">{variation.rom}</span>{" "}
                  </p>
                  <p className="border border-primary rounded-md p-1.5">
                    <strong>SIM:</strong>{" "}
                    <span className="text-lg ml-1">{variation.sim}</span>{" "}
                  </p>
                  <p className="border border-primary rounded-md p-1.5">
                    <strong>Price:</strong>{" "}
                    <span className="text-lg ml-1">৳ {variation.price}</span>{" "}
                  </p>
                  <p className="border border-primary rounded-md p-1.5">
                    <strong>Discount Price:</strong>{" "}
                    <span className="text-lg ml-1">
                      ৳ {variation.discountPrice}
                    </span>{" "}
                  </p>
                  <p className="border border-primary rounded-md p-1.5">
                    <strong>Regular Price:</strong>{" "}
                    <span className="text-lg ml-1">
                      ৳ {variation.regularPrice}
                    </span>{" "}
                  </p>
                  <p className="border border-primary rounded-md p-1.5">
                    <strong>Booking Price:</strong>{" "}
                    <span className="text-lg ml-1">
                      ৳ {variation.bookingPrice}
                    </span>{" "}
                  </p>
                  <p className="border border-primary rounded-md p-1.5">
                    <strong>Stock:</strong>{" "}
                    <span className="text-lg ml-1">
                      {variation.stock} available
                    </span>
                  </p>
                  {variation?.ProductColor?.length > 0 &&
                    variation.ProductColor.map((color, colorIdx) => (
                      <p
                        key={colorIdx}
                        className="border flex gap-2 items-center mb-2.5 border-primary rounded-md p-1.5"
                      >
                        <strong>Color Name:</strong>
                        <span className="text-lg ml-1 ">
                          {color?.color?.color} ({color?.color?.colorCode})
                        </span>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              disabled={deleteLoading}
                              className="text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                              <FaTrash />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="btn-destructive-fill">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(color.id, "color")}
                              >
                                {deleteLoading && <ButtonLoader />} Confirm
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </p>
                    ))}
                  {variation?.ExtraWarranty?.length > 0 &&
                    variation.ExtraWarranty.map((warr, Idx) => (
                      <div key={Idx} className="flex items-center gap-2">
                        <p className="border mb-2.5 border-primary rounded-md p-1.5">
                          <strong>Extra Warranty Type:</strong>
                          <span className="text-lg ml-1 ">{warr?.name}</span>
                        </p>
                        <p className="border mb-2.5 border-primary rounded-md p-1.5">
                          <strong>Extra Warranty Price:</strong>
                          <span className="text-lg ml-1 ">{warr?.price}</span>
                        </p>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              disabled={deleteLoading}
                              className="text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                              <FaTrash />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="btn-destructive-fill">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDelete(warr.id, "warranty")
                                }
                              >
                                {deleteLoading && <ButtonLoader />} Confirm
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                </div>

                <div className="mx-auto">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        disabled={deleteLoading}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <FaTrash />
                        Delete Variation
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="btn-destructive-fill">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleDelete(variation.id, "variation")
                          }
                        >
                          {deleteLoading && <ButtonLoader />} Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* HIGHLIGHT PRODUCT */}
      <div className="mt-5">
        <h3 className="text-xl font-semibold text-primary border-b border-primary pb-1">
          Highlight Product
        </h3>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          {singleProduct?.data?.highlightProduct?.length > 0 &&
            singleProduct?.data?.highlightProduct.map((warr, Idx) => (
              <div key={Idx} className="flex items-center gap-2">
                <p className="border mb-2.5 border-primary rounded-md p-1.5">
                  <strong>Product Name:</strong>
                  <span className="text-lg ml-1 ">
                    {warr?.accessories?.productName}
                  </span>
                </p>
                <p className="border mb-2.5 border-primary rounded-md p-1.5">
                  <strong>Type:</strong>
                  <span className="text-lg ml-1 ">
                    {warr?.accessories?.type}
                  </span>
                </p>
              </div>
            ))}
        </div>
      </div>
      {/* PRODUCT FEATURE */}
      <div className="mt-5">
        <h3 className="text-xl font-semibold text-primary border-b border-primary pb-1">
          Product Features
        </h3>
        <div className="flex flex-col gap-3 mt-3">
          {singleProduct?.data?.ProductFeatures?.length > 0 &&
            singleProduct?.data.ProductFeatures.map((feature, Idx) => (
              <div key={Idx} className="flex items-center gap-2">
                {/* Feature Name */}
                <p className="border mb-2.5 border-primary rounded-md p-1.5">
                  <strong>Feature Name:</strong>
                  <span className="text-lg ml-1">
                    {feature?.featureKey?.name}
                  </span>
                </p>

                {/* Feature Value */}
                <p className="border mb-2.5 border-primary rounded-md p-1.5">
                  <strong>Value:</strong>
                  <span className="text-lg ml-1">{feature?.value}</span>
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Description */}
      <h3 className="text-xl font-semibold text-primary border-b border-primary pb-1 mt-5">
        Description
      </h3>

      {/* Sort Description */}
      <div className="mt-2">
        <strong>Sort Description:</strong>{" "}
        <div className="prose prose-headings:font-bold prose-ul:list-disc prose-ol:list-decimal max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: filteredContents }}
            className="w-full [&_img]:w-full [&_img]:h-auto"
          />
        </div>
      </div>
      <div className="pt-2">
        <strong>Description:</strong>
        <div className="prose prose-lg prose-headings:font-bold prose-ul:list-disc prose-ol:list-decimal max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: filteredContent }}
            className="w-full [&_img]:w-full [&_img]:h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
