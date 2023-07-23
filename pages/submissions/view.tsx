import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { checkAndRefreshToken, fetchWithRefresh, genericFetch, genericGET } from "../../apiHelpers";
import {
  FullThemeCard,
  LoadingPage,
  LoadingSpinner,
  MiniPfpDisplay,
  PfpDisplay,
} from "../../components";
import {
  FormattedSubmissionIntent,
  FormattedSubmissionIntentAudio,
  Permissions,
  ThemeSubmissionInfo,
} from "../../types";
import { authContext } from "contexts";
import { LabelledTextArea } from "@components/Primitives";

export default function FullSubmissionViewPage() {
  const { accountInfo } = useContext(authContext);
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

  const [submittingReview, setSubmitting] = useState<boolean>(false);

  async function submitReview() {
    if (action) {
      setSubmitting(true);
      const waitForRefresh = await checkAndRefreshToken();
      if (waitForRefresh) {
        genericFetch(
          `/submissions/${parsedId}/${action}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: message,
            }),
          },
          true
        )
          .then((success) => {
            if (success) {
              setReviewSubmitted(true);
              setSubmitting(false);
              return;
            }
            throw new Error("Res Not OK!");
          })
          .catch((err) => {
            console.error("Error Submitting Theme Review!", err);
            toast.error(`Error Submitting Theme Review! ${JSON.stringify(err)}`);
          });
      }
    }
  }

  const [submissionData, setSubData] = useState<ThemeSubmissionInfo | undefined>(undefined);

  const [action, setAction] = useState<undefined | "approve" | "deny">(undefined);
  const [message, setMessage] = useState<string>("");

  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

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

  return (
    <>
      <Head>
        <title>DeckThemes | Submission Viewer</title>
      </Head>
      {submissionData ? (
        <>
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
                <>
                  {!reviewSubmitted ? (
                    <>
                      {submittingReview ? (
                        <>
                          <LoadingSpinner />
                        </>
                      ) : (
                        <>
                          <div className="font-fancy flex w-full flex-col items-center gap-2 md:w-1/3">
                            <div className="flex gap-8">
                              {accountInfo?.permissions.includes(Permissions.approveSubs) && (
                                <button
                                  className={`${
                                    action === "approve" ? "bg-emerald-500 dark:bg-emerald-800" : ""
                                  } flex items-center rounded-full border-2 border-borders-base1-light p-2 transition-colors hover:border-borders-base2-light dark:border-borders-base1-dark hover:dark:border-borders-base2-dark`}
                                  onClick={() => {
                                    action !== "approve"
                                      ? setAction("approve")
                                      : setAction(undefined);
                                  }}
                                >
                                  <BsCheckCircleFill size={36} />
                                  <span className="ml-2 mr-1 text-xl font-medium">Approve</span>
                                </button>
                              )}
                              {accountInfo?.permissions.includes(Permissions.approveSubs) ||
                              submissionData.newTheme.author.id === accountInfo?.id ? (
                                <>
                                  <button
                                    className={`${
                                      action === "deny" ? "bg-red-500 dark:bg-red-800" : ""
                                    } flex items-center rounded-full border-2 border-borders-base1-light p-2 transition-colors hover:border-borders-base2-light dark:border-borders-base1-dark hover:dark:border-borders-base2-dark`}
                                    onClick={() => {
                                      action !== "deny" ? setAction("deny") : setAction(undefined);
                                    }}
                                  >
                                    <BsXCircleFill size={36} />
                                    <span className="ml-2 mr-1 text-xl font-medium">Deny</span>
                                  </button>
                                </>
                              ) : null}
                            </div>
                            {action && (
                              <>
                                <div className="flex w-full flex-col items-center justify-center gap-4 px-4">
                                  <LabelledTextArea
                                    placeholder="Message Here"
                                    label={
                                      action === "deny" ? "Reason For Denial" : "Leave A Message"
                                    }
                                    value={message}
                                    onValueChange={(e) => setMessage(e)}
                                  />
                                  {accountInfo?.permissions.includes(Permissions.approveSubs) &&
                                    submissionData.newTheme.type === "Audio" &&
                                    action === "deny" && (
                                      <button
                                        onClick={() => {
                                          setMessage(
                                            "We don't accept music packs containing copyright video game OSTs where there is no permission from the developer and/or the developer has not expressed that they are okay with reuploads. If you do have permission, feel free to message a reviewer on Discord."
                                          );
                                        }}
                                        className="w-full rounded-3xl bg-red-300 p-4 dark:bg-red-900"
                                      >
                                        Use Copyright Boilerplate
                                      </button>
                                    )}

                                  <button
                                    className="w-full rounded-3xl bg-brandBlue px-4 py-2"
                                    onClick={submitReview}
                                  >
                                    <span className="text-xl font-medium">Submit Review</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <span>Review Submitted</span>
                  )}
                </>
              </>
            ) : (
              <>
                <div className="flex w-full flex-col items-center pt-4">
                  {submissionData.status === "Approved" && (
                    <div className="flex items-center gap-2 text-5xl">
                      <BsCheckCircleFill className="text-emerald-600" />
                      <span>Approved</span>
                    </div>
                  )}
                  {submissionData.status === "Denied" && (
                    <div className="flex items-center gap-2 text-5xl">
                      <BsXCircleFill className="text-red-500" />
                      <span>Denied</span>
                    </div>
                  )}
                  <div className="mb-2 flex flex-col items-center">
                    {/* <span className="text-2xl font-medium pt-2">Message</span> */}
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
      ) : (
        <span>Error! Invalid Submission ID</span>
      )}
    </>
  );
}
