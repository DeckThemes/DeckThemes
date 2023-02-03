import Link from "next/link";
import { PartialCSSThemeInfo } from "../../types";

export function AudioMiniThemeCard({
  data,
  submissionId = "",
}: {
  data: any;
  submissionId?: string;
}) {
  function imageURLCreator(): string {
    if (data?.images[0]?.id && data.images[0].id !== "MISSING") {
      return `url(${process.env.NEXT_PUBLIC_API_URL}/blobs/${data?.images[0]?.id})`;
    } else {
      return `url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Steam_Deck_logo_%28blue_background%29.svg/2048px-Steam_Deck_logo_%28blue_background%29.svg.png)`;
    }
  }

  function InnerContent() {
    return (
      <div className="bg-cardLight dark:bg-cardDark rounded-xl">
        <div
          className="rounded-xl bg-cover bg-center bg-no-repeat w-[260px] h-[162.5px] drop-shadow-lg"
          style={{
            backgroundImage: imageURLCreator(),
          }}
        >
          {/* <div className="overflow-clip rounded-xl h-[162.5px]">
            <div
              className="h-[162.5px] bg-contain bg-top bg-no-repeat bg-clip-content scale-[200%] translate-y-48"
              style={{
                backgroundImage: 'url("https://i.imgur.com/V9t3728.png")',
              }}
            />
          </div> */}
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
  if (submissionId) {
    return (
      <div className="hover:translate-y-1 transition-all sm:w-[260px] w-full">
        <div>
          <InnerContent />
        </div>
      </div>
    );
  }

  return (
    <div className="hover:translate-y-1 transition-all sm:w-[260px] w-full">
      <Link href={`/packs/view?themeId=${data.id}`}>
        <InnerContent />
      </Link>
    </div>
  );
}
