import { useMemo, useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { FullCSSThemeInfo } from "../../types";
import Image from "next/image";
import { HorizontalRadio } from "@components/Primitives";

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
            <button
              className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-xl border-2 border-borders-base1-light bg-base-3-light p-2 transition-all hover:border-borders-base2-light dark:border-borders-base1-dark dark:bg-base-3-dark hover:dark:border-borders-base2-dark"
              onClick={decrementImg}
            >
              <BsArrowLeft size={48} />
            </button>
            <button
              className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-xl border-2 border-borders-base1-light bg-base-3-light p-2 transition-all hover:border-borders-base2-light dark:border-borders-base1-dark dark:bg-base-3-dark hover:dark:border-borders-base2-dark"
              onClick={incrementImg}
            >
              <BsArrowRight size={48} />
            </button>
            <div className="absolute bottom-2 left-1/2 z-50 flex -translate-x-1/2 gap-2 text-5xl">
              <HorizontalRadio
                itemClass="w-10"
                value={selectedImage + ""}
                onValueChange={(e) => setSelected(Number(e))}
                options={data.images.map((e, i) => ({ value: i + "", displayText: "" }))}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
