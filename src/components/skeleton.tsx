import React from "react";
import { twMerge } from "tailwind-merge";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    delay?: 20; // Delay in milliseconds
  }
  
  const Skeleton: React.FC<SkeletonProps> = ({ className, delay = 0, ...props }) => {
    return (
      <div
        className={twMerge("animate-pulse rounded-md bg-secondaryDefault/10", className)}
        style={{ animationDelay: `${delay}ms` }}
        {...props}
      />
    );
  };
export default Skeleton;
