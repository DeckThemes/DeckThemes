import { ZipSubmissionInfo } from "@customTypes/ThemeSubmissionTypes";
import { Dispatch, SetStateAction, useState } from "react";
// @ts-ignore
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond/dist/filepond.min.css";
import { FilePond, registerPlugin } from "react-filepond";
import { toast } from "react-toastify";
import { genericFetch } from "../../../apiHelpers";

registerPlugin(FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

export function ZipSubmitPanel({
  info,
  setInfo,
}: {
  info: ZipSubmissionInfo;
  setInfo: Dispatch<SetStateAction<ZipSubmissionInfo>>;
}) {
  const [file, setFile] = useState<any>();

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="w-full md:w-1/2">
          <FilePond
            allowFileTypeValidation
            labelFileTypeNotAllowed="Invalid File Type!"
            fileValidateTypeLabelExpectedTypes="File must be a .zip archive"
            acceptedFileTypes={[
              "application/zip",
              "application/x-zip",
              "application/x-zip-compressed",
            ]}
            allowFileSizeValidation
            maxFileSize={process.env.NEXT_PUBLIC_MAX_ZIP_SIZE}
            files={file}
            onupdatefiles={setFile}
            onremovefile={() => {
              setInfo({ blob: "" });
            }}
            allowMultiple={false}
            maxFiles={1}
            server={{
              url: `${process.env.NEXT_PUBLIC_API_URL}/blobs`,
              // revert is fired on a deletion, but we dont need to delete anything on the server
              // The actual delete logic is in onremovefile
              revert: () => {},
              process: (_, file, __, load, error) => {
                const formData = new FormData();
                formData.append("File", file);
                genericFetch("/blobs", {
                  method: "POST",
                  body: formData,
                })
                  .then((json) => {
                    if (json?.id) {
                      setInfo({ blob: json.id });
                      load(json.id);
                    }
                  })
                  .catch((err) => {
                    toast.error(
                      `Error Uploading File! ${JSON.stringify(
                        err instanceof Error ? err.message : err
                      )}`
                    );
                    error(err);
                  });
              },
            }}
            name="File"
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          />
        </div>
      </div>
    </>
  );
}
