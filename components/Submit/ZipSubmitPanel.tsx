import { Dispatch, SetStateAction, useState } from "react";
import { ZipSubmissionInfo } from "../../types";
// @ts-ignore
import { FilePond, File, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { checkAndRefreshToken } from "../../api";

registerPlugin(FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

export function ZipSubmitPanel({
  info,
  setInfo,
}: {
  info: ZipSubmissionInfo;
  setInfo: Dispatch<SetStateAction<ZipSubmissionInfo>>;
}) {
  const [file, setFile] = useState<File>();

  return (
    <>
      <div className="flex flex-col items-center w-full justify-center">
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
                          setInfo({ blob: json.id });
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
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          />
        </div>
      </div>
    </>
  );
}
