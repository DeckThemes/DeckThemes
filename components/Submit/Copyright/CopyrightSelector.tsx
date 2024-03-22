import { Dispatch, SetStateAction, useState } from "react";
import { codeBlockClasses } from "../SubmitPageTailwindClasses";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

export function CopyrightSelector({
  setCopyrightRead,
}: {
  setCopyrightRead: Dispatch<SetStateAction<boolean>>;
}) {
  const copyrightWarnings = [
    "Music ripped from websites and media soundtracks are generally prohibited on DeckThemes. However, if you can find a source that the composer and rightsholder allow fans to use their music in projects, you can submit your pack. Choose the option that another person composed the music ONLY if you have permission. Packs with music from companies who are very protective of their copyright will be denied and your account will be suspended.",
    "Be sure to list a source in the pack description. For example, credit the original material (like a video game) and composer if possible. Be sure to include a license if necessary and state how you got permission to publish the pack. Packs without a source and permission will be denied.",
  ];
  const [currentWarning, setCurrentWarning] = useState(-1);

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        {/* max width of 800px */}
        <div className="flex items-center gap-4 text-xl">
          <span>Select the type of music that best fits what you are uploading below.</span>
        </div>
        <ul className="flex max-w-4xl list-disc flex-col items-start gap-2 text-xl text-[#e0f2fe]">
          <>
            <button
              className="hover:text-white"
              onClick={() => {
                setCurrentWarning(0);
                setCopyrightRead(false);
              }}
            >
              This music was ripped from a media soundtrack, like a movie or video game.
            </button>
            <button
              className="hover:text-white"
              onClick={() => {
                setCurrentWarning(0);
                setCopyrightRead(false);
              }}
            >
              This music was downloaded from a media website, like YouTube or SoundCloud.
            </button>
            <button
              className="hover:text-white"
              onClick={() => {
                setCurrentWarning(1);
                setCopyrightRead(true);
              }}
            >
              I composed this music and am the rightsholder.
            </button>
            <button
              className="hover:text-white"
              onClick={() => {
                setCurrentWarning(1);
                setCopyrightRead(true);
              }}
            >
              This music was composed by or is owned by someone else. I have permission to use it.
            </button>
          </>
        </ul>

        {currentWarning >= 0 && currentWarning < copyrightWarnings.length - 1 && (
          <>
            <div className="flex items-center gap-4 text-2xl font-bold text-[#f87171]">
              <span>Read these instructions carefully.</span>
            </div>
            <div className="flex max-w-6xl items-center gap-4 text-center text-xl text-[#fee2e2] md:mt-[-1rem]">
              <span>{copyrightWarnings[currentWarning]}</span>
            </div>
          </>
        )}
        {currentWarning === copyrightWarnings.length - 1 && (
          <>
            <div className="flex items-center gap-4 text-2xl font-bold text-[#34d399]">
              <span>Read these instructions carefully.</span>
            </div>
            <div className="flex max-w-6xl items-center gap-4 text-center text-xl text-[#ecfdf5] md:mt-[-1rem]">
              <span>{copyrightWarnings[currentWarning]}</span>
            </div>
          </>
        )}
        <div className="flex max-w-md items-center gap-4 text-center text-xs">
          Answering falsely on this form will result in your account immediately being suspended.
          Please respect the rights of artists!
        </div>
      </div>
    </>
  );
}
