import { ImSpinner5 } from "react-icons/im";

export function LoadingSpinner({ size = 48 }: { size?: number }) {
  return (
    <>
      <ImSpinner5 className="animate-spin" size={size} />
    </>
  );
}
