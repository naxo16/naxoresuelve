"use client";

interface NeonBrandSpanProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function NeonBrandSpan({
  className = "",
  size = "md",
}: NeonBrandSpanProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }[size];

  return (
    <span
      className={`inline-flex items-center tracking-tight font-black ${sizeClasses} select-none text-[#111827] ${className}`}
    >
      <span>Naxo</span>
      <span className="dmc-neon-span ml-1.5">Resuelve</span>
    </span>
  );
}
