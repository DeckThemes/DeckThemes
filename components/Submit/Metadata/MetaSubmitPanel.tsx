import { Dispatch, SetStateAction, useEffect, useState } from "react";
// @ts-ignore
import { LabelledTextArea, RadioDropdown } from "@components/Primitives";
import { MetaInfo } from "@customTypes/ThemeSubmissionTypes";
import { genericGET } from "../../../apiHelpers";
import { metaFieldContainerClasses, sectionContainerClasses } from "../SubmitPageTailwindClasses";
import { ImageSubmissionPanel } from "./ImageSubmissionPanel";

// Use this to hide targets that aren't meant for user choice
const disallowedOverrideTargets = ["Preset", "Profile"];

export function MetaSubmitPanel({
  info,
  setInfo,
  uploadType,
  uploadMethod,
}: {
  info: MetaInfo;
  setInfo: Dispatch<SetStateAction<MetaInfo>>;
  uploadType?: "css" | "audio";
  uploadMethod?: string;
}) {
  const [targetOptions, setTargetOptions] = useState<string[]>(["None", "System-Wide", "Snippet"]);
  async function getTargets() {
    const data = await genericGET(`/themes/filters?type=CSS`);
    if (data?.filters) {
      setTargetOptions([
        "None",
        ...Object.keys(data.filters).filter((e) => !disallowedOverrideTargets.includes(e)),
      ]);
    }
  }
  useEffect(() => {
    // This ensures that you cant submit a theme/pack with a target designed for another theme/pack type.
    if (uploadMethod === "css" && info.target === "None") {
      setInfo({ ...info, target: "Snippet" });
    }
  }, [uploadMethod]);

  useEffect(() => {
    getTargets();

    // This ensures that you cant submit a theme/pack with a target designed for another theme/pack type.
    if (uploadType === "css" && (info.target === "Music" || info.target === "Audio")) {
      setInfo({ ...info, target: "None" });
    }
    if (
      uploadType === "audio" &&
      (info.target !== "None" ||
        // @ts-ignore
        info.target !== "Music" ||
        info.target !== "Audio")
    ) {
      setInfo({ ...info, target: "None" });
    }
  }, [uploadType]);

  return (
    <>
      <div className={`${sectionContainerClasses}`}>
        {uploadType !== "audio" && (
          <>
            <div className={`${metaFieldContainerClasses} w-full`}>
              <RadioDropdown
                ariaLabel="Theme Target Dropdown"
                headingText="Theme Target"
                value={info.target}
                onValueChange={(value) => {
                  setInfo({ ...info, target: value });
                }}
                options={targetOptions.sort().map((e) => ({
                  value: e,
                  displayText: e !== "None" ? e : "Use JSON Value",
                  disabled: e === "None" && uploadMethod === "css",
                }))}
              />
            </div>
          </>
        )}
        <ImageSubmissionPanel setInfo={setInfo} />
        <LabelledTextArea
          label="Description"
          rootClass="w-full md:w-1/2"
          value={info.description}
          onValueChange={(e) => setInfo({ ...info, description: e })}
        />
      </div>
    </>
  );
}
