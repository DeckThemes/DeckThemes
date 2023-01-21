import Image from "next/image";
import { useMemo, useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { FullCSSThemeInfo } from "../../types";

export function ThemeImageCarousel({ data }: { data: FullCSSThemeInfo }) {
  const [selectedImage, setSelected] = useState<number>(0);

  const currentImg = useMemo(() => {
    if (data?.images[selectedImage]?.id && data.images[selectedImage].id !== "MISSING") {
      return `url(${process.env.NEXT_PUBLIC_API_URL}/blobs/${data?.images[selectedImage].id})`;
    } else {
      return `url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Steam_Deck_logo_%28blue_background%29.svg/2048px-Steam_Deck_logo_%28blue_background%29.svg.png)`;
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
        className="bg-cover"
        style={{
          width: "100%",
          aspectRatio: data?.type === "Audio" ? "1 / 1" : "16 / 10",
          position: "relative",
          borderRadius: "1em",
          backgroundSize: "cover !important",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          // DONT make this just 'background', because it overwrites all of the above
          backgroundImage: currentImg,
          maxHeight: "80vh",
        }}
      >
        {data.images?.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50"
              onClick={decrementImg}
            >
              <BsArrowLeft size={48} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50"
              onClick={incrementImg}
            >
              <BsArrowRight size={48} />
            </button>
            <div className="flex gap-2 absolute bottom-2 left-1/2 -translate-x-1/2 text-5xl">
              {data.images.map((_, i) => {
                return (
                  <button
                    key={`Theme Image Carousel Button ${i}`}
                    onClick={() => setSelected(i)}
                    className={`w-3 h-2 lg:w-6 lg:h-3 rounded-full border-b-2 border-r-2 border-[#0005] ${
                      selectedImage === i ? "bg-[#ffff]" : "bg-[#fffa]"
                    } `}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
