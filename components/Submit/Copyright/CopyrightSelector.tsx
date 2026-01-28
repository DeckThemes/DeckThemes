import { Dispatch, SetStateAction } from "react";

export function CopyrightSelector({
  setCopyrightRead,
}: {
  setCopyrightRead: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex max-w-4xl flex-col items-center gap-2 rounded-lg border-2 border-amber-500 bg-amber-950 p-4">
        <div className="text-2xl font-bold text-amber-400">Sound Packs Only</div>
        <div className="text-center text-lg text-amber-200">
          Due to copyright concerns, DeckThemes only accepts sound effect packs. Music packs are not
          accepted.
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-[#334155] bg-[#1e293b] p-4 transition-colors hover:border-[#475569]">
        <input
          type="checkbox"
          className="h-5 w-5 cursor-pointer accent-emerald-500"
          onChange={(e) => setCopyrightRead(e.target.checked)}
        />
        <span className="text-lg text-white">
          I confirm this pack contains sound effects only, not music.
        </span>
      </label>
    </div>
  );
}
