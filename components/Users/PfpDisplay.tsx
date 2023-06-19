import Image from "next/image";
import { Permissions, UserInfo } from "../../types";
import { BsPaintBucket, BsWrench } from "react-icons/bs";
// import { Tooltip } from "react-tooltip";
// import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "../Primitives";
import { SupporterIcon } from "./SupporterIcon";
import { RiPaintBrushFill, RiStarFill } from "react-icons/ri";

export function PfpDisplay({ userData }: { userData?: UserInfo }) {
  if (userData) {
    return (
      <div className="flex flex-col md:flex-row gap-8 bg-base-5-light dark:bg-base-3-dark p-8 mt-4 mb-16 rounded-2xl w-fit mx-auto shadow-2xl">
        <Image
          src={userData?.avatar || "/question_mark.png"}
          width="128"
          height="128"
          alt="Your Discord Profile Picture"
          className="flex rounded-full aspect-square"
        />
        <div className="flex flex-col justify-center gap-4">
          <div className="flex flex-row items-center gap-4">
            <h1 className="text-3xl font-extrabold">{userData?.username}</h1>
            <div className="flex flex-col sm:flex-row w-full items-center justify-center gap-2 dark:text-fore-11-dark dark:bg-base-2-dark rounded-full">
              {userData?.permissions.includes(Permissions.admin) && (
              <>
                <Tooltip
                  triggerContent={
                    <>
                      <BsWrench className="w-5 h-5 m-4" />
                    </>
                  }
                  content={<span>DeckThemes Maintainer</span>}
                />
              </>
              )}
              <SupporterIcon author={userData} />
            </div>
          </div>

          {/* <div className="text-fore-8-dark">
            <div className="flex items-center gap-3">
              <RiStarFill className="text-fore-11-dark" />
              <div>
                <span className="text-fore-11-dark">10</span> stars
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <RiPaintBrushFill className="text-fore-11-dark" />
              <div>
                <span className="text-fore-11-dark">2</span> themes
              </div>
            </div>
          </div> */}
        </div>
      </div>
    );
  }
  return null;
}
