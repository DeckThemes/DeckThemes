import { useContext, useEffect, useMemo, useState } from "react";
import {
  CSSSubmissionInfo,
  GitSubmissionInfo,
  MetaInfo,
  ZipSubmissionInfo,
} from "@customTypes/ThemeSubmissionTypes";
import { SubmitCarouselProgressBar } from "./SubmitCarouselProgressBar";
import { Step1 } from "./UploadInfo/Step1";
import { MetaSubmitPanel } from "./Metadata/MetaSubmitPanel";
import { TosCheckboxes } from "./Terms/TosCheckboxes";
import { authContext } from "contexts";
import { AddContactPage } from "./AddContactPage";
import { CopyrightSelector } from "./Copyright/CopyrightSelector";

export function SubmitStepsCarousel({
  submitTheme,
}: {
  submitTheme: (
    uploadType: "css" | "audio",
    uploadMethod: string,
    uploadInfo: GitSubmissionInfo | ZipSubmissionInfo | CSSSubmissionInfo,
    metaInfo: MetaInfo
  ) => void;
}) {
  const { accountInfo } = useContext(authContext);
  const [currentStep, setStep] = useState<number>(1);

  const [uploadMethod, setUploadMethod] = useState<"git" | "css" | "zip">("git");
  const [uploadType, setUploadType] = useState<"css" | "audio">("css");

  const [totalSteps, stepTitles] = useMemo(() => {
    let steps = ["Upload Information"];
    if (accountInfo && !accountInfo.email) steps.push("Add Contact Information");
    if (uploadType === "audio") steps.push("Copyright Information");
    steps.push("Edit Listing", "Accept Upload Terms");

    return [steps.length, steps];
  }, [accountInfo, uploadType]);

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
  }, [currentStep, totalSteps]);

  const [uploadInfo, setUploadInfo] = useState<
    ZipSubmissionInfo | GitSubmissionInfo | CSSSubmissionInfo
  >({ url: "", commit: "", subfolder: "" });

  const [metaInfo, setMetaInfo] = useState<MetaInfo>({
    imageBlobs: [],
    description: "",
    target: "None",
  });
  const [readCopyrightInfo, setReadCopyrightInfo] = useState<boolean>(false);
  const [hasAcceptedTos, setHasAcceptedTos] = useState<boolean>(false);
  useEffect(() => {
    console.log(metaInfo.imageBlobs);
  }, [metaInfo]);

  function checkIfReady() {
    let ready = false;
    switch (uploadMethod) {
      case "git":
        let gitInfo = uploadInfo as GitSubmissionInfo;
        if (gitInfo.url) ready = true;
        break;
      case "css":
        let cssInfo = uploadInfo as CSSSubmissionInfo;
        if (cssInfo.css && cssInfo.name) ready = true;
        break;
      case "zip":
        let zipInfo = uploadInfo as ZipSubmissionInfo;
        if (zipInfo.blob) ready = true;
    }
    return ready && hasAcceptedTos;
  }
  function formatDataForSubmission() {
    submitTheme(uploadType, uploadMethod, uploadInfo, metaInfo);
  }

  return (
    <>
      <div className="relative flex min-h-[52rem] w-full max-w-7xl flex-col items-center justify-center overflow-hidden rounded-3xl border-[1px] border-borders-base1-light bg-base-3-light dark:border-borders-base1-dark dark:bg-base-2.5-dark">
        <SubmitCarouselProgressBar progress={progress} />
        {/* Step 1 */}
        <section className="flex w-full flex-col items-center justify-center gap-4 p-4 py-8">
          <span className="font-fancy w-full pb-4 text-center text-2xl font-semibold md:text-4xl">
            {stepTitles[currentStep - 1]}
          </span>
          <div className="w-full">
            <div className={currentStep !== 1 ? "hidden" : "w-full"}>
              <Step1
                {...{
                  uploadType,
                  setUploadType,
                  uploadInfo,
                  setUploadInfo,
                  uploadMethod,
                  setUploadMethod,
                }}
              />
            </div>
            <div
              className={
                currentStep !== stepTitles.indexOf("Copyright Information") + 1
                  ? "hidden"
                  : "w-full"
              }
            >
              <CopyrightSelector setCopyrightRead={setReadCopyrightInfo} />
            </div>
            <div
              className={
                currentStep !== stepTitles.indexOf("Edit Listing") + 1 ? "hidden" : "w-full"
              }
            >
              <MetaSubmitPanel
                info={metaInfo}
                setInfo={setMetaInfo}
                uploadType={uploadType}
                uploadMethod={uploadMethod}
              />
            </div>
            {stepTitles.includes("Add Contact Information") && (
              <div
                className={
                  currentStep !== stepTitles.indexOf("Add Contact Information") + 1
                    ? "hidden"
                    : "w-full"
                }
              >
                <div className="flex w-full flex-col items-center justify-center gap-4">
                  <AddContactPage />
                </div>
              </div>
            )}
            <div className={currentStep !== totalSteps ? "disable-timer hidden" : "w-full"}>
              <div className="flex w-full flex-col items-center justify-center gap-4">
                <TosCheckboxes
                  checkValue={hasAcceptedTos}
                  setCheckValue={setHasAcceptedTos}
                  uploadType={uploadType}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4 py-2">
            <button
              disabled={currentStep === 1}
              className="group mb-2 inline-flex w-fit items-center justify-center gap-2 rounded-full border-2 border-borders-base1-light bg-brandBlue py-2 px-4 text-sm font-semibold text-white no-underline transition hover:border-borders-base2-light hover:bg-fore-11-dark hover:text-fore-contrast-dark focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 active:opacity-60 disabled:pointer-events-none disabled:opacity-50 dark:border-borders-base1-dark hover:dark:border-borders-base2-dark sm:mb-0"
              onClick={goToPreviousStep}
            >
              Back
            </button>
            <button
              disabled={
                (currentStep === stepTitles.indexOf("Copyright Information") + 1 &&
                  !readCopyrightInfo) ||
                (currentStep === totalSteps && !checkIfReady())
              }
              className="group mb-2 inline-flex w-fit items-center justify-center gap-2 rounded-full border-2 border-borders-base1-light bg-brandBlue py-2 px-4 text-sm font-semibold text-white no-underline transition hover:border-borders-base2-light hover:bg-fore-11-dark hover:text-fore-contrast-dark focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 active:opacity-60 disabled:pointer-events-none disabled:opacity-50 dark:border-borders-base1-dark hover:dark:border-borders-base2-dark sm:mb-0"
              onClick={() =>
                currentStep !== totalSteps ? goToNextStep() : formatDataForSubmission()
              }
            >
              {currentStep !== totalSteps ? "Next" : "Submit"}
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
