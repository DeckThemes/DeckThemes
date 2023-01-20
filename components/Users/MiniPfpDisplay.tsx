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
      className={`flex ${
        dark ? "bg-cardLight dark:bg-cardDark" : "bg-bgLight dark:bg-bgDark"
      } rounded-full w-fit`}
      // className="flex items-center rounded-full"
    >
      <Link
        href={goToMe ? "/users/me" : `/users/view?userId=${accountInfo.id}`}
        className="flex items-center"
      >
        {!hideName && <span className="ml-4 mr-2 hidden md:flex">{accountInfo.username}</span>}
        <Image
          src={`${accountInfo.avatar || "/question_mark.png"}`}
          alt="Your Discord Profile Picture"
          width="48"
          height="48"
          className="rounded-full"
        />
      </Link>
    </div>
  );
}
