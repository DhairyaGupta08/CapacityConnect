import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark" | "light" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none rounded-xl cursor-pointer";

    const variantStyles = {
      // #0077B6 (Deep Cobalt Ocean) with #023E8A / #03045E hover
      primary:
        "bg-[#0077B6] text-white hover:bg-[#023E8A] active:bg-[#03045E] focus-visible:ring-[#00B4D8] shadow-md hover:shadow-lg",
      // #0096C7 (Vibrant Azure)
      secondary:
        "bg-[#0096C7] text-white hover:bg-[#0077B6] active:bg-[#023E8A] font-bold focus-visible:ring-[#48CAE4] shadow-md hover:shadow-lg",
      // #03045E (Deep Midnight Navy)
      dark:
        "bg-[#03045E] text-white hover:bg-[#023E8A] active:bg-[#010224] focus-visible:ring-[#0077B6] shadow-md hover:shadow-lg",
      // Outline with #0096C7 border & White background
      outline:
        "border border-[#0096C7]/50 bg-white text-[#023E8A] hover:bg-[#CAF0F8] hover:text-[#03045E] hover:border-[#0077B6] active:bg-[#ADE8F4] focus-visible:ring-[#0096C7] shadow-sm",
      // Ghost hover
      ghost:
        "text-[#023E8A] hover:bg-[#CAF0F8] hover:text-[#03045E] active:bg-[#ADE8F4] focus-visible:ring-[#0096C7]",
      // #90E0EF (Soft Ice Blue)
      light:
        "bg-[#90E0EF] text-[#03045E] hover:bg-[#48CAE4] active:bg-[#00B4D8] active:text-white font-bold shadow-sm",
      // Danger alert
      danger:
        "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-500 shadow-sm",
    };

    const sizeStyles = {
      sm: "h-8 px-3.5 text-xs gap-1.5",
      md: "h-10 px-5 py-2 text-sm gap-2",
      lg: "h-12 px-7 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {!isLoading && leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
