import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import Heading from "@/components/typography/Heading";
import RelatedProductCard from "@/components/common/card/RelatedProductCard";

export default function RelatedProducts({ details }: any) {



  return (
    <SectionWrapper className="md:px-3 w-full">
      <div className="bg-white px-3 py-1.5 mb-5 rounded-md">
        <Heading
          align="start"
          className="text-primary mt-0 pb-0.5 text-lg lg:text-xl w-full"
          variant="primary"
        >
          Related Products
        </Heading>
      </div>
      <div className="flex flex-col gap-2 w-full">
        {details?.relatedProduct?.length > 0 ? (
          details?.relatedProduct?.map((product: any) => (
            <RelatedProductCard
             product={product}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No related products found.</p>
        )}
      </div>
    </SectionWrapper>
  );
}
