import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface IHeadingProps {
  children: string | ReactNode;
  className?: string;
  variant: "primary" | "secondary" | "tertiary";
  align?: "center" | "start" | "end";
}

const Heading: FC<IHeadingProps> = ({
  children,
  className,
  variant,
  align,
}) => {
  return (
    <h2
      className={cn(
        "text-start",
        align === "center" && "text-center",
        align === "start" && "text-start",
        align === "end" && "text-end",
        variant === "primary" &&
          "text-[32px] font-[600] text-foreground leading-7 text-ellipsis",
        variant === "secondary" &&
          "text-[24px] font-[600] text-foreground leading-7 text-ellipsis",
        variant === "tertiary" &&
          "text-[20px] font-[500] text-foreground/90 leading-7 text-ellipsis",
        className
      )}
    >
      {children}
    </h2>
  );
};

export default Heading;
