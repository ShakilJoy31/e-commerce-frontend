import PageTransition from "@/components/effects/PageTransition";
import { cn } from "@/lib/utils";
import { FC } from "react";
interface IPageWrapperProps {
  children: any;
  className?: string;
}
const PageWrapper: FC<IPageWrapperProps> = ({ children, className }) => {
  return (
    <section className={cn(className, "w-full")}>
      <PageTransition variant="fade">{children}</PageTransition>
    </section>
  );
};

export default PageWrapper;
