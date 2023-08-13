import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { checkAndRefreshToken, fetchWithRefresh, genericFetch, genericGET } from "../../apiHelpers";
import { FullThemeCard, LoadingPage, MiniPfpDisplay, SubmissionReviewCard } from "../../components";
import {
  FormattedSubmissionIntent,
  FormattedSubmissionIntentAudio,
  ThemeSubmissionInfo,
} from "../../types";

export default function FullSubmissionViewPage() {
  const router = useRouter();
  const [loaded, setLoaded] = useState<boolean>(false);
  let { submissionId } = router.query;
  let parsedId: string = "";
  // this is here because for some reason @types/next thinks that router.query can be an array of strings
  if (Array.isArray(submissionId)) {
    parsedId = submissionId[0];
  } else {
    parsedId = submissionId || "";
  }

  const [submissionData, setSubData] = useState<ThemeSubmissionInfo | undefined>(undefined);

  useEffect(() => {
    async function getData() {
      genericGET(`/submissions/${parsedId}`).then((data) => {
        setSubData(data);
        setLoaded(true);
      });
    }
    if (parsedId) {
      getData();
    }
  }, [parsedId]);

  if (!loaded) {
    return <LoadingPage />;
  }

  if (!submissionData) {
    return <span>Error! Invalid Submission ID</span>;
  }

  return (
    <>
      <Head>
        <title>DeckThemes | Submission Viewer</title>
      </Head>
      <div className="flex w-full flex-col items-center px-4">
        <h1 className="mt-4 mb-4 text-3xl font-black md:text-6xl">
          {submissionData.newTheme.type === "Audio"
            ? FormattedSubmissionIntentAudio[submissionData.intent]
            : FormattedSubmissionIntent[submissionData.intent]}
        </h1>
        <FullThemeCard parsedId={submissionData.newTheme.id} hideAdminMenu />
      </div>
      <div className="flex w-full flex-col items-center">
        <h2 className="my-4 border-b-4 border-textLight text-3xl font-semibold dark:border-textDark md:text-4xl">
          Submission Info
        </h2>
        <div className="mb-4 flex flex-col items-center">
          {submissionData.errors && submissionData.errors.length > 0 ? (
            <>
              <span className="text-2xl">Errors:</span>
              <div className="flex max-h-64 flex-col items-center overflow-y-scroll rounded-3xl border-4 border-borderLight px-8 text-center dark:border-borderDark">
                {submissionData.errors.map((e, i) => (
                  <span key={`Submission Error ${i}`} className="max-w-[60vw]">
                    <b>{i + 1}:</b> {e}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              <span>No Errors</span>
            </>
          )}
        </div>
        {submissionData.status === "AwaitingApproval" ? (
          <>
            <SubmissionReviewCard submissionData={submissionData} parsedId={parsedId} />
          </>
        ) : (
          <>
            <div className="flex w-full flex-col items-center pt-4">
              {submissionData.status !== "Dead" && (
                <div className="flex items-center gap-2 text-5xl">
                  {submissionData.status === "Approved" ? (
                    <BsCheckCircleFill className="text-emerald-600" />
                  ) : (
                    <BsXCircleFill className="text-red-500" />
                  )}
                  <span>{submissionData.status}</span>
                </div>
              )}
              <div className="mb-2 flex flex-col items-center">
                <span className="py-2 px-4 text-xl">{submissionData.message}</span>
              </div>
              {submissionData?.reviewedBy ? (
                <div className="flex items-center gap-2">
                  <span>Reviewed By:</span>
                  <div>
                    <MiniPfpDisplay accountInfo={submissionData.reviewedBy} dark />
                  </div>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </>
  );
}
