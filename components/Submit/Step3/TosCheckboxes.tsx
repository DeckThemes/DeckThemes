import { Dispatch, SetStateAction } from "react";
import { codeBlockClasses } from "../SubmitPageTailwindClasses";

export function TosCheckboxes({
  setCheckValue,
  checkValue,
  uploadType,
}: {
  setCheckValue: Dispatch<SetStateAction<boolean>>;
  checkValue: boolean;
  uploadType: "audio" | "css";
}) {
  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <ul className="flex list-disc flex-col items-start gap-2 text-sm">
          {uploadType === "audio" ? (
            <>
              <li>
                I am the original author of this pack or have permission from the original author to
                make this submission.
              </li>
              <li>
                All copyright of this pack&apos;s contents belong to the listed author or is clearly
                attributed.
              </li>
              <li>
                This packs works properly on the latest beta and stable versions of SteamOS,
                decky-loader and AudioLoader.
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
              <li>
                I am the original author of this theme or have permission from the original author
                to make this submission.
              </li>
              <li>
                All copyright of this theme&apos;s contents belong to the listed author or is
                clearly attributed.
              </li>
              <li>
                This theme&apos;s target has been marked appropriately and only styles said target.
              </li>
              <li>
                This theme works properly on the latest beta and stable versions of SteamOS,
                decky-loader and CSSLoader.
              </li>
              <li>
                This theme only uses <code className={codeBlockClasses}>*</code> or{" "}
                <code className={codeBlockClasses}>!important</code> if absolutely necessary.
              </li>
              <li>This theme is under 10MB in size and uses the least disk space possible.</li>
              <li>
                This theme&apos;s preview image does not include text unless it is necessary to
                describe changes that can be made.
              </li>
              <li>
                This theme is safe for work and does not contain any sexual, drug-related, or
                profane content.
              </li>
              <li>This theme prefixes any CSS variables with a unique identifier.</li>
              <li>
                This theme does not bundle any other themes with it, and uses dependencies where
                necessary.
              </li>
              <li>If this theme targets the keyboard, it applies to the default keyboard.</li>
              <li>
                If this is a system-wide theme that also targets the keyboard, the keyboard theming
                is toggleable
              </li>
            </>
          )}
        </ul>
        <div className="flex items-center gap-4 text-xl">
          <span>By checking this box you agree to the above terms: </span>
          <input
            type="checkbox"
            checked={checkValue}
            onChange={(e) => setCheckValue(e.target.checked)}
            className="h-5 w-5 rounded-3xl ring-offset-2 ring-offset-cardLight hover:ring-2 dark:ring-offset-cardDark"
          />
        </div>
      </div>
    </>
  );
}
