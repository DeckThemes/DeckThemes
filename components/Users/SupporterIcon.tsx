import { RiMedalFill } from "react-icons/ri";
import { Tooltip } from "react-tooltip";
import { UserInfo } from "../../types";

export function SupporterIcon({ author }: { author: UserInfo }) {
  return (
    <>
      {author?.premiumTier !== "None" && (
        <>
          <svg width="0" height="0">
            <linearGradient id="medal-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop
                stopColor={
                  author?.premiumTier == "Tier3"
                    ? "#de2cf7"
                    : author?.premiumTier == "Tier2"
                    ? "#FCC200"
                    : "#B4B4B4"
                }
                offset="0%"
              />
              <stop
                stopColor={
                  author?.premiumTier == "Tier3"
                    ? "rgb(26,159,255)"
                    : author?.premiumTier == "Tier2"
                    ? "#FCC200"
                    : "#B4B4B4"
                }
                offset="100%"
              />
            </linearGradient>
          </svg>
          <RiMedalFill id="supporter-tt" style={{ fill: "url(#medal-gradient)" }} />
          <Tooltip
            anchorSelect="#supporter-tt"
            content={`Tier ${author?.premiumTier?.slice(-1)} Patreon Supporter`}
            place="bottom"
          />
        </>
      )}
    </>
  );
}
