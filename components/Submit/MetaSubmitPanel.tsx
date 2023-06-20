import { Dispatch, SetStateAction, useEffect, useState } from "react";
// @ts-ignore
import { FilePond, File, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { checkAndRefreshToken, genericGET } from "../../apiHelpers";
import { MetaInfo } from "../../types";
import { MiniDivider } from "../Generic";
import {
  fieldClasses,
  fieldTitleClasses,
  metaFieldContainerClasses,
  sectionContainerClasses,
} from "./SubmitPageTailwindClasses";
import { toast } from "react-toastify";
import { LabelledTextArea, RadioDropdown } from "@components/Primitives";

registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview
);

// Use this to hide targets that aren't meant for user choice
const disallowedOverrideTargets = ["Preset"];

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
  const [images, setImages] = useState<File>();

  const [targetOptions, setTargetOptions] = useState<string[]>(["None", "System-Wide", "Snippet"]);
  async function getTargets() {
    const data = await genericGET(`/themes/filters?type=CSS`, true);
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
      // @ts-ignore
      (info.target !== "None" || info.target !== "Music" || info.target !== "Audio")
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
        <div className={`${metaFieldContainerClasses}`}>
          <span className={`${fieldTitleClasses}`}>Images</span>
          <div className="flex flex-col w-full relative">
            <FilePond
              allowFileTypeValidation
              labelFileTypeNotAllowed="Invalid File Type!"
              fileValidateTypeLabelExpectedTypes="Images must be in .JPG or .PNG format"
              acceptedFileTypes={["image/jpeg", "image/png"]}
              allowFileSizeValidation
              allowImagePreview
              allowImageExifOrientation
              maxFileSize={process.env.NEXT_PUBLIC_MAX_IMG_SIZE}
              files={images}
              onupdatefiles={setImages}
              onremovefile={(_, file) => {
                setInfo({
                  ...info,
                  imageBlobs: info.imageBlobs.filter((e) => e !== file.serverId),
                });
              }}
              onreorderfiles={(files) => {
                setInfo({ ...info, imageBlobs: files.map((e) => e.serverId) });
              }}
              allowReorder
              allowMultiple
              maxFiles={5}
              server={{
                url: `${process.env.NEXT_PUBLIC_API_URL}/blobs`,
                revert: (_, load) => {
                  setInfo({ ...info, imageBlobs: [] });
                  load();
                },
                process: (_, file, __, load, error) => {
                  const formData = new FormData();
                  formData.append("File", file);
                  checkAndRefreshToken().then((bool) => {
                    if (bool) {
                      fetch(`${process.env.NEXT_PUBLIC_API_URL}/blobs`, {
                        method: "POST",
                        body: formData,
                        credentials: "include",
                      })
                        .then((res) => {
                          if (res.status >= 200 && res.status <= 300) {
                            return res.json();
                          }
                          error("Res Not OK!");
                        })
                        .then((json) => {
                          if (json?.id) {
                            setInfo((info) => ({
                              ...info,
                              imageBlobs: [json.id, ...info.imageBlobs],
                            }));
                            load(json.id);
                          }
                        })
                        .catch((err) => {
                          toast.error(`Error Uploading Image! ${JSON.stringify(err)}`);
                          error(err);
                        });
                    }
                  });
                },
              }}
              name="File"
              labelIdle='Drag & Drop images or <span class="filepond--label-action">Browse</span>'
            />
          </div>
        </div>
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
