import { Loader2Icon } from "lucide-react";
import clsx from "clsx";

export function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={clsx(
        "size-4 animate-spin text-blue-400 dark:text-blue-200",
        className
      )}
      {...props}
    />
  );
}
