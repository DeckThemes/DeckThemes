import { PartialCSSThemeInfo } from "../../types";
import { AudioMiniThemeCard } from "./AudioMiniThemeCard";
import { CSSMiniThemeCard } from "./CSSMiniThemeCard";

// This essentially just takes in the theme data and either returns an audio card or a css card

export function MiniThemeCardRoot({
  data,
  submissionId = "",
}: {
  data: PartialCSSThemeInfo;
  submissionId?: string;
}) {
  function imageURLCreator(): string {
    if (data?.images[0]?.id) {
      return `url(${process.env.NEXT_PUBLIC_API_URL}/blobs/${data?.images[0]?.id})`;
    } else {
      return `url(https://assets.pokemon.com/assets/cms2/img/pokedex/full/258.png)`;
    }
  }

  if (data.type === "Audio") {
    return <AudioMiniThemeCard data={data} submissionId={submissionId} />;
  }
  return <CSSMiniThemeCard data={data} submissionId={submissionId} />;
}
