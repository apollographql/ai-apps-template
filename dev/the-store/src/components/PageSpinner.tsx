import { Spinner } from "./Spinner";

export function PageSpinner() {
  return (
    <div className="min-h-52 flex items-center justify-center">
      <Spinner className="size-10" />
    </div>
  );
}
