export type TypeOptionPreset = "Desktop+BPM" | "BPM+Audio" | "All" | "None";

export type TypeOptions =
  | {
      displayText: string;
      value: string;
    }[]
  | undefined;

export const typePresetDesktopBPM: TypeOptions = [
  { value: "CSS", displayText: "All Themes" },
  { value: "DESKTOP-CSS", displayText: "Desktop Themes" },
  { value: "BPM-CSS", displayText: "BPM Themes" },
];

export const typePresetBPMAudio: TypeOptions = [
  { value: "", displayText: "BPM & Audio" },
  { value: "BPM-CSS", displayText: "BPM Themes" },
  { value: "AUDIO", displayText: "Audio" },
];

export const typePresetAll: TypeOptions = [
  { value: "", displayText: "Themes & Audio" },
  { value: "DESKTOP-CSS", displayText: "Desktop Themes" },
  { value: "BPM-CSS", displayText: "BPM Themes" },
  { value: "AUDIO", displayText: "Audio" },
];

export const typePresets = {
  "Desktop+BPM": typePresetDesktopBPM,
  "BPM+Audio": typePresetBPMAudio,
  All: typePresetAll,
  None: undefined,
};
