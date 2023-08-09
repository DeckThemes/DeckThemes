import Image from "next/image";
import Link from "next/link";
import { UserInfo } from "../../types";
import { useEffect, useState } from "react";

export function MiniPfpDisplay({
  accountInfo,
  goToMe = false,
  dark = false,
  hideName = false,
}: {
  accountInfo: UserInfo;
  goToMe?: boolean;
  dark?: boolean;
  hideName?: boolean;
}) {
  const [imgSrc, setImgSrc] = useState(accountInfo?.avatar || "/question_mark.png");
  useEffect(() => {
    setImgSrc(accountInfo?.avatar || "/question_mark.png");
  }, [accountInfo]);
  return (
    <div
      className={`flex flex-shrink-0 ${
        dark ? "bg-cardLight dark:bg-cardDark" : "bg-bgLight dark:bg-bgDark"
      } w-fit rounded-full`}
      // className="flex items-center rounded-full"
    >
      <Link
        href={goToMe ? "/users/me" : `/users/view?userId=${accountInfo.id}`}
        className="flex flex-shrink-0 items-center"
      >
        {!hideName && <span className="ml-4 mr-2 hidden md:flex">{accountInfo.username}</span>}
        <Image
          src={imgSrc}
          alt="Your Discord Profile Picture"
          width="36"
          height="36"
          onError={() => setImgSrc("/question_mark.png")}
          className="min-w-9 min-h-9 flex flex-shrink-0 items-center justify-center rounded-full text-sm"
        />
      </Link>
    </div>
  );
}
