import { Dispatch, SetStateAction, useState } from "react";
import { codeBlockClasses } from "../SubmitPageTailwindClasses";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

export function TosCheckboxes({
  setCheckValue,
  checkValue,
  uploadType,
}: {
  setCheckValue: Dispatch<SetStateAction<boolean>>;
  checkValue: boolean;
  uploadType: "audio" | "css";
}) {
  // create a countdown timer that counts down from 30 seconds
  // if the timer runs out, set a state called "expired" to true
  const [expired, setExpired] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        {/* max width of 800px */}
        <ul className="flex max-w-4xl list-disc flex-col items-start gap-2 text-sm">
          {uploadType === "audio" ? (
            <>
              <span className="font-fancy w-full text-xl md:ml-[-1rem] md:text-2xl">Ownership</span>
              <li>
                I am the original author of this pack or have permission from the original author to
                make this submission.
              </li>
              <li>
                All copyright of this pack&apos;s contents belong to the listed author or is clearly
                attributed.
              </li>
              <span className="font-fancy w-full text-xl md:ml-[-1rem] md:mt-[.5rem] md:text-2xl">
                Compatibility
              </span>
              <li>
                This packs works properly on the latest beta and stable versions of SteamOS, Decky
                Loader and Audio Loader.
              </li>
              <span className="font-fancy w-full text-xl md:ml-[-1rem] md:mt-[.5rem] md:text-2xl">
                Content
              </span>
              <li>
                If this pack contains music, it is either music from an operating system or console
                which is not part of an application like a store, a licensed song with a link to the
                license in the description, or original music with a notice in the description.
              </li>
              <li>This theme is under 10MB in size and uses the least disk space possible.</li>
              <li>
                This pack is safe for work and does not contain any sexual, drug-related, or profane
                content.
              </li>
              <li>
                This pack does not contain loud, distorted, or otherwise bad-faith sound files.
              </li>
              <li>
                This pack is only either music or sound and only modifies the intended sound files.
              </li>
            </>
          ) : (
            <>
              <span className="font-fancy w-full text-xl md:ml-[-1rem] md:text-2xl ">
                Ownership
              </span>
              <li>
                I am the original author of this theme or have permission from the original author
                to make this submission.
              </li>
              <li>
                All copyright of this theme&apos;s contents belong to the listed author or is
                clearly attributed.
              </li>
              <span className="font-fancy w-full text-xl md:ml-[-1rem] md:mt-[.5rem] md:text-2xl">
                Compatibility
              </span>
              <li>
                This theme works properly on the latest beta and stable versions of SteamOS, Decky
                Loader and CSS Loader.
              </li>
              <li>
                This theme only uses <code className={codeBlockClasses}>*</code> or{" "}
                <code className={codeBlockClasses}>!important</code> if absolutely necessary.
              </li>
              <li>
                This theme&apos;s preview image does not include text unless it is necessary to
                describe changes that can be made.
              </li>
              <li>This theme prefixes any CSS variables with a unique identifier.</li>
              <li>
                This theme does not bundle any other themes with it, and uses dependencies where
                necessary.
              </li>
              <span className="font-fancy w-full text-xl md:ml-[-1rem] md:mt-[.5rem] md:text-2xl">
                Target
              </span>
              <li>
                This theme&apos;s target has been marked appropriately and only styles said target.
              </li>
              <li>If this theme targets the keyboard, it applies to the default keyboard.</li>
              <li>
                If this is a system-wide theme that also targets the keyboard, the keyboard theming
                is toggleable.
              </li>
              <span className="font-fancy w-full text-xl md:ml-[-1rem] md:mt-[.5rem] md:text-2xl">
                Other
              </span>
              <li>
                This theme is safe for work and does not contain any sexual, drug-related, or
                profane content.
              </li>
              <li>This theme is under 10MB in size and uses the least disk space possible.</li>
            </>
          )}
        </ul>
        <div className="flex items-center gap-4 text-xl md:mt-[1rem]">
          <span>By checking this box you agree to the above terms. </span>
          {!expired ? (
            <CountdownCircleTimer
              // only play if parent of the parent has class "visible"
              isPlaying={document.querySelector(".disable-timer") === null}
              duration={10}
              onComplete={() => setExpired(true)}
              size={40}
              strokeWidth={4}
              colors={"#2563eb"}
            >
              {({ remainingTime }) => remainingTime}
            </CountdownCircleTimer>
          ) : (
            <input
              type="checkbox"
              disabled={!expired}
              checked={checkValue}
              onChange={(e) => setCheckValue(e.target.checked)}
              className="h-5 w-5 rounded-3xl ring-offset-2 ring-offset-cardLight hover:ring-2 dark:ring-offset-cardDark"
            />
          )}
        </div>
        <div className="flex max-w-md items-center gap-4 text-center text-xs">
          Repeat violations of our terms of service and submission terms may result in your account
          being suspended.
        </div>
      </div>
    </>
  );
}
