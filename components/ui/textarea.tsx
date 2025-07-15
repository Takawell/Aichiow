// components/ui/textarea.tsx
import { cn } from "@/utils/cn";
import { TextareaHTMLAttributes, forwardRef } from "react";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full px-4 py-2 rounded-lg bg-[#1e1e1e] border border-[#333] text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600",
        className
      )}
      rows={4}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
