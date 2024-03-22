import { RadioDropdown } from "@components/Primitives";
import { ZipSubmitPanel } from "./ZipSubmitPanel";
import { GitSubmitPanel } from "./GitSubmitPanel";
import { CSSSubmitPanel } from "./CssSubmitPanel";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  CSSSubmissionInfo,
  GitSubmissionInfo,
  ZipSubmissionInfo,
} from "@customTypes/ThemeSubmissionTypes";

const uploadTemplates = {
  git: {
    url: "",
    commit: "",
    subfolder: "",
  },
  css: {
    css: "",
    name: "",
  },
  zip: {
    blob: "",
  },
};

export function Step1({
  uploadType,
  uploadMethod,
  setUploadType,
  setUploadMethod,
  uploadInfo,
  setUploadInfo,
}: {
  uploadType: "css" | "audio";
  uploadMethod: "git" | "css" | "zip";
  setUploadType: Dispatch<SetStateAction<"css" | "audio">>;
  setUploadMethod: Dispatch<SetStateAction<"git" | "css" | "zip">>;
  uploadInfo: GitSubmissionInfo | CSSSubmissionInfo | ZipSubmissionInfo;
  setUploadInfo: any;
}) {
  useEffect(() => {
    setUploadInfo(uploadTemplates[uploadMethod]);
  }, [uploadMethod]);
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="mb-4 flex w-full flex-col gap-4 md:w-1/2 md:flex-row">
          <RadioDropdown
            ariaLabel="Upload Method Dropdown"
            headingText="Upload Method"
            value={uploadMethod}
            onValueChange={(value) => {
              setUploadMethod(value as "git" | "css" | "zip");
              if (value === "css") {
                setUploadType("css");
              }
            }}
            options={[
              { value: "git", displayText: "Link Git Repo" },
              { value: "zip", displayText: "Upload Zip" },
              { value: "css", displayText: "Paste CSS Snippet" },
            ]}
          />
          <RadioDropdown
            ariaLabel="Target Plugin Dropdown"
            headingText="Target Plugin"
            value={uploadType}
            onValueChange={(value) => {
              // The if is only here for type validity
              if (value === "css" || value === "audio") {
                setUploadType(value);
              }
            }}
            options={[
              { value: "css", displayText: "CSS Loader" },
              {
                value: "audio",
                displayText: "Audio Loader",
                disabled: uploadMethod === "css",
              },
            ]}
          />
        </div>
        {uploadMethod === "zip" && (
          <ZipSubmitPanel info={uploadInfo as ZipSubmissionInfo} setInfo={setUploadInfo} />
        )}
        {uploadMethod === "git" && (
          <GitSubmitPanel info={uploadInfo as GitSubmissionInfo} setInfo={setUploadInfo} />
        )}
        {uploadMethod === "css" && (
          <CSSSubmitPanel info={uploadInfo as CSSSubmissionInfo} setInfo={setUploadInfo} />
        )}
      </div>
    </>
  );
}
