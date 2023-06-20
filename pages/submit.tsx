import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { checkAndRefreshToken, fetchDiscordUrl } from "../apiHelpers";
import * as Progress from "@radix-ui/react-progress";
import { CSSSubmissionInfo, GitSubmissionInfo, MetaInfo, ZipSubmissionInfo } from "../types";
import {
  CSSSubmitPanel,
  GitSubmitPanel,
  LoadingPage,
  LogInPage,
  MetaSubmitPanel,
  MiniDivider,
  partHeaderClasses,
  TosCheckboxes,
  ZipSubmitPanel,
} from "../components";
import { useHasCookie } from "../hooks";
import { authContext } from "./_app";
import { toast } from "react-toastify";
import { HorizontalRadio, RadioDropdown } from "@components/Primitives";

const BigDivider = () => {
  return <div className="h-2 w-full bg-borderLight dark:bg-borderDark my-2" />;
};

export default function Submit() {
  const router = useRouter();

  const hasCookie = useHasCookie();
  const { accountInfo } = useContext(authContext);

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

  const [hasAcceptedTos, setHasAcceptedTos] = useState<boolean>(false);

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
    return ready && hasAcceptedTos;
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
          toast.error(`Error Submitting Theme! ${JSON.stringify(err)}`);
          console.error("Error Submitting Theme!", err);
        });
    }
  }

  const [currentStep, setStep] = useState<number>(1);
  const totalSteps = 3;

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  };

  const [progress, setProgress] = useState<number>(0);
  const calculateProgress = () => {
    const percentage = (currentStep / totalSteps) * 100;
    setProgress(percentage);
  };

  useEffect(() => {
    calculateProgress();
  }, [currentStep]);

  const [uploadMethod, setUploadMethod] = useState<string>("git");
  if (accountInfo?.username) {
    return (
      <>
        <Head>
          <title>DeckThemes | Submit</title>
        </Head>
        <style>
          {`
        
        .dark .filepond--panel-root {
          background-color: hsla(220, 9%, 60%, 0.1);
        }

        .dark .filepond--drop-label {
          color: #fff;
        }

		.dark .filepond--panel-root {
			background: transparent;
		}
		
		.filepond--credits {
			display: none !important;
		}

		.dark .filepond--root {
			background: #1e2024;
			border-radius: 12px;
		}
        `}
        </style>
        <main className="flex flex-1 flex-col items-center flex-grow gap-4 page-shadow border-[1px] border-borders-base1-light bg-base-2-light dark:border-borders-base1-dark dark:bg-base-2-dark py-12 mx-4 rounded-3xl">
          <div className="m-4 px-4 py-2 bg-cardLight dark:bg-cardDark hover:bg-borderLight hover:dark:bg-borderDark transition-colors rounded-xl text-xl">
            <a
              href={process.env.NEXT_PUBLIC_DOCS_URL}
              target="_blank"
              rel="noreferrer"
              className="text-transparent bg-clip-text bg-gradient-to-tl from-blue-800 to-blue-500 p-1 rounded-3xl"
            >
              <span className="text-textLight dark:text-textDark">Need help? </span>
              <br className="flex md:hidden" />
              View the docs <br className="flex md:hidden" />
              <span className="text-textLight dark:text-textDark">
                for guides, documentation, and tools!
              </span>
            </a>
          </div>
          <div className="w-full border-[1px] border-borders-base1-light bg-base-3-light dark:border-borders-base1-dark dark:bg-base-2.5-dark rounded-3xl flex flex-col items-center justify-center max-w-7xl overflow-hidden min-h-[52rem] relative">
            {/* <HorizontalRadio
              rootClass="pb-8"
              value={currentStep + ""}
              onValueChange={(e: string) => setStep(Number(e))}
              itemClass="h-4 w-4"
              options={[
                { value: "1", displayText: "" },
                { value: "2", displayText: "" },
                { value: "3", displayText: "" },
              ]}
            /> */}
            <Progress.Root
              className="w-full h-2 dark:bg-base-3-dark rounded-full overflow-hidden absolute top-0"
              value={progress}
            >
              <Progress.Indicator
                className="bg-brandBlue w-full h-full transition-transform duration-660ms rounded-full"
                style={{ transform: `translateX(-${100 - progress}%)` }}
              />
            </Progress.Root>

            {currentStep === 1 && (
              <>
                <section className="p-4 py-16 w-full flex flex-col items-center gap-4">
                  <div className="flex flex-col items-center gap-4 justify-center w-full">
                    <div className="absolute top-8">
                      <span className="font-fancy text-2xl md:text-4xl font-semibold text-center w-full pb-4">
                        Upload Theme
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/2 mb-4">
                      <RadioDropdown
                        headingText="Upload Method"
                        value={uploadMethod}
                        onValueChange={(value) => {
                          setUploadMethod(value);
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
                        headingText="Target Plugin"
                        value={uploadType}
                        onValueChange={(value) => {
                          // The if is only here for type validity
                          if (value === "css" || value === "audio") {
                            setUploadType(value);
                          }
                        }}
                        options={[
                          { value: "css", displayText: "CSSLoader" },
                          {
                            value: "audio",
                            displayText: "AudioLoader",
                            disabled: uploadMethod === "css",
                          },
                        ]}
                      />
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

                  <div className="absolute bottom-8 flex flex-row gap-4">
                    <button
                      disabled={true}
                      className="opacity-50 pointer-events-none w-fit gap-2 mb-2 sm:mb-0 group no-underline inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-brandBlue text-white hover:bg-fore-11-dark hover:text-fore-contrast-dark active:opacity-60 border-2 border-borders-base1-light hover:border-borders-base2-light dark:border-borders-base1-dark hover:dark:border-borders-base2-dark transition"
                      onClick={goToPreviousStep}
                    >
                      Back
                    </button>
                    <button
                      className="w-fit gap-2 mb-2 sm:mb-0 group no-underline inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-brandBlue text-white hover:bg-fore-11-dark hover:text-fore-contrast-dark active:opacity-60 border-2 border-borders-base1-light hover:border-borders-base2-light dark:border-borders-base1-dark hover:dark:border-borders-base2-dark transition"
                      onClick={goToNextStep}
                    >
                      Next
                    </button>
                  </div>
                </section>
              </>
            )}
            {currentStep === 2 && (
              <section className="p-4 py-16 w-full flex flex-col items-center">
                <div className="absolute top-8">
                  <span className="font-fancy text-2xl md:text-4xl font-semibold text-center w-full pb-4">
                    Edit Theme Listing
                  </span>
                </div>
                <MetaSubmitPanel
                  info={metaInfo}
                  setInfo={setMetaInfo}
                  uploadType={uploadType}
                  uploadMethod={uploadMethod}
                />
                <div className="absolute bottom-8 flex flex-row gap-4">
                  <button
                    className="w-fit gap-2 mb-2 sm:mb-0 group no-underline inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-brandBlue text-white hover:bg-fore-11-dark hover:text-fore-contrast-dark active:opacity-60 border-2 border-borders-base1-light hover:border-borders-base2-light dark:border-borders-base1-dark hover:dark:border-borders-base2-dark transition"
                    onClick={goToPreviousStep}
                  >
                    Back
                  </button>
                  <button
                    className="w-fit gap-2 mb-2 sm:mb-0 group no-underline inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-brandBlue text-white hover:bg-fore-11-dark hover:text-fore-contrast-dark active:opacity-60 border-2 border-borders-base1-light hover:border-borders-base2-light dark:border-borders-base1-dark hover:dark:border-borders-base2-dark transition"
                    onClick={goToNextStep}
                  >
                    Next
                  </button>
                </div>
              </section>
            )}
            {currentStep === 3 && (
              <>
                <section className="p-4 py-16 w-full flex flex-col items-center">
                  <div className="flex flex-col items-center gap-4 justify-center w-full">
                    <div className="absolute top-8">
                      <span className="font-fancy text-2xl md:text-4xl font-semibold text-center w-full pb-4">
                        Accept Terms
                      </span>
                    </div>
                    <TosCheckboxes
                      checkValue={hasAcceptedTos}
                      setCheckValue={setHasAcceptedTos}
                      uploadType={uploadType}
                    />
                  </div>
                  <div className="absolute bottom-8 flex flex-row gap-4">
                    <button
                      className="w-fit gap-2 mb-2 sm:mb-0 group no-underline inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-brandBlue text-white hover:bg-fore-11-dark hover:text-fore-contrast-dark active:opacity-60 border-2 border-borders-base1-light hover:border-borders-base2-light dark:border-borders-base1-dark hover:dark:border-borders-base2-dark transition"
                      onClick={goToPreviousStep}
                    >
                      Back
                    </button>

                    <button
                      disabled={checkIfReady()}
                      onClick={() => submitTheme()}
                      className="w-fit gap-2 mb-2 sm:mb-0 group no-underline inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-brandBlue text-white hover:bg-fore-11-dark hover:text-fore-contrast-dark active:opacity-60 border-2 border-borders-base1-light hover:border-borders-base2-light dark:border-borders-base1-dark hover:dark:border-borders-base2-dark transition"
                    >
                      Submit
                    </button>
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </>
    );
  }
  if (hasCookie) {
    return <LoadingPage />;
  }
  return <LogInPage />;
}
