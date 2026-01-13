import ProductDetailsSkeleton from "@/components/common/skeleton/ProductDetailsSkeleton";
import DetailsInformation from "@/components/pagesComponents/productDetailsComponent/DetailsInformation";
import ProductsSpecification from "@/components/pagesComponents/productDetailsComponent/ProductsSpecification";
import RelatedProducts from "@/components/pagesComponents/productDetailsComponent/RelatedProducts";
import { useGetSingleProductQuery } from "@/components/store/api/products/productApi";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import offer from "../../../assets/images/offer.svg";
import { Link } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: singleProduct, isLoading: singleProductLoading } =
    useGetSingleProductQuery(id);


  const sanitizedDescription = DOMPurify.sanitize(singleProduct?.data?.inBox);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (singleProductLoading) {
    return <ProductDetailsSkeleton />;
  }
  if (!singleProduct) {
    return <div className="flex justify-center items-center h-screen"><h1 className="text-2xl font-semibold">Product Not Found Go To <Link to={'/'} className="text-blue-600">Home Page</Link></h1></div>  // Return a 404 page or redirect to a 404 page component if the product is not found.  // This should be handled by the routing system and not by the component itself.  // This is a good practice to follow for better error handling and security.  // In a real-world application, you might want to handle this case differently, perhaps by showing a fallback product or offering a search functionality.  // This is just an example.  // You should replace the "h1" tag with a more appropriate error message for your specific use case.  // This is a basic example and you might want to enhance this error handling in a real-world application.  // You might want to use a custom error page, or handle it differently based on the status code returned by the API.  // This is just an example.  // You should replace the "h1" tag
  }

  
  return (
    <div className="w-full px-1.5 md:px-3 bg-[#F1F1F1]">
      {/* <div className="bg-secondary py-3">
        <SectionWrapper className="">
          <h2 className="text-[14px] font-semibold flex items-center">
            <Link to="/">Home</Link>
            <span className="px-2">
              <MdArrowForwardIos />
            </span>{" "}
            Categories Name{" "}
          </h2>
        </SectionWrapper>
      </div> */}
      {/* product details */}
      <ProductsSpecification details={singleProduct} />
      <div className="grid grid-cols-12 justify-center items-start gap-3 mt-5">
        <div className="grid col-span-12 lg:col-span-8">
          {singleProduct?.data?.inBox && (
            <div className="flex items-center gap-2 bg-[#FFF] rounded-lg px-5 shadow-md mx-3 mb-8">
              {" "}
              <img src={offer} alt="offer" className="w-16" />
              <p className="text-sm font-semibold text-primary animate-pulse">In the box: </p>
              <div className="prose prose-headings:font-bold prose-ul:list-disc prose-ol:list-decimal max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: filteredContent }}
                  className="w-full [&_img]:w-full [&_img]:h-auto "
                />
              </div>
            </div>
          )}
          <DetailsInformation details={singleProduct?.data} />
        </div>
        <div className="grid col-span-12 lg:col-span-4">
          <RelatedProducts details={singleProduct} />
        </div>
      </div>
    </div>
  );
}
