import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { genericFetch } from "../apiHelpers";
import * as Progress from "@radix-ui/react-progress";
import { CSSSubmissionInfo, GitSubmissionInfo, MetaInfo, ZipSubmissionInfo } from "../types";
import {
  CSSSubmitPanel,
  GitSubmitPanel,
  LoadingPage,
  LogInPage,
  MetaSubmitPanel,
  TosCheckboxes,
  ZipSubmitPanel,
} from "../components";
import { useHasCookie } from "../hooks";
import { authContext } from "contexts";
import { toast } from "react-toastify";
import { RadioDropdown } from "@components/Primitives";

const BigDivider = () => {
  return <div className="my-2 h-2 w-full bg-borderLight dark:bg-borderDark" />;
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
    genericFetch(`/submissions/${uploadType}_${uploadMethod}`, {
      method: "POST",
      body: JSON.stringify({ ...data(), meta: formattedMeta }),
      headers: {
        "Content-Type": "application/json",
      },
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
        <main className="page-shadow mx-4 flex flex-1 flex-grow flex-col items-center gap-4 rounded-3xl border-[1px] border-borders-base3-light bg-base-2-light py-12 dark:border-borders-base1-dark dark:bg-base-2-dark">
          <div className="m-4 rounded-xl bg-cardLight px-4 py-2 text-xl transition-colors hover:bg-borderLight dark:bg-cardDark hover:dark:bg-borderDark">
            <a
              href={process.env.NEXT_PUBLIC_DOCS_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-3xl bg-gradient-to-tl from-blue-800 to-blue-500 bg-clip-text p-1 text-transparent"
            >
              <span className="text-textLight dark:text-textDark">Need help? </span>
              <br className="flex md:hidden" />
              View the docs <br className="flex md:hidden" />
              <span className="text-textLight dark:text-textDark">
                for guides, documentation, and tools!
              </span>
            </a>
          </div>
          <div className="relative flex min-h-[52rem] w-full max-w-7xl flex-col items-center justify-center overflow-hidden rounded-3xl border-[1px] border-borders-base1-light bg-base-3-light dark:border-borders-base1-dark dark:bg-base-2.5-dark">
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
              className="absolute top-0 h-2 w-full overflow-hidden rounded-full dark:bg-base-3-dark"
              value={progress}
            >
              <Progress.Indicator
                className="duration-660ms h-full w-full rounded-full bg-brandBlue transition-transform"
                style={{ transform: `translateX(-${100 - progress}%)` }}
              />
            </Progress.Root>

            {currentStep === 1 && (
              <>
                <section className="flex w-full flex-col items-center gap-4 p-4 py-16">
                  <div className="flex w-full flex-col items-center justify-center gap-4">
                    <div className="absolute top-8">
                      <span className="font-fancy w-full pb-4 text-center text-2xl font-semibold md:text-4xl">
                        Upload Theme
                      </span>
                    </div>
                    <div className="mb-4 flex w-full flex-col gap-4 md:w-1/2 md:flex-row">
                      <RadioDropdown
                        ariaLabel="Upload Method Dropdown"
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
                      className="group pointer-events-none mb-2 inline-flex w-fit items-center justify-center gap-2 rounded-full border-2 border-borders-base1-light bg-brandBlue py-2 px-4 text-sm font-semibold text-white no-underline opacity-50 transition hover:border-borders-base2-light hover:bg-fore-11-dark hover:text-fore-contrast-dark focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 active:opacity-60 dark:border-borders-base1-dark hover:dark:border-borders-base2-dark sm:mb-0"
                      onClick={goToPreviousStep}
                    >
                      Back
                    </button>
                    <button
                      className="group mb-2 inline-flex w-fit items-center justify-center gap-2 rounded-full border-2 border-borders-base1-light bg-brandBlue py-2 px-4 text-sm font-semibold text-white no-underline transition hover:border-borders-base2-light hover:bg-fore-11-dark hover:text-fore-contrast-dark focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 active:opacity-60 dark:border-borders-base1-dark hover:dark:border-borders-base2-dark sm:mb-0"
                      onClick={goToNextStep}
                    >
                      Next
                    </button>
                  </div>
                </section>
              </>
            )}
            {currentStep === 2 && (
              <section className="flex w-full flex-col items-center p-4 py-16">
                <div className="absolute top-8">
                  <span className="font-fancy w-full pb-4 text-center text-2xl font-semibold md:text-4xl">
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
                    className="group mb-2 inline-flex w-fit items-center justify-center gap-2 rounded-full border-2 border-borders-base1-light bg-brandBlue py-2 px-4 text-sm font-semibold text-white no-underline transition hover:border-borders-base2-light hover:bg-fore-11-dark hover:text-fore-contrast-dark focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 active:opacity-60 dark:border-borders-base1-dark hover:dark:border-borders-base2-dark sm:mb-0"
                    onClick={goToPreviousStep}
                  >
                    Back
                  </button>
                  <button
                    className="group mb-2 inline-flex w-fit items-center justify-center gap-2 rounded-full border-2 border-borders-base1-light bg-brandBlue py-2 px-4 text-sm font-semibold text-white no-underline transition hover:border-borders-base2-light hover:bg-fore-11-dark hover:text-fore-contrast-dark focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 active:opacity-60 dark:border-borders-base1-dark hover:dark:border-borders-base2-dark sm:mb-0"
                    onClick={goToNextStep}
                  >
                    Next
                  </button>
                </div>
              </section>
            )}
            {currentStep === 3 && (
              <>
                <section className="flex w-full flex-col items-center p-4 py-16">
                  <div className="flex w-full flex-col items-center justify-center gap-4">
                    <div className="absolute top-8">
                      <span className="font-fancy w-full pb-4 text-center text-2xl font-semibold md:text-4xl">
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
                      className="group mb-2 inline-flex w-fit items-center justify-center gap-2 rounded-full border-2 border-borders-base1-light bg-brandBlue py-2 px-4 text-sm font-semibold text-white no-underline transition hover:border-borders-base2-light hover:bg-fore-11-dark hover:text-fore-contrast-dark focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 active:opacity-60 dark:border-borders-base1-dark hover:dark:border-borders-base2-dark sm:mb-0"
                      onClick={goToPreviousStep}
                    >
                      Back
                    </button>

                    <button
                      disabled={!checkIfReady()}
                      onClick={submitTheme}
                      className="group mb-2 inline-flex w-fit items-center justify-center gap-2 rounded-full border-2 border-borders-base1-light bg-brandBlue py-2 px-4 text-sm font-semibold text-white no-underline transition hover:border-borders-base2-light hover:bg-fore-11-dark hover:text-fore-contrast-dark focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 active:opacity-60 dark:border-borders-base1-dark hover:dark:border-borders-base2-dark sm:mb-0"
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
