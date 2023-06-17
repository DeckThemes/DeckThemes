import { LoadingSpinner } from "../../Generic";

// Big thank to https://delba.dev/blog/animated-loading-skeletons-with-tailwind for the guide on skeleton gradients
export function LoadingSkeletonCard() {
  return (
    <>
      <div className="isolate overflow-hidden w-[260px] h-[242.5px] bg-cardLight dark:bg-cardDark rounded-xl relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-purple-50/30 before:dark:via-purple-50/10 before:to-transparent">
        <div className="bg-cardLight dark:bg-cardDark rounded-xl w-[260px] h-[162.5px] drop-shadow-lg" />
        <div className="flex flex-col items-left justify-between p-4 flex-grow h-[80px]">
          <div className="w-32 h-6 rounded-full bg-cardLight dark:bg-cardDark" />
          <div className="flex justify-between items-center">
            <div className="w-24 h-4 rounded-full bg-cardLight dark:bg-cardDark" />
            <div className="w-8 h-4 rounded-full bg-cardLight dark:bg-cardDark" />
          </div>
        </div>
      </div>
    </>
  );
}
