import { Dispatch, SetStateAction, useEffect, useState } from "react";
// @ts-ignore
import { FilePond, File, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { checkAndRefreshToken, genericGET } from "../../api";
import { MetaInfo } from "../../types";
import { MiniDivider } from "../Generic";
import {
  fieldClasses,
  fieldTitleClasses,
  metaFieldContainerClasses,
  sectionContainerClasses,
} from "./SubmitPageTailwindClasses";

registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview
);

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
      setTargetOptions(["None", ...Object.keys(data.filters)]);
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
            <div className={`${metaFieldContainerClasses}`}>
              <span className={`${fieldTitleClasses}`}>Target</span>
              <div className="flex justify-center w-full">
                <select
                  className="bg-bgLight dark:bg-bgDark rounded-3xl p-2 px-4 text-xl"
                  value={info.target}
                  onChange={({ target: { value } }) => {
                    setInfo({ ...info, target: value });
                  }}
                >
                  {targetOptions.map((e) => (
                    <option value={e} key={e} disabled={e === "None" && uploadMethod === "css"}>
                      {e !== "None" ? e : "Use JSON Value"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <MiniDivider />
          </>
        )}
        <div className={`${metaFieldContainerClasses}`}>
          <span className={`${fieldTitleClasses}`}>Images</span>
          <div className="flex flex-col w-full relative">
            <FilePond
              allowFileTypeValidation
              labelFileTypeNotAllowed="Invalid File Type!"
              fileValidateTypeLabelExpectedTypes="Images must be in .JPG format"
              acceptedFileTypes={["image/jpeg"]}
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
        <MiniDivider />
        <div className={`${metaFieldContainerClasses}`}>
          <span className={`${fieldTitleClasses}`}>Description</span>
          <textarea
            value={info.description}
            placeholder={`${
              uploadMethod !== "css"
                ? `Leave blank to use ${uploadType === "audio" ? "pack.json" : "theme.json"} value.`
                : "Enter Description Here"
            }`}
            onChange={(e) => setInfo({ ...info, description: e.target.value })}
            className={`${fieldClasses} h-32`}
          />
        </div>
      </div>
    </>
  );
}
