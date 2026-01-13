import { useGetPostByIdQuery } from "@/components/store/api/blogPost/blogPostApi";
import { useParams } from "react-router-dom";
import { MdArrowForwardIos } from "react-icons/md";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "@/components/store/store";
import { useEffect } from "react";

const SingleBlogs = () => {
  const { slug } = useParams();
  const { data: singleBlog, isLoading } = useGetPostByIdQuery(slug);
  const user = useSelector(selectUser);

  // Sanitize and format the content
  const sanitizedContent = DOMPurify.sanitize(singleBlog?.data?.content || "");

  const formattedContent = sanitizedContent
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen">
        {/* Header Section Skeleton */}
        <div className="bg-gray-100 py-16 animate-pulse">
          <SectionWrapper className="flex flex-col items-center justify-center">
            <div className="h-8 w-3/4 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
          </SectionWrapper>
        </div>

        {/* Content Section Skeleton */}
        <SectionWrapper>
          <div className="bg-white py-8 px-4">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {/* Image Skeleton */}
              <div className="w-full md:w-1/2">
                <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>

              {/* Metadata Skeleton */}
              <div className="w-full md:w-1/2 space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-11/12 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-10/12 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-9/12 animate-pulse"></div>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-other_bg bg-cover py-16">
        <SectionWrapper className="flex flex-col items-center justify-center">
          <h2 className="text-[24px] font-semibold text-center">
            {singleBlog?.data?.title}
          </h2>
          <h2 className="text-[14px] font-medium flex items-center">
            Home{" "}
            <span className="px-2">
              <MdArrowForwardIos />
            </span>{" "}
            Blogs{" "}
            <span className="px-2">
              <MdArrowForwardIos />
            </span>{" "}
            {singleBlog?.data?.title}
          </h2>
        </SectionWrapper>
      </div>

      {/* Blog Content Section */}
      <SectionWrapper>
        <div className="bg-white text-black py-8 px-4">
          {/* Image and Metadata Row */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Blog Image */}
            <div className="w-full md:w-1/2">
              <img
                src={singleBlog?.data?.image}
                alt={singleBlog?.data?.title}
                className="w-full h-auto rounded-lg shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/800x500?text=Blog+Image";
                }}
              />
            </div>

            {/* Blog Metadata */}
            <div className="w-full md:w-1/2 flex flex-col">
              <div className="flex justify-between">
                <h1 className="text-3xl font-bold mb-4">
                  {singleBlog?.data?.title}
                </h1>
                <div>
                  {user?.role.toLowerCase() === "super_admin" && (
                    <Link
                      to={`/kry-admin-portal/edit-post/${singleBlog?.data?.slug}`}
                      className="border"
                    >
                      <span className="bg-primary py-1 px-3 text-white rounded-md">
                        Edit
                      </span>
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="text-gray-600 font-medium">
                  By {singleBlog?.data?.author}
                </span>
                <span className="text-gray-400">
                  {format(
                    new Date(singleBlog?.data?.createdAt),
                    "MMMM d, yyyy"
                  )}
                </span>
                {/* Category Badge */}
                {singleBlog?.data?.categoryId && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Category: {singleBlog.data.categoryId}
                  </span>
                )}
                {/* Tag Badge */}
                {singleBlog?.data?.tagId && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Tag: {singleBlog.data.tagId}
                  </span>
                )}
              </div>

              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: singleBlog?.data?.content
                      ? formattedContent.substring(0, 500) +
                        (formattedContent.length > 500 ? "..." : "")
                      : "No content available",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Full Content Section */}
          <div className="prose prose-headings:font-bold prose-ul:list-disc prose-ol:list-decimal max-w-none mt-8">
            <h2 className="text-xl font-semibold">Content</h2>
            <div
              dangerouslySetInnerHTML={{ __html: formattedContent }}
              className="w-full [&_img]:w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:shadow-md"
            />
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default SingleBlogs;
