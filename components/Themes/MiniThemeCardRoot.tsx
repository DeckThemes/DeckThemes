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
  if (data.type === "Audio") {
    return <AudioMiniThemeCard data={data} submissionId={submissionId} />;
  }
  return <CSSMiniThemeCard data={data} submissionId={submissionId} />;
}
