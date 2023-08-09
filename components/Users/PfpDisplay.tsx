import Image from "next/image";
import { Permissions, UserInfo } from "../../types";
import { BsPaintBucket, BsWrench } from "react-icons/bs";
// import { Tooltip } from "react-tooltip";
// import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "../Primitives";
import { SupporterIcon } from "./SupporterIcon";
import { RiPaintBrushFill, RiStarFill } from "react-icons/ri";
import { useEffect, useState } from "react";

export function PfpDisplay({ userData }: { userData?: UserInfo }) {
  const [imgSrc, setImgSrc] = useState(userData?.avatar || "/question_mark.png");
  useEffect(() => {
    setImgSrc(userData?.avatar || "/question_mark.png");
  }, [userData]);
  if (userData) {
    return (
      <div className="mx-auto mt-4 mb-16 flex w-fit flex-col items-center gap-8 rounded-2xl bg-base-5-light p-8 shadow-2xl dark:bg-base-3-dark md:flex-row">
        <Image
          src={imgSrc}
          width="128"
          height="128"
          onError={() => {
            setImgSrc("/question_mark.png");
          }}
          alt="Your Discord Profile Picture"
          className="flex aspect-square items-center justify-center rounded-full"
        />
        <div className="flex flex-col justify-center gap-4">
          <div className="flex flex-row items-center gap-4">
            <h1 className="text-3xl font-extrabold">{userData?.username}</h1>
            <div className="flex w-full flex-col items-center justify-center gap-2 rounded-full dark:bg-base-2-dark dark:text-fore-11-dark sm:flex-row">
              {userData?.permissions.includes(Permissions.admin) && (
                <>
                  <Tooltip
                    triggerContent={
                      <>
                        <BsWrench className="m-4 h-5 w-5" />
                      </>
                    }
                    content={<span>DeckThemes Maintainer</span>}
                  />
                </>
              )}
              <SupporterIcon author={userData} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
