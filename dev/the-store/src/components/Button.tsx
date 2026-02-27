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
  const buttonSize = children ? size : (`${size}-icon` as const);

  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center gap-2 font-semibold justify-center rounded-lg transition-colors",
        "disabled:text-disabled disabled:bg-disabled disabled:cursor-not-allowed disabled:border-transparent",
        variant === "primary" &&
          "text-white bg-button-primary hover:bg-button-primary-hover",
        variant === "secondary" &&
          "text-primary border border-primary bg-button-secondary hover:bg-button-secondary-hover",
        variant === "hidden" && "text-primary hover:bg-button-secondary-hover",
        buttonSize === "lg" && "px-4 py-3 h-12 text-base",
        buttonSize === "lg-icon" && "px-4 w-12 h-12 text-base",
        buttonSize === "md" && "px-3 py-2 h-10 text-sm",
        buttonSize === "md-icon" && "px-3 w-10 h-10 text-sm",
        buttonSize === "sm" && "px-3 py-2 h-8 text-sm",
        buttonSize === "sm-icon" && "px-3 w-8 h-8 text-sm",
        className
      )}
    >
      {IconLeft && (
        <IconLeft
          size={iconSize(size)}
          className={clsx(
            "shrink-0",
            props.disabled ? "text-icon-disabled" : "text-icon-primary"
          )}
        />
      )}
      {children}
      {IconRight && (
        <IconRight
          size={iconSize(size)}
          className={clsx(
            "shrink-0",
            props.disabled ? "text-icon-disabled" : "text-icon-primary"
          )}
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
