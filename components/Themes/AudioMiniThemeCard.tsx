import Image from "next/image";
import { useState } from "react";

// @ts-ignore
import { ColorExtractor } from "react-color-extractor";

export function AudioMiniThemeCard({ data }: { data: any }) {
  const [albumColor, setAlbumColor] = useState<string>("");

  function imageSRCCreator(): string {
    if (data?.images[0]?.id && data.images[0].id !== "MISSING") {
      return `${process.env.NEXT_PUBLIC_API_URL}/blobs/${data?.images[0]?.id}`;
    } else {
      return `https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Steam_Deck_logo_%28blue_background%29.svg/2048px-Steam_Deck_logo_%28blue_background%29.svg.png`;
    }
  }

  return (
    <div className="bg-cardLight dark:bg-cardDark rounded-xl">
      <div
        className="rounded-xl bg-cover bg-center bg-no-repeat w-[260px] h-[162.5px] drop-shadow-lg flex items-center justify-center"
        style={{
          backgroundColor: albumColor || "#1e1e1e",
        }}
      >
        <div
          // I'm still using the format of div-with-a-bg-image, because I think that could make it a bit easier to add icons/text in front if we want
          className="AudioLoader_PackBrowser_SingleItem_PreviewImageContainer"
          style={{
            width: "180px",
            height: "135px",
            position: "relative",
          }}
        >
          <div
            className="absolute left-0 w-3/4 h-full bg-cover z-30 rounded-sm"
            style={{
              background:
                data.target === "Music"
                  ? "url(https://i.imgur.com/nISGpci.png)"
                  : "linear-gradient(150deg, rgba(0, 0, 0, 0) 0%, rgba(118, 118, 118, 0) 0%, rgba(255, 255, 255, 0.2) 32%, rgba(255, 255, 255, 0.2) 35%, rgba(255, 255, 255, 0.2) 38%, rgba(210, 210, 210, 0) 70%, rgba(0, 0, 0, 0) 100%) 0% 0% / cover",
              backgroundSize: "cover",
            }}
          />
          <ColorExtractor
            getColors={(colors: string[]) => {
              console.log("colors", colors);
              setAlbumColor(colors[0]);
            }}
            src={imageSRCCreator()}
          />
          <div
            style={{
              backgroundImage: `url(${imageSRCCreator()})`,
            }}
            className="absolute left-0 w-3/4 h-full z-20 rounded-sm bg-cover bg-[#21323d]"
          >
            <Image src={imageSRCCreator()} fill alt="" className="object-contain" />
          </div>
          <div
            className="absolute right-[5%] w-1/5 h-full bg-right bg-cover z-10"
            style={{
              backgroundImage:
                data.target === "Music"
                  ? 'url("https://i.imgur.com/V9t3728.png")'
                  : 'url("https://i.imgur.com/pWm35T0.png")',
            }}
          />
        </div>
      </div>
      <div className="flex flex-col items-start p-4">
        <span className="font-bold">{data.name}</span>
        <div className="flex justify-between w-full">
          <span>{data.specifiedAuthor}</span>
          <span>{data.version}</span>
        </div>
      </div>
    </div>
  );
}
