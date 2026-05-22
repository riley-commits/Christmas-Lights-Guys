import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  label = true,
  size = "md",
}: {
  className?: string;
  label?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dims = size === "sm" ? { w: 96, h: 40 } : size === "lg" ? { w: 200, h: 84 } : { w: 132, h: 56 };
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo.webp"
        alt="The Christmas Light Guys"
        width={dims.w}
        height={dims.h}
        priority
        className="select-none"
      />
      {label && (
        <span className="hidden sm:inline-block text-[11px] uppercase tracking-[0.16em] text-pine font-bold border-l border-line pl-2 ml-1">
          Field Ops
        </span>
      )}
    </div>
  );
}
