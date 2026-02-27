import type { ComponentPropsWithoutRef, ElementType } from "react";
import { clsx } from "clsx";

interface Props extends ComponentPropsWithoutRef<"button"> {
  variant: "primary" | "secondary" | "hidden";
  size?: "lg" | "md" | "sm";
  iconLeft?: ElementType<{ className?: string; size: number }>;
  iconRight?: ElementType<{ className?: string; size: number }>;
}

export function Button({
  children,
  className,
  variant,
  size = "md",
  iconLeft: IconLeft,
  iconRight: IconRight,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center gap-2 font-semibold justify-center rounded-lg transition-colors",
        "disabled:text-disabled disabled:bg-disabled disabled:cursor-not-allowed disabled:border-transparent",
        variant === "primary" &&
          "bg-button-primary hover:bg-button-primary-hover",
        variant === "secondary" &&
          "border border-primary bg-button-secondary hover:bg-button-secondary-hover",
        variant === "hidden" && "hover:bg-button-secondary-hover",
        size === "lg" && "px-4 py-3 h-12 text-base",
        size === "md" && "px-3 py-2 h-10 text-sm",
        size === "sm" && "px-3 py-2 h-8 text-sm",
        className
      )}
    >
      {IconLeft && (
        <IconLeft
          size={iconSize(size)}
          className={
            props.disabled ? "text-icon-disabled" : "text-icon-primary"
          }
        />
      )}
      {children}
      {IconRight && (
        <IconRight
          size={iconSize(size)}
          className={
            props.disabled ? "text-icon-disabled" : "text-icon-primary"
          }
        />
      )}
    </button>
  );
}

function iconSize(buttonSize: NonNullable<Props["size"]>) {
  switch (buttonSize) {
    case "lg":
      return 24;
    case "md":
    case "sm":
      return 16;
  }
}
