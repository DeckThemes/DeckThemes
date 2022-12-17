import Head from "next/head";
import { useRouter } from "next/router";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import {
  BsFillTrashFill,
  BsArrowUp,
  BsArrowDown,
  BsFolderFill,
  BsCloudUploadFill,
  BsXLg,
} from "react-icons/bs";
import { checkAndRefreshToken, genericGET } from "../api";

import {
  APIBlob,
  CSSSubmissionInfo,
  GitSubmissionInfo,
  MetaInfo,
  ZipSubmissionInfo,
} from "../types";

const sectionContainerClasses = "flex flex-col w-full items-center gap-4";

const fieldClasses = "bg-bgLight dark:bg-bgDark p-2 rounded-3xl w-full";
const fieldContainerClasses = "flex flex-col md:flex-row w-full md:w-1/2 items-center";
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

  const [metaInfo, setMetaInfo] = useState<MetaInfo>({
    imageBlobs: [],
    description: "",
    target: "",
  });

  async function submitTheme() {
    const data = () => {
      switch (uploadMethod) {
        case "css_git":
          return gitUploadInfo;
        case "css_css":
          return cssUploadInfo;
        default:
          return zipUploadInfo;
      }
    };
    const formattedMeta = {
      imageBlobs: metaInfo.imageBlobs,
      description: metaInfo.description || null,
      target: metaInfo.target || null,
    };
    const waitForRefresh = await checkAndRefreshToken();
    if (waitForRefresh) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions/${uploadMethod}`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ ...data(), meta: formattedMeta }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log(res);
          if (res.status < 200 || res.status >= 300 || !res.ok) {
            throw new Error("Response Not OK");
          }
          return res.json();
        })
        .then((json) => {
          console.log(json);
          if (json?.task) {
            router.push(`/taskStatus/${json.task}`);
          } else {
            throw new Error("No task in response");
          }
        })
        .catch((err) => {
          console.error("Error Submitting Theme!", err);
        });
    }
  }

  const [uploadMethod, setUploadMethod] = useState<string>("css_zip");
  return (
    <div className="flex flex-col items-center w-full grow text-center">
      <h1 className="text-3xl md:text-4xl font-semibold py-4">Submit A Theme</h1>
      <main className="w-11/12 bg-cardLight dark:bg-cardDark rounded-3xl flex flex-col items-center">
        <section className="p-4 w-full flex flex-col items-center">
          <div className="flex flex-col md:flex-row items-center gap-4 md:h-16 mb-4">
            <span className="bg-bgLight dark:bg-bgDark p-4 text-2xl md:text-3xl font-medium h-full rounded-3xl">
              Part 1: Upload Your Theme
            </span>
            <select
              className="bg-bgLight dark:bg-bgDark rounded-3xl h-full p-4 md:py-0 text-xl"
              onChange={({ target: { value } }) => {
                setUploadMethod(value);
              }}
            >
              <option value="css_zip">Via File</option>
              <option value="css_git">Via Git</option>
              <option value="css_css">Via CSS</option>
            </select>
          </div>
          {uploadMethod === "css_zip" && (
            <ZipSubmitPanel info={zipUploadInfo} setInfo={setZipUploadInfo} />
          )}
          {uploadMethod === "css_git" && (
            <GitSubmitPanel info={gitUploadInfo} setInfo={setGitUploadInfo} />
          )}
          {uploadMethod === "css_css" && (
            <CSSSubmitPanel info={cssUploadInfo} setInfo={setCSSUploadInfo} />
          )}
        </section>
        <BigDivider />
        <section className="p-4 w-full flex flex-col items-center">
          <span className="bg-bgLight dark:bg-bgDark p-4 text-2xl md:text-3xl font-medium rounded-3xl mb-4">
            Part 2: Add More Info
          </span>
          <MetaPanel info={metaInfo} setInfo={setMetaInfo} />
        </section>
        <BigDivider />
        <section className="p-4 w-full flex flex-col items-center">
          <button className="bg-gradient-to-tl from-green-700 to-lime-300 p-4 text-2xl md:text-3xl font-medium rounded-3xl mb-4">
            <span className="text-textDark dark:text-textLight" onClick={() => submitTheme()}>
              Submit
            </span>
          </button>
        </section>
      </main>
    </div>
  );
}

function MetaPanel({
  info,
  setInfo,
}: {
  info: MetaInfo;
  setInfo: Dispatch<SetStateAction<MetaInfo>>;
}) {
  const [image, setImage] = useState<File>();

  // Since the info object is only the data that will be sent to the API, this stores image names so that it can be displayed to the frontend and so users can see what images are currently staged for submission
  const [complimentaryImageInfo, setCompImageInfo] = useState<File[]>([]);

  // I'm lazy
  function onImageSelect(event: any) {
    setImage(event?.target?.files[0] || undefined);
  }

  async function uploadImage() {
    if (image) {
      if (image.type !== "image/jpeg") {
        alert("Image must be a JPEG file");
        return;
      }
      if (image.size >= 510000) {
        alert("Image must be smaller than 0.5MB");
        return;
      }

      // The blob upload takes a formData object as it's body
      const formData = new FormData();
      formData.append("File", image);

      const waitForRefresh = await checkAndRefreshToken();
      if (waitForRefresh) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/blobs`, {
          method: "POST",
          body: formData,
          credentials: "include",
        })
          .then((res) => {
            console.log(res);
            return res.json();
          })
          .then((json: APIBlob) => {
            if (json?.id) {
              setInfo({ ...info, imageBlobs: [...info.imageBlobs, json.id] });
              setCompImageInfo([...complimentaryImageInfo, image]);
              setImage(undefined);
            }
          });
      }
    } else {
      alert("No Image Attached");
    }
  }

  function deleteImage(i: number) {
    let blobData = [...info.imageBlobs];
    let fileData = [...complimentaryImageInfo];
    blobData.splice(i, 1);
    fileData.splice(i, 1);
    setInfo({ ...info, imageBlobs: blobData });
    setCompImageInfo(fileData);
  }

  function moveImage(from: number, to: number) {
    let blobData = [...info.imageBlobs];
    let fileData = [...complimentaryImageInfo];
    const blob = blobData.splice(from, 1)[0];
    const file = fileData.splice(from, 1)[0];
    blobData.splice(to, 0, blob);
    fileData.splice(to, 0, file);

    setInfo({ ...info, imageBlobs: blobData });
    setCompImageInfo(fileData);
  }

  const [targetOptions, setTargetOptions] = useState<string[]>(["System-Wide"]);
  async function getTargets() {
    const data = await genericGET("/themes/filters", "Error Fetching Theme Targets!");
    if (data?.filters) {
      setTargetOptions(data.filters);
    }
  }

  useEffect(() => {
    getTargets();
  }, []);

  return (
    <>
      <Head>
        <title>DeckThemes | Submit</title>
      </Head>
      <div className={`${sectionContainerClasses}`}>
        <div className={`${fieldContainerClasses}`}>
          <span className={`${fieldTitleClasses}`}>Target</span>
          <div className="flex justify-center w-full">
            <select
              className="bg-bgLight dark:bg-bgDark rounded-3xl p-2 px-4 text-xl"
              onChange={({ target: { value } }) => {
                setInfo({ ...info, target: value });
              }}
            >
              {targetOptions.map((e) => (
                <option value={e} key={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        </div>
        <MiniDivider />
        <div className={`${fieldContainerClasses}`}>
          <span className={`${fieldTitleClasses}`}>Images</span>

          <div className="flex flex-col w-full relative">
            <div className="flex items-center w-full justify-center">
              {!!image ? (
                <>
                  {/* Idk why but keeping this outer-div helps stretch the things height-wise, so I'ma leave it */}
                  <div className="flex w-full justify-center">
                    <button
                      onClick={uploadImage}
                      className="flex items-center text-xl w-1/2 p-1 bg-bgLight dark:bg-bgDark rounded-2xl"
                    >
                      <BsCloudUploadFill className="mx-2 w-12" />
                      <span className="w-64 truncate">
                        <span className="text-blue-500">Upload </span>
                        {image.name}
                      </span>
                    </button>
                    <button
                      className="flex items-center text-xl px-2 p-1 bg-bgLight dark:bg-bgDark rounded-2xl gap-2"
                      onClick={() => {
                        setImage(undefined);
                      }}
                    >
                      <BsXLg className="text-red-700" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <label
                    htmlFor="img-upload"
                    className="cursor-pointer flex items-center text-xl gap-2 bg-bgLight dark:bg-bgDark p-1 px-2 rounded-2xl"
                  >
                    <BsFolderFill />
                    <span className="font-medium">Pick Image</span>
                  </label>
                  <input
                    id="img-upload"
                    type="file"
                    accept="image/jpeg"
                    onChange={onImageSelect}
                    className="hidden"
                  />
                </>
              )}
            </div>
            <ol className="flex flex-col w-full">
              {complimentaryImageInfo.map((e, i, arr) => {
                return (
                  <li className="flex items-center mt-4" key={`Image ${i}`}>
                    <span
                      className={`text-medium text-2xl w-4 ${arr.length === 1 ? "pb-1 mr-4" : ""}`}
                    >
                      {i + 1}
                    </span>
                    {arr.length > 1 && (
                      <>
                        <div className="border-4 rounded-2xl border-borderLight dark:border-borderDark pt-1 w-16 mx-4">
                          {i < arr.length - 1 && (
                            <button
                              onClick={() => {
                                moveImage(i, i + 1);
                              }}
                            >
                              <BsArrowDown size={25} />
                            </button>
                          )}

                          {i > 0 && (
                            <button
                              onClick={() => {
                                moveImage(i, i - 1);
                              }}
                            >
                              <BsArrowUp size={25} />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                    <span className="text-xl truncate w-64">{e.name}</span>
                    <button
                      className="ml-auto"
                      onClick={() => {
                        deleteImage(i);
                      }}
                    >
                      <BsFillTrashFill size={25} className="text-red-700" />
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
        <MiniDivider />
        <div className={`${fieldContainerClasses}`}>
          <span className={`${fieldTitleClasses}`}>Description</span>
          <textarea
            value={info.description}
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
  const [uploadedFile, setUploadedFile] = useState<File>();

  function onFileSelect(event: any) {
    setFile(event?.target?.files[0] || undefined);
  }

  async function uploadFile() {
    if (file) {
      if (file.type !== "application/x-zip-compressed") {
        alert("Must be a ZIP file");
        return;
      }
      if (file.size >= 510000) {
        alert("File must be smaller than 10MB");
        return;
      }

      // The blob upload takes a formData object as it's body
      const formData = new FormData();
      formData.append("File", file);

      const waitForRefresh = await checkAndRefreshToken();
      if (waitForRefresh) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/blobs`, {
          method: "POST",
          body: formData,
          credentials: "include",
        })
          .then((res) => {
            return res.json();
          })
          .then((json: APIBlob) => {
            if (json?.id) {
              setInfo({ ...info, blob: json.id });
              setUploadedFile(file);
              setFile(undefined);
            }
          });
      }
    } else {
      alert("No Image Attached");
    }
  }

  function deleteFile() {
    setInfo({ blob: "" });
    setUploadedFile(undefined);
  }

  return (
    <>
      <div className="flex flex-col items-center w-full justify-center">
        {!uploadedFile ? (
          <>
            {!!file ? (
              <>
                {/* Idk why but keeping this outer-div helps stretch the things height-wise, so I'ma leave it */}
                <div className="flex w-[80vw] lg:w-[640px] justify-center">
                  <button
                    onClick={uploadFile}
                    className="flex items-center text-xl w-1/2 p-1 bg-bgLight dark:bg-bgDark rounded-2xl"
                  >
                    <BsCloudUploadFill className="mx-2 w-12" />
                    <span className="w-64 truncate">
                      <span className="text-blue-500">Upload </span>
                      {file.name}
                    </span>
                  </button>
                  <button
                    className="flex items-center text-xl px-2 p-1 bg-bgLight dark:bg-bgDark rounded-2xl gap-2"
                    onClick={() => {
                      setFile(undefined);
                    }}
                  >
                    <BsXLg className="text-red-700" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <label
                  htmlFor="zip-upload"
                  className="cursor-pointer flex items-center text-xl gap-2 bg-bgLight dark:bg-bgDark p-1 px-2 rounded-2xl"
                >
                  <BsFolderFill />
                  <span className="font-medium">Pick File</span>
                </label>
                <input
                  id="zip-upload"
                  type="file"
                  accept=".zip"
                  onChange={onFileSelect}
                  className="hidden"
                />
              </>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center">
              <span className="text-xl font-semibold mr-2">Chosen Zip: </span>
              <span className="text-xl truncate w-64">{uploadedFile.name}</span>
              <button
                className="ml-auto"
                onClick={() => {
                  deleteFile();
                }}
              >
                <BsFillTrashFill size={25} className="text-red-700" />
              </button>
            </div>
          </>
        )}
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
