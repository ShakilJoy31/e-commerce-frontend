import { useGetAllPostsQuery } from "@/components/store/api/blogPost/blogPostApi";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import LoaderSpinner from "@/components/loader/LoaderSpinner";
import { MdArrowForwardIos } from "react-icons/md";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { useEffect } from "react";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  author: string;
  image: string;
  createdAt: string;
  content: string;
  status: string;
}

const Blogs = () => {
  const { data: blogPosts, isLoading, isError } = useGetAllPostsQuery({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading blog posts
      </div>
    );
  }

  const publishedPosts =
    blogPosts?.data?.filter((post) => post.status === "Published") || [];

  return (
    <div className="min-h-screen">
      {/* Header Section - Matching SingleBlogs style */}
      <div className="bg-other_bg bg-cover py-16">
        <SectionWrapper className="flex flex-col items-center justify-center">
          <h2 className="text-[24px] font-semibold text-center">Blog Posts</h2>
          <h2 className="text-[14px] font-medium flex items-center">
            Home{" "}
            <span className="px-2">
              <MdArrowForwardIos />
            </span>{" "}
            Blogs
          </h2>
        </SectionWrapper>
      </div>

      {/* Main Content */}
      <SectionWrapper>
        <div className="py-8">
          {/* Loading state */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <p className="mt-4 text-gray-600">
                <LoaderSpinner />
              </p>

              {/* Skeleton loading for blog cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
                  >
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-6 flex-grow space-y-3">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3 mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {publishedPosts.length === 0 ? (
                <div className="text-center py-8">No blog posts available</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publishedPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </SectionWrapper>
    </div>
  );
};

const BlogCard = ({ post }: { post: BlogPost }) => {
  const cleanContent = DOMPurify.sanitize(post.content);
  const excerpt =
    cleanContent.substring(0, 100) + (cleanContent.length > 100 ? "..." : "");

  return (
    <Link to={`/blogs/${post.slug}`} className="block h-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="h-48 overflow-hidden bg-gray-100">
          <img
            src={
              post.image ||
              "https://via.placeholder.com/400x300?text=Blog+Image"
            }
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/400x300?text=Blog+Image";
            }}
          />
        </div>

        <div className="p-6 flex-grow">
          <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span>By {post.author}</span>
            <span>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <div
            className="text-gray-600 mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />

          <div className="text-blue-600 hover:text-blue-800 font-medium mt-auto">
            Read More →
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Blogs;
