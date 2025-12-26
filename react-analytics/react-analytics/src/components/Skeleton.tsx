import React from "react";

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: "text" | "rectangular" | "circular";
  animation?: "pulse" | "wave" | "none";
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width,
  height,
  variant = "text",
  animation = "pulse",
}) => {
  const variantClasses = {
    text: "skeleton--text",
    rectangular: "skeleton--rectangular",
    circular: "skeleton--circular",
  };

  const animationClasses: Record<string, string> = {
    pulse: "skeleton--pulse",
    wave: "skeleton--wave",
    none: "",
  };

  const style = {
    width: width || "auto",
    height: height || "auto",
  };

  return (
    <div
      className={`skeleton ${variantClasses[variant]} ${animationClasses[animation]} ${className}`.trim()}
      style={style}
    />
  );
};

export default Skeleton;
