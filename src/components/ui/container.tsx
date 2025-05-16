
import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <div className={cn("container mx-auto", className)} {...props}>
      {children}
    </div>
  );
};
