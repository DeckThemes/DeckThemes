import { PartialCSSThemeInfo } from "../../types";
import { AudioMiniThemeCard } from "./AudioMiniThemeCard";
import { CSSMiniThemeCard } from "./CSSMiniThemeCard";
import Link from "next/link";

// This essentially just takes in the theme data and either returns an audio card or a css card

export function MiniThemeCardRoot({
  data,
  submissionId = "",
}: {
  data: PartialCSSThemeInfo;
  submissionId?: string;
}) {
  function InnerContent() {
    if (data.type === "Audio") return <AudioMiniThemeCard data={data} />;
    return <CSSMiniThemeCard data={data} />;
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
