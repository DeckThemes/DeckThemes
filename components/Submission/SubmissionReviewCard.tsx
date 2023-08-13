import { authContext } from "contexts";
import { useContext, useState } from "react";
import { ActionButton } from "./ActionButton";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { ThemeSubmissionInfo } from "@customTypes/CSSThemeTypes";
import { Permissions } from "@customTypes/AccountData";
import { LabelledTextArea, LoadingSpinner } from "..";
import { checkAndRefreshToken, genericFetch } from "apiHelpers";
import { toast } from "react-toastify";

export function SubmissionReviewCard({
  submissionData,
  parsedId,
}: {
  submissionData: ThemeSubmissionInfo;
  parsedId: string;
}) {
  const { accountInfo } = useContext(authContext);
  const [action, setAction] = useState<undefined | "approve" | "deny">(undefined);
  const [message, setMessage] = useState<string>("");
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
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

  if (reviewSubmitted) {
    return <span>Review Submitted</span>;
  }

  return (
    <>
      {submittingReview ? (
        <>
          <LoadingSpinner />
        </>
      ) : (
        <div className="font-fancy flex w-full flex-col items-center gap-2 md:w-1/3">
          <div className="flex gap-8">
            {accountInfo?.permissions.includes(Permissions.approveSubs) && (
              <ActionButton
                selectedAction={action}
                action="approve"
                setAction={setAction}
                icon={<BsCheckCircleFill size={36} />}
              />
            )}
            {accountInfo?.permissions.includes(Permissions.approveSubs) ||
            submissionData.newTheme.author.id === accountInfo?.id ? (
              <>
                <ActionButton
                  selectedAction={action}
                  action="deny"
                  setAction={setAction}
                  icon={<BsXCircleFill size={36} />}
                />
              </>
            ) : null}
          </div>
          {action && (
            <>
              <div className="flex w-full flex-col items-center justify-center gap-4 px-4">
                <LabelledTextArea
                  placeholder="Message Here"
                  label={action === "deny" ? "Reason For Denial" : "Leave A Message"}
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
                  <span className="text-xl font-medium">
                    {!accountInfo?.permissions.includes(Permissions.approveSubs)
                      ? "Deny Theme"
                      : "Submit Review"}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
