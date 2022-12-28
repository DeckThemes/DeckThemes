import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { checkAndRefreshToken, fetchWithRefresh, genericGET } from "../../api";
import { FullThemeCard, MiniPfpDisplay, PfpDisplay } from "../../components";
import { Permissions, ThemeSubmissionInfo } from "../../types";
import { authContext } from "../_app";

export default function FullSubmissionViewPage() {
  const { accountInfo } = useContext(authContext);
  const router = useRouter();
  let { submissionId } = router.query;
  let parsedId: string = "";
  // this is here because for some reason @types/next thinks that router.query can be an array of strings
  if (Array.isArray(submissionId)) {
    parsedId = submissionId[0];
  } else {
    parsedId = submissionId || "";
  }

  async function submitReview() {
    if (action) {
      const waitForRefresh = await checkAndRefreshToken();
      if (waitForRefresh) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions/${parsedId}/${action}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
          }),
        })
          .then((res) => {
            if (res.ok && res.status === 200) {
              setReviewSubmitted(true);
              return;
            }
            throw new Error("Res Not OK!");
          })
          .catch((err) => {
            console.error("Error Submitting Theme Review!", err);
            alert("Error Submitting Theme Review");
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
      const data = await genericGET(`/submissions/${parsedId}`, true);
      setSubData(data);
    }
    if (parsedId) {
      getData();
    }
  }, [parsedId]);

  return (
    <>
      <Head>
        <title>DeckThemes | Submission Viewer</title>
      </Head>
      {submissionData ? (
        <>
          <main className="w-full flex flex-col flex-grow items-center">
            <div className="flex flex-col w-full items-center">
              <span className="text-3xl md:text-4xl font-semibold mt-4 -mb-4">
                {/* This regex just adds a space before every capital letter to make it look like a normal sentence */}
                {submissionData.intent.replace(/([A-Z])/g, " $1")}
              </span>
              <FullThemeCard parsedId={submissionData.newTheme.id} />
            </div>
            <div className="flex flex-col w-full items-center">
              <span className="text-3xl md:text-4xl font-semibold my-4 border-b-4 border-textLight dark:border-textDark">
                Submission Info
              </span>
              {submissionData.status === "AwaitingApproval" ? (
                <>
                  <div className="flex flex-col items-center mb-4">
                    {submissionData.errors && submissionData.errors.length > 0 ? (
                      <>
                        <span className="text-2xl">Errors:</span>
                        <div className="flex flex-col items-center text-center overflow-y-scroll max-h-64 border-4 border-borderLight dark:border-borderDark rounded-3xl px-8">
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
                  <>
                    {!reviewSubmitted ? (
                      <div className="flex flex-col gap-2 items-center">
                        <div className="flex gap-2">
                          {accountInfo?.permissions.includes(Permissions.approveSubs) && (
                            <button
                              className={`${
                                action === "approve"
                                  ? "bg-emerald-600"
                                  : "bg-cardLight dark:bg-cardDark"
                              } p-2 flex items-center rounded-full transition-colors`}
                              onClick={() => {
                                action !== "approve" ? setAction("approve") : setAction(undefined);
                              }}
                            >
                              <BsCheckCircleFill size={36} />
                              <span className="text-xl font-medium ml-2 mr-1">Approve</span>
                            </button>
                          )}
                          {accountInfo?.permissions.includes(Permissions.approveSubs) ||
                          submissionData.newTheme.author.id === accountInfo?.id ? (
                            <>
                              <button
                                className={`${
                                  action === "deny" ? "bg-red-500" : "bg-cardLight dark:bg-cardDark"
                                } p-2 flex items-center rounded-full transition-colors`}
                                onClick={() => {
                                  action !== "deny" ? setAction("deny") : setAction(undefined);
                                }}
                              >
                                <BsXCircleFill size={36} />
                                <span className="text-xl font-medium ml-2 mr-1">Deny</span>
                              </button>
                            </>
                          ) : null}
                        </div>
                        {action && (
                          <>
                            <div className="flex flex-col gap-2 items-center border-4 border-borderLight dark:border-borderDark p-4 rounded-3xl">
                              <span className="text-xl font-medium">
                                {action === "deny" ? "Reason For Denial" : "Leave A Message"}
                              </span>
                              <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="bg-cardLight dark:bg-cardDark p-2 rounded-3xl px-4"
                              />
                            </div>
                            <button className="bg-amber-500 p-4 rounded-3xl" onClick={submitReview}>
                              <span className="text-xl font-medium">Submit Review</span>
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <span>Review Submitted</span>
                    )}
                  </>
                </>
              ) : (
                <>
                  <div className="flex flex-col w-full pt-4 items-center">
                    {submissionData.status === "Approved" && (
                      <div className="flex items-center text-5xl gap-2">
                        <BsCheckCircleFill className="text-emerald-600" />
                        <span>Approved</span>
                      </div>
                    )}
                    {submissionData.status === "Denied" && (
                      <div className="flex items-center text-5xl gap-2">
                        <BsXCircleFill className="text-red-500" />
                        <span>Denied</span>
                      </div>
                    )}
                    <div className="flex flex-col mb-2 items-center">
                      {/* <span className="text-2xl font-medium pt-2">Message</span> */}
                      <span className="text-xl py-2">{submissionData.message}</span>
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
          </main>
        </>
      ) : (
        <span>Error! Invalid Submission ID</span>
      )}
    </>
  );
}
