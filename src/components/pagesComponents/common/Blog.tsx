import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import bannerbg from "../../../assets/images/icon/otherbg.png";
import { MdArrowForwardIos } from "react-icons/md";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
const Blog = () => {
  return (
    <SectionWrapper>
      <div
        className="bg-cover bg-center py-16"
        style={{
          backgroundImage: `url(${bannerbg})`,
        }}
      >
        <PageWrapper className="flex flex-col items-center justify-center">
          <h2 className="text-[24px] font-semibold text-center ">Blog</h2>
          <h2 className="text-[14px] font-medium flex items-center">
            Home{" "}
            <span className="px-2">
              <MdArrowForwardIos />
            </span>{" "}
            Blog
          </h2>
        </PageWrapper>
      </div>
      <div className="h-screen w-full flex flex-col items-center mt-10">
        <h1 className="text-2xl font-bold">We are working on it...</h1>
        <p className="animate-pulse text-xl font-bold">Please stay tuned.</p>
      </div>
    </SectionWrapper>
  );
};

export default Blog;
