import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "dark" | "light" | "danger";
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
      "inline-flex items-center justify-center font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none rounded-lg cursor-pointer";

    const variantStyles = {
      // #1769AA Primary Blue
      primary:
        "bg-[#1769AA] text-white hover:bg-[#135488] active:bg-[#0F426C] focus-visible:ring-[#1769AA] shadow-sm",
      // White background with #1769AA border & text
      secondary:
        "bg-white text-[#1769AA] border border-[#1769AA] hover:bg-[#EBF3FB] active:bg-[#D4E6F7] focus-visible:ring-[#1769AA] shadow-sm",
      // #00A6A6 Accent Teal
      accent:
        "bg-[#00A6A6] text-white hover:bg-[#008B8B] active:bg-[#007070] focus-visible:ring-[#00A6A6] shadow-sm",
      // #12355B Primary Navy
      dark:
        "bg-[#12355B] text-white hover:bg-[#0D2744] active:bg-[#08182B] focus-visible:ring-[#12355B] shadow-sm",
      // Outline with #E2E8F0 border
      outline:
        "border border-[#E2E8F0] bg-white text-[#172B4D] hover:bg-[#F7F9FC] hover:border-[#64748B]/40 active:bg-[#E2E8F0] focus-visible:ring-[#1769AA] shadow-sm",
      // Ghost hover
      ghost:
        "text-[#172B4D] hover:bg-[#F7F9FC] hover:text-[#12355B] active:bg-[#E2E8F0] focus-visible:ring-[#1769AA]",
      // #DFF5F3 Light Teal
      light:
        "bg-[#DFF5F3] text-[#12355B] hover:bg-[#C8EFEA] active:bg-[#B0E8E1] font-semibold shadow-sm",
      // Danger alert
      danger:
        "bg-[#D64545] text-white hover:bg-[#BD3636] active:bg-[#A32A2A] focus-visible:ring-[#D64545] shadow-sm",
    };

    const sizeStyles = {
      sm: "h-8 px-3.5 text-xs gap-1.5",
      md: "h-10 px-5 py-2 text-sm gap-2",
      lg: "h-11 px-6 text-base gap-2.5",
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

