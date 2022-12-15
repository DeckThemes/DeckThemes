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
    <>
      {data.images?.length > 0 ? (
        <div
          className="bg-cover"
          style={{
            width: "100%",
            aspectRatio: "1.72 / 1",
            position: "relative",
            borderRadius: "1em",
            backgroundSize: "cover !important",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            // DONT make this just 'background', because it overwrites all of the above
            backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}/blobs/${data.images[selectedImage].id})`,
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
                    <>
                      <button
                        onClick={() => setSelected(i)}
                        className={`w-3 h-2 lg:w-6 lg:h-3 rounded-full border-b-2 border-r-2 border-[#0005] ${
                          selectedImage === i ? "bg-[#ffff]" : "bg-[#fffa]"
                        } `}
                      />
                    </>
                  );
                })}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full text-center">
          <span className="text-3xl lg:text-5xl">No Images Provided</span>
        </div>
      )}
    </>

    // </div>
  );
}
