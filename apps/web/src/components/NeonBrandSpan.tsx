"use client";

interface NeonBrandSpanProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  withPlate?: boolean;
}

export function NeonBrandSpan({
  className = "",
  size = "md",
  withPlate = true,
}: NeonBrandSpanProps) {
  const sizeClasses = {
    sm: "text-xs sm:text-sm",
    md: "text-base sm:text-lg",
    lg: "text-xl sm:text-2xl",
  }[size];

  const content = (
    <span className={`inline-flex items-center tracking-tight font-black ${sizeClasses} select-none`}>
      <span className="dmc-neon-naxo">Naxo</span>
      <span className="dmc-neon-resuelve ml-1.5">Resuelve</span>
    </span>
  );

  if (withPlate) {
    return (
      <span className={`dmc-neon-plate ${className}`}>
        {content}
      </span>
    );
  }

  return <span className={className}>{content}</span>;
}
