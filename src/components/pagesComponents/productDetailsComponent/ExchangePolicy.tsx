import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { useGetSinglePageQuery } from "@/components/store/api/pages/pageApi";
import { MdArrowForwardIos } from "react-icons/md";
import DOMPurify from "dompurify";
import { useEffect } from "react";

const ExchangePolicy = ({slug}:any) => {
console.log(slug)
  const { data: singlePage, isLoading } = useGetSinglePageQuery(slug);

  const sanitizedDescription = DOMPurify.sanitize(singlePage?.data?.content);

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
  
  return (
    <div className="container mx-auto min-h-screen">
      <div className="bg-other_bg bg-cover py-16">
        <SectionWrapper className="flex flex-col items-center justify-center">
          <h2 className="text-[24px] font-semibold text-center">
            {singlePage?.data?.title}
          </h2>
          <h2 className="text-[14px] font-medium flex items-center">
            Home{" "}
            <span className="px-2">
              <MdArrowForwardIos />
            </span>{" "}
            {singlePage?.data?.title}
          </h2>
        </SectionWrapper>
      </div>

      <SectionWrapper>
        {isLoading ? (
          <>
            <LoaderSpinner />
          </>
        ) : (
          <>
            {" "}
            <div className="bg-white text-black py-8 px-4">
              <div className="prose prose-headings:font-bold prose-ul:list-disc prose-ol:list-decimal max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: filteredContent }}
                  className="w-full [&_img]:w-full [&_img]:h-auto"
                />
              </div>
            </div>
          </>
        )}
      </SectionWrapper>
    </div>
  );
};

export default ExchangePolicy;
