// components/ui/input.tsx
import { cn } from "@/utils/cn";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full px-4 py-2 rounded-lg bg-[#1e1e1e] border border-[#333] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
