import Image from "next/image";
import Link from "next/link";
import { UserInfo } from "../../types";

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
        {!hideName && (
          <span className="ml-4 mr-2 hidden md:flex">
            {accountInfo.username}
          </span>
        )}
        <Image
          src={`${accountInfo.avatar || "/question_mark.png"}`}
          alt="Your Discord Profile Picture"
          width="36"
          height="36"
          className="min-w-9 min-h-9 flex flex-shrink-0 rounded-full"
        />
      </Link>
    </div>
  );
}
