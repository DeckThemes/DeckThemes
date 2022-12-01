import Image from "next/image";

export function PfpDisplay({
  username,
  avatar,
  id,
}: {
  username: string;
  avatar: string;
  id?: string;
}) {
  return (
    <div className="flex flex-col md:flex-row-reverse gap-2 items-center text-center md:bg-cardLight md:dark:bg-cardDark rounded-full md:pl-8 md:gap-6 mt-10">
      <Image
        src={avatar}
        width="142"
        height="142"
        alt="Your Discord Profile Picture"
        className="rounded-full border-8 border-borderLight dark:border-borderDark"
      />
      {/* Uncomment if you want the #0000 to be below the username */}
      {/* {id?.slice(0, 7) === "Discord" ? (
        <h1 className="text-3xl font-semibold">
          {username.slice(0, username.lastIndexOf("#"))}
          {username.slice(username.lastIndexOf("#"))}
        </h1>
      ) : ( */}
      <h1 className="text-3xl font-semibold">{username}</h1>
      {/* )} */}
    </div>
  );
}
