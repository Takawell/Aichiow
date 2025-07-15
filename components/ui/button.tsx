// components/ui/button.tsx
import { cn } from "@/utils/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
