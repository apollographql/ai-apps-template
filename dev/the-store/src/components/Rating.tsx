import { Star } from "lucide-react";
import { clsx } from "clsx";

interface Props {
  className?: string;
  rating: number;
}

export function Rating({ className, rating }: Props) {
  const filled = Math.round(rating);
  const remaining = 5 - filled;

  return (
    <div className={clsx("flex gap-1 items-center", className)}>
      {Array.from({ length: filled }).map((_, idx) => (
        <Star
          key={idx}
          className="text-yellow-300 dark:text-yellow-200"
          fill="currentColor"
          size={16}
        />
      ))}
      {Array.from({ length: remaining }).map((_, idx) => (
        <Star key={idx} className="text-primary" size={16} />
      ))}
      <span className="tabular-nums">{rating}</span>
    </div>
  );
}
