import type { ComponentPropsWithoutRef } from "react";
import { clsx } from "clsx";

interface Props extends ComponentPropsWithoutRef<"button"> {
  variant: "primary" | "secondary";
  size?: "lg" | "md";
}

export function Button({
  children,
  className,
  variant,
  size = "md",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={clsx(
        className,
        "inline-flex items-center gap-2 font-semibold justify-center rounded-lg transition-colors",
        variant === "primary" &&
          "bg-button-primary hover:bg-button-primary-hover",
        variant === "secondary" &&
          "border border-primary bg-button-secondary hover:bg-button-secondary-hover",
        size === "lg" && "px-4 py-3 h-12 font-base",
        size === "md" && "px-3 py-2 h-10"
      )}
    >
      {children}
    </button>
  );
}
