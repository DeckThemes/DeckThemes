import { PartialCSSThemeInfo } from "../../types";
import Link from "next/link";

// This essentially just takes in the theme data and either returns an audio card or a css card

function AudioCardImage({ imageSrc, target }: { imageSrc: string; target: string }) {
  return (
    <div className="relative rounded-xl w-[260px] h-[162.5px] drop-shadow-lg bg-clip overflow-hidden">
      <div
        className="rounded-xl bg-cover bg-center bg-no-repeat w-[260px] h-[162.5px] drop-shadow-lg absolute"
        style={{
          backgroundImage: `url(${imageSrc})`,
          filter: "blur(20px) saturate(4) brightness(50%)",
        }}
      />
      <div className="w-full h-full flex items-center justify-center rounded-xl">
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
                target === "Music"
                  ? "url(https://i.imgur.com/nISGpci.png)"
                  : "linear-gradient(150deg, rgba(0, 0, 0, 0) 0%, rgba(118, 118, 118, 0) 0%, rgba(255, 255, 255, 0.2) 32%, rgba(255, 255, 255, 0.2) 35%, rgba(255, 255, 255, 0.2) 38%, rgba(210, 210, 210, 0) 70%, rgba(0, 0, 0, 0) 100%) 0% 0% / cover",
              backgroundSize: "cover",
            }}
          />
          <div
            style={{
              backgroundImage: `url(${imageSrc})`,
            }}
            className="absolute left-0 w-3/4 h-full z-20 rounded-sm bg-cover bg-center bg-no-repeat bg-[#21323d]"
          />
          <div
            className="absolute right-[5%] w-1/5 h-full bg-right bg-cover z-10"
            style={{
              backgroundImage:
                target === "Music"
                  ? 'url("https://i.imgur.com/V9t3728.png")'
                  : 'url("https://i.imgur.com/pWm35T0.png")',
            }}
          />
        </div>
      </div>
    </div>
  );
}

function CSSCardImage({ imageSrc }: { imageSrc: string }) {
  return (
    <div
      className="rounded-xl bg-cover bg-center bg-no-repeat w-[260px] h-[162.5px] drop-shadow-lg"
      style={{
        backgroundImage: `url(${imageSrc})`,
      }}
    />
  );
}

function ThemeCardInfo({ data }: { data: PartialCSSThemeInfo }) {
  return (
    <>
      <div className="flex flex-col items-start p-4">
        <span className="font-bold truncate w-full text-start">{data.name}</span>
        <div className="flex justify-between w-full">
          <span className="flex-grow text-start truncate">{data.specifiedAuthor}</span>
          <span>{data.version}</span>
        </div>
      </div>
    </>
  );
}

export function MiniThemeCardRoot({
  data,
  submissionId = "",
}: {
  data: PartialCSSThemeInfo;
  submissionId?: string;
}) {
  function imageSRCCreator(): string {
    if (data?.images[0]?.id && data.images[0].id !== "MISSING") {
      return `${process.env.NEXT_PUBLIC_API_URL}/blobs/${data?.images[0]?.id}`;
    } else {
      return `https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Steam_Deck_logo_%28blue_background%29.svg/2048px-Steam_Deck_logo_%28blue_background%29.svg.png`;
    }
  }

  function InnerContent() {
    return (
      <div className="bg-cardLight dark:bg-cardDark rounded-xl">
        {data.type === "Audio" ? (
          <>
            <AudioCardImage imageSrc={imageSRCCreator()} target={data.target} />
          </>
        ) : (
          <CSSCardImage imageSrc={imageSRCCreator()} />
        )}
        <ThemeCardInfo data={data} />
      </div>
    );
  }

  return (
    <div className="w-[260px] ">
      {submissionId ? (
        <div>
          <InnerContent />
        </div>
      ) : (
        <div className="hover:translate-y-1 transition-all hover:bg-cardLight dark:hover:bg-cardDark rounded-xl">
          <Link href={`/${data.type === "Audio" ? "packs" : "themes"}/view?themeId=${data.id}`}>
            <InnerContent />
          </Link>
        </div>
      )}
    </div>
  );
}
