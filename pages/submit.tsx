import Head from "next/head";
import { useRouter } from "next/router";
import { useState, Dispatch, SetStateAction, useEffect } from "react";

// @ts-ignore
import { FilePond, File, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

import { checkAndRefreshToken, genericGET } from "../api";

import { CSSSubmissionInfo, GitSubmissionInfo, MetaInfo, ZipSubmissionInfo } from "../types";
registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview
);

const sectionContainerClasses = "flex flex-col w-full items-center gap-4";

const fieldClasses = "bg-bgLight dark:bg-bgDark p-2 rounded-3xl w-full";
const fieldContainerClasses = "flex flex-col md:flex-row w-full md:w-1/2 items-center";
const metaFieldContainerClasses = "flex flex-col gap-2 w-full md:w-1/2 items-center";
const fieldTitleClasses =
  "bg-borderLight dark:bg-borderDark px-2 py-1 rounded-2xl text-medium text-xl mb-2 md:mb-0 md:mr-2";

const MiniDivider = () => {
  return <div className="w-full md:w-1/2 h-1 bg-borderLight dark:bg-borderDark rounded-full" />;
};

const BigDivider = () => {
  return <div className="h-2 w-full bg-borderLight dark:bg-borderDark my-2" />;
};

export default function Submit() {
  const router = useRouter();
  // Having these all is mostly for type-safety, but it has the added bonus of allowing you to switch back and forth from types without losing data
  const [gitUploadInfo, setGitUploadInfo] = useState<GitSubmissionInfo>({
    url: "",
    commit: "",
    subfolder: "",
  });
  const [cssUploadInfo, setCSSUploadInfo] = useState<CSSSubmissionInfo>({
    css: "",
    name: "",
  });
  const [zipUploadInfo, setZipUploadInfo] = useState<ZipSubmissionInfo>({
    blob: "",
  });

  const [uploadType, setUploadType] = useState<"css" | "audio">("css");

  const [metaInfo, setMetaInfo] = useState<MetaInfo>({
    imageBlobs: [],
    description: "",
    target: "None",
  });

  function checkIfReady() {
    let ready = false;
    switch (uploadMethod) {
      case "git":
        if (gitUploadInfo.url) ready = true;
        break;
      case "css":
        if (cssUploadInfo.css && cssUploadInfo.name) ready = true;
        break;
      case "zip":
        if (zipUploadInfo.blob) ready = true;
    }
    return ready;
  }

  async function submitTheme() {
    const data = () => {
      switch (uploadMethod) {
        case "git":
          return gitUploadInfo;
        case "css":
          return cssUploadInfo;
        default:
          return zipUploadInfo;
      }
    };
    const formattedMeta = {
      imageBlobs: metaInfo.imageBlobs,
      description: metaInfo.description || null,
      target: metaInfo.target !== "None" ? metaInfo.target : null,
    };
    console.log(data(), formattedMeta);
    const waitForRefresh = await checkAndRefreshToken();
    if (waitForRefresh) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions/${uploadType}_${uploadMethod}`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ ...data(), meta: formattedMeta }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          process.env.NEXT_PUBLIC_DEV_MODE === "true" && console.log(res);
          if (res.status < 200 || res.status >= 300 || !res.ok) {
            console.log("Submission POST Not OK!, Error Code ", res.status);
          }
          return res.json();
        })
        .then((json) => {
          process.env.NEXT_PUBLIC_DEV_MODE === "true" && console.log(json);
          if (json?.task) {
            router.push(`/taskStatus/view?task=${json.task}`);
          } else {
            alert(`Error Submitting Theme: ${json?.message || "Unknown Error"}`);
            throw new Error("No task in response");
          }
        })
        .catch((err) => {
          console.error("Error Submitting Theme!", err);
        });
    }
  }

  const [uploadMethod, setUploadMethod] = useState<string>("zip");
  return (
    <>
      <Head>
        <title>DeckThemes | Submit</title>
      </Head>
      <style>
        {`
        
        .dark .filepond--panel-root {
          background-color: #2e2e2e;
        }
        .dark .filepond--drop-label {
          color: #fff;
        }
        `}
      </style>
      <div className="flex flex-col items-center w-full grow text-center gap-4 pt-4">
        <h1 className="text-3xl md:text-4xl font-semibold py-4">Submit A Theme</h1>
        <div className="w-fit px-4 flex justify-center items-center bg-cardLight dark:bg-cardDark rounded-3xl mb-4 text-3xl">
          <a
            href="https://discord.gg/zSyf5GgdQY"
            target="_blank"
            rel="noreferrer"
            className="text-transparent bg-clip-text bg-gradient-to-tl from-violet-800 to-violet-500 p-1 rounded-3xl"
          >
            Join our Discord <br className="flex md:hidden" />
            <span className="text-textLight dark:text-textDark">
              to keep updated on your submission&apos;s status!
            </span>
          </a>
        </div>
        <main className="w-11/12 bg-cardLight dark:bg-cardDark rounded-3xl flex flex-col items-center">
          <section className="p-4 w-full flex flex-col items-center">
            <div className="flex flex-col items-center gap-4 justify-center mb-4">
              <span className="bg-bgLight dark:bg-bgDark p-4 text-2xl md:text-3xl font-medium h-full rounded-3xl">
                Part 1: Upload Your Theme
              </span>
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex flex-col h-20">
                  <span>Upload Method</span>
                  <select
                    className="bg-bgLight dark:bg-bgDark rounded-3xl h-full p-4 md:py-0 text-xl text-center"
                    value={uploadMethod}
                    onChange={({ target: { value } }) => {
                      setUploadMethod(value);
                      if (value === "css") {
                        setUploadType("css");
                      }
                    }}
                  >
                    <option value="zip">Upload Zip</option>
                    <option value="git">Link Git Repo</option>
                    <option value="css">Paste CSS Snippet</option>
                  </select>
                </div>
                <div className="flex flex-col h-20">
                  <span>Target Plugin</span>
                  <select
                    className="bg-bgLight dark:bg-bgDark rounded-3xl h-full p-4 md:py-0 text-xl text-center"
                    value={uploadType}
                    onChange={({ target: { value } }) => {
                      if (value === "css" || value === "audio") {
                        setUploadType(value);
                      }
                    }}
                  >
                    <option value="css">CSSLoader</option>
                    <option value="audio" disabled={uploadMethod === "css"}>
                      AudioLoader
                    </option>
                  </select>
                </div>
              </div>
            </div>
            {uploadMethod === "zip" && (
              <ZipSubmitPanel info={zipUploadInfo} setInfo={setZipUploadInfo} />
            )}
            {uploadMethod === "git" && (
              <GitSubmitPanel info={gitUploadInfo} setInfo={setGitUploadInfo} />
            )}
            {uploadMethod === "css" && (
              <CSSSubmitPanel info={cssUploadInfo} setInfo={setCSSUploadInfo} />
            )}
          </section>
          <BigDivider />
          <section className="p-4 w-full flex flex-col items-center">
            <span className="bg-bgLight dark:bg-bgDark p-4 text-2xl md:text-3xl font-medium rounded-3xl mb-4">
              Part 2: Add More Info
            </span>
            <MetaPanel
              info={metaInfo}
              setInfo={setMetaInfo}
              uploadType={uploadType}
              uploadMethod={uploadMethod}
            />
          </section>
          <BigDivider />
          <section className="p-4 w-full flex flex-col items-center">
            {checkIfReady() ? (
              <>
                <button className="bg-gradient-to-tl from-green-700 to-lime-300 p-4 text-2xl md:text-3xl font-medium rounded-3xl mb-4">
                  <span className="text-textDark dark:text-textLight" onClick={() => submitTheme()}>
                    Submit
                  </span>
                </button>
              </>
            ) : (
              <div className="p-4 text-2xl md:text-3xl font-medium rounded-3xl mb-4">
                <span>Add Info Before Submitting</span>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}

function MetaPanel({
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
    const data = await genericGET("/themes/filters", "Error Fetching Theme Targets!");
    if (data?.filters) {
      setTargetOptions(["None", ...data.filters]);
    }
  }

  useEffect(() => {
    if (uploadMethod === "css" && info.target === "None") {
      setInfo({ ...info, target: "Snippet" });
    }
  }, [uploadMethod]);

  useEffect(() => {
    getTargets();
  }, []);

  return (
    <>
      <div className={`${sectionContainerClasses}`}>
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
            placeholder={`Leave empty to use ${
              uploadType === "audio" ? "pack.json" : "theme.json"
            } value.`}
            onChange={(e) => setInfo({ ...info, description: e.target.value })}
            className={`${fieldClasses} h-32`}
          />
        </div>
      </div>
    </>
  );
}

function GitSubmitPanel({
  info,
  setInfo,
}: {
  info: GitSubmissionInfo;
  setInfo: Dispatch<SetStateAction<GitSubmissionInfo>>;
}) {
  return (
    <>
      <div className={`${sectionContainerClasses}`}>
        <div className={`${fieldContainerClasses}`}>
          <span className={`${fieldTitleClasses}`}>Repo URL</span>
          <input
            type="text"
            value={info.url}
            onChange={(e) => setInfo({ ...info, url: e.target.value })}
            className={fieldClasses}
          />
        </div>
        <MiniDivider />
        <div className={`${fieldContainerClasses}`}>
          <span className={`${fieldTitleClasses}`}>Commit ID</span>
          <input
            type="text"
            value={info.commit}
            onChange={(e) => setInfo({ ...info, commit: e.target.value })}
            className={fieldClasses}
          />
        </div>
        <MiniDivider />
        <div className={`${fieldContainerClasses}`}>
          <span className={`${fieldTitleClasses}`}>Subfolder</span>
          <input
            type="text"
            value={info.subfolder}
            onChange={(e) => setInfo({ ...info, subfolder: e.target.value })}
            className={fieldClasses}
          />
        </div>
      </div>
    </>
  );
}

function ZipSubmitPanel({
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

function CSSSubmitPanel({
  info,
  setInfo,
}: {
  info: CSSSubmissionInfo;
  setInfo: Dispatch<SetStateAction<CSSSubmissionInfo>>;
}) {
  return (
    <>
      <div className={`${sectionContainerClasses}`}>
        <div className={`${fieldContainerClasses}`}>
          <span className={`${fieldTitleClasses}`}>Name</span>
          <input
            type="text"
            value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
            className={fieldClasses}
          />
        </div>
        <div className={`${fieldContainerClasses}`}>
          <span className={`${fieldTitleClasses}`}>CSS</span>
          <textarea
            value={info.css}
            onChange={(e) => setInfo({ ...info, css: e.target.value })}
            className={`${fieldClasses} w-full h-64`}
            placeholder="/* Insert Your CSS Here */"
          />
        </div>
      </div>
    </>
  );
}
