import { RiMedalFill } from "react-icons/ri";
import { Tooltip } from "react-tooltip";
import { UserInfo } from "../../types";

export function SupporterIcon({ author }: { author: UserInfo }) {
  return (
    <>
      {author?.premiumTier !== "None" && (
        <>
          <RiMedalFill
            id="supporter-tt"
            color={
              author?.premiumTier == "Tier3"
                ? "#FCC200"
                : author?.premiumTier == "Tier2"
                ? "#B4B4B4"
                : "#805D39"
            }
          />
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
