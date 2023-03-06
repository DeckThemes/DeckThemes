import Image from "next/image";
import { Permissions, UserInfo } from "../../types";
import { BsWrench } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { RiMedalFill } from "react-icons/ri";

export function PfpDisplay({ userData }: { userData?: UserInfo }) {
  return (
    <div className="flex flex-col md:flex-row-reverse gap-2 items-center text-center md:bg-cardLight md:dark:bg-cardDark rounded-full md:pl-8 md:gap-6 mt-10">
      <Image
        src={userData?.avatar || "/question_mark.png"}
        width="142"
        height="142"
        alt="Your Discord Profile Picture"
        className="rounded-full border-8 border-borderLight dark:border-borderDark"
      />
      <div className="flex flex-col w-full items-center justify-center">
        <h1 className="text-3xl font-semibold">{userData?.username}</h1>
        <div className="flex flex-row w-full text-3xl items-center justify-center">
          {userData?.permissions.includes(Permissions.admin) && (
            <>
              <BsWrench id="maintainer-tt" />
              <Tooltip
                anchorSelect="#maintainer-tt"
                content="DeckThemes Maintainer"
                place="bottom"
              />
            </>
          )}
          {userData?.premiumTier !== "None" && (
            <>
              <RiMedalFill
                id="supporter-tt"
                color={
                  userData?.premiumTier == "Tier3"
                    ? "#FCC200"
                    : userData?.premiumTier == "Tier2"
                    ? "#B4B4B4"
                    : "#805D39"
                }
              />
              <Tooltip
                anchorSelect="#supporter-tt"
                content={`Tier ${userData?.premiumTier?.slice(-1)} Patreon Supporter`}
                place="bottom"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
