import { useTheme } from "next-themes";
import { AddEmailForm } from "..";
import Image from "next/image";

export function AddContactPage() {
  const { resolvedTheme } = useTheme();
  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-4">
        <span>
          In order to follow up on any potential issues, reviewers need to be able to contact you.
          We offer two methods of contact: Joining the Deckthemes discord or adding a contact Email.
        </span>
        <span>
          If you do not join the discord or link an email, we will deny your submission if we find
          issues.
        </span>
      </div>
      <div className="-mx-4 flex flex-col items-start justify-center gap-4 rounded-3xl">
        <div className="flex flex-col items-start justify-between gap-4 p-4">
          <div className="flex flex-col gap-2">
            <span className="font-fancy text-xl font-semibold">Discord</span>
            <span className="font-fancy text-sm font-medium text-textFadedLight dark:text-textFadedDark">
              Have In-Server Discussions
            </span>
          </div>

          <a
            href="https://deckthemes.com/discord"
            rel="noreferrer"
            target="_blank"
            className="flex h-fit w-fit select-none items-center gap-2 rounded-full border border-borders-base3-dark py-2 px-4 text-textLight transition duration-150 hover:scale-95 hover:bg-base-3-dark hover:text-bgDark hover:active:scale-90 dark:text-textDark dark:hover:text-bgLight"
          >
            <Image
              alt="Discord Logo"
              height="16"
              width="16"
              src={`https://cdn.simpleicons.org/discord/${
                resolvedTheme === "light" ? "black" : "white"
              }`}
            />
            <div className="font-fancy text-xs font-bold">Join Discord</div>
          </a>
        </div>
        <AddEmailForm />
      </div>
    </div>
  );
}
