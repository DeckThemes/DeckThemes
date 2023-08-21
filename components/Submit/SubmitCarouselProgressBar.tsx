import * as Progress from "@radix-ui/react-progress";

export function SubmitCarouselProgressBar({ progress }: { progress: number }) {
  return (
    <Progress.Root
      className="absolute top-0 h-2 w-full overflow-hidden rounded-full dark:bg-base-3-dark"
      value={progress}
    >
      <Progress.Indicator
        className="duration-660ms h-full w-full rounded-full bg-brandBlue transition-transform"
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </Progress.Root>
  );
}
