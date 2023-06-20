import { twMerge } from "tailwind-merge";
import { LoadingSpinner } from "../../Generic";

// Big thank to https://delba.dev/blog/animated-loading-skeletons-with-tailwind for the guide on skeleton gradients
export function LoadingSkeletonCard({
  className = "",
}: {
  className?: string;
}) {
  return (
    <>
      <div className={className}>
        <div className="relative isolate h-[242.5px] overflow-hidden rounded-xl bg-cardLight before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-purple-50/30 before:to-transparent dark:bg-cardDark before:dark:via-purple-50/10">
          <div className="h-[162.5px] rounded-xl bg-cardLight drop-shadow-lg dark:bg-cardDark" />
          <div className="items-left flex h-[80px] flex-grow flex-col justify-between p-4">
            <div className="h-6 w-32 rounded-full bg-cardLight dark:bg-cardDark" />
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded-full bg-cardLight dark:bg-cardDark" />
              <div className="h-4 w-8 rounded-full bg-cardLight dark:bg-cardDark" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
