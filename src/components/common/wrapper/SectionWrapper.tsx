import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";
interface ISectionWrapperProps {
  children: ReactNode;
  className?: string;
}
const SectionWrapper: FC<ISectionWrapperProps> = ({ children, className }) => {
  return (
    <section className={cn("max-w-[1650px] mx-auto px-1 md:px-3", className)}>
      {children}
    </section>
  );
};

export default SectionWrapper;
