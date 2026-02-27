import { useLocation } from "react-router";

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="flex flex-col gap-2 items-center justify-center text-center min-h-56">
      <h1 className="text-heading text-2xl">Route not found</h1>
      <p>
        The route at path <span className="font-mono">{location.pathname}</span>{" "}
        does not exist
      </p>
    </div>
  );
}
