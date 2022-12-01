import Image from "next/image";
import { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { FullCSSThemeInfo } from "../../types";

export function ThemeImageCarousel({ data }: { data: FullCSSThemeInfo }) {
  const [selectedImage, setSelected] = useState<number>(0);
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
    <div className="flex relative w-[320px] h-[180px] md:w-[640px] md:h-[360px] border-8 border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark">
      <button className="absolute left-0 top-1/2 -translate-y-1/2 z-50" onClick={decrementImg}>
        <BsArrowLeft size={48} />
      </button>
      <button className="absolute right-0 top-1/2 -translate-y-1/2 z-50" onClick={incrementImg}>
        <BsArrowRight size={48} />
      </button>
      <div className="w-full relative" key={`Theme Image ${selectedImage}`}>
        <Image
          src={`${process.env.API_URL}/blobs/${data.images[selectedImage].id}`}
          fill
          alt={`Theme Image ${selectedImage}`}
          objectFit="contain"
        />
      </div>
      <div className="flex gap-2 absolute bottom-2 left-1/2 -translate-x-1/2 text-5xl">
        {data.images.map((_, i) => {
          return (
            <>
              <button
                onClick={() => setSelected(i)}
                className={`w-3 h-2 md:w-6 md:h-3 rounded-full border-b-2 border-r-2 border-[#0005] ${
                  selectedImage === i ? "bg-[#ffff]" : "bg-[#fffa]"
                } `}
              />
            </>
          );
        })}
      </div>
    </div>
  );
}
