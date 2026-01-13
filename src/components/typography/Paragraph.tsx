import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface IParagraphProps {
  children: string | ReactNode;
  className?: string;
  muted?: boolean;
}

const Paragraph: FC<IParagraphProps> = ({ children, className, muted }) => {
  return (
    <p
      className={cn(
        // Base styles
        "text-sm sm:text-base md:text-lg font-normal text-foreground/90 leading-6 sm:leading-7 md:leading-8 max-w-none truncate",

        // Muted styles
        muted && "text-gray-500",

        // Additional className for overrides
        className
      )}
    >
      {children}
    </p>
  );
};

export default Paragraph;
