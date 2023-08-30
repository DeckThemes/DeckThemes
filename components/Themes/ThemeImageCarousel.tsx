import { useEffect, useMemo, useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import * as Progress from "@radix-ui/react-progress";
import { FullCSSThemeInfo } from "../../types";
import Image from "next/image";
import { HorizontalRadio, SquishyButton } from "@components/Primitives";

export function ThemeImageCarousel({ data }: { data: FullCSSThemeInfo }) {
  const [selectedImage, setSelected] = useState<number>(0);

  const currentImg = useMemo(() => {
    if (data?.images[selectedImage]?.id && data.images[selectedImage].id !== "MISSING") {
      return `url(${process.env.NEXT_PUBLIC_API_URL}/blobs/${data?.images[selectedImage].id})`;
    } else {
      return `url(https://share.deckthemes.com/${data?.type.toLowerCase()}placeholder.png)`;
    }
  }, [selectedImage, data]);

  function incrementImg() {
    if (selectedImage < data.images.length - 1) {
      setSelected(selectedImage + 1);
      return;
    }
    setSelected(0);
  }

  function decrementImg() {
    if (selectedImage === 0) {
      setSelected(data.images.length - 1);
      return;
    }
    setSelected(selectedImage - 1);
  }

  const [progress, setProgress] = useState<number>(0);
  const calculateProgress = () => {
    if (selectedImage === data.images.length - 1) {
      setProgress(100);
    } else {
      const percentage = (selectedImage / (data.images.length - 1)) * 100;
      setProgress(percentage);
    }
  };

  useEffect(() => {
    calculateProgress();
  }, [selectedImage]);

  return (
    <>
      <div
        className="rounded-2xl bg-cover"
        style={{
          width: "100%",
          aspectRatio:
            data?.type === "Audio"
              ? "1 / 1"
              : data?.target?.toLowerCase()?.includes("desktop")
              ? "16 / 9"
              : "16 / 10",
          position: "relative",
          maxHeight: "80vh",
        }}
      >
        <Image
          alt={`${data.name} Image ${selectedImage}`}
          fill
          src={currentImg.slice(4, -1)}
          className="z-10 rounded-2xl object-cover"
        />
        {data.images?.length > 1 && (
          <>
            <SquishyButton
              onClick={decrementImg}
              customClass="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full dark:bg-base-3-dark bg-base-3-light p-2"
            >
              <BsArrowLeft size={16} />
            </SquishyButton>
            <SquishyButton
              onClick={incrementImg}
              customClass="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full dark:bg-base-3-dark bg-base-3-light p-2"
            >
              <BsArrowRight size={16} />
            </SquishyButton>
            <Progress.Root
              className="absolute -bottom-4 z-10 flex h-1 w-full overflow-hidden rounded-full dark:bg-base-3-dark"
              value={progress}
            >
              <Progress.Indicator
                className="relative m-0 flex h-full w-full flex-1 rounded-full bg-brandBlue transition-transform"
                style={{
                  transform: `translateX(${progress * (data.images.length - 1)}%)`,
                  maxWidth: `${100 / data.images.length}%`,
                }}
              />
            </Progress.Root>
            {/*<div className="absolute bottom-2 left-1/2 z-50 flex -translate-x-1/2 gap-2 text-5xl">*/}
            {/*  <HorizontalRadio*/}
            {/*    itemClass="w-10"*/}
            {/*    value={selectedImage + ""}*/}
            {/*    onValueChange={(e) => setSelected(Number(e))}*/}
            {/*    options={data.images.map((e, i) => ({ value: i + "", displayText: "" }))}*/}
            {/*  />*/}
            {/*</div>*/}
          </>
        )}
      </div>
    </>
  );
}
