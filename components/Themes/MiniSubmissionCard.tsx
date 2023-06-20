import Link from "next/link";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import {
  FormattedSubmissionIntent,
  FormattedSubmissionIntentAudio,
  ThemeSubmissionInfo,
} from "../../types";
import { MiniThemeCardRoot } from ".";

export function MiniSubmissionCard({ data }: { data: ThemeSubmissionInfo }) {
  return (
    <Link
      href={`/submissions/view?submissionId=${data.id}`}
      className="flex flex-col items-center rounded-xl border-2 border-borders-base1-light bg-cardLight p-4 text-center transition hover:border-borders-base2-light hover:bg-borderLight dark:border-borders-base1-dark dark:bg-base-5-dark hover:dark:border-borders-base2-dark hover:dark:bg-borderDark"
    >
      <span className="mb-2 text-xl">
        {data.newTheme.type === "Audio"
          ? FormattedSubmissionIntentAudio[data.intent]
          : FormattedSubmissionIntent[data.intent]}
      </span>
      <MiniThemeCardRoot data={data.newTheme} submissionId={data.id} />
      <div className="flex flex-col items-center">
        {(data.status === "Approved" || data.status === "Denied") && (
          <>
            <div className="mt-2 flex items-center gap-2 text-xl">
              {data.status === "Approved" ? (
                <BsCheckCircleFill className="text-emerald-600" />
              ) : (
                <BsXCircleFill className="text-red-500" />
              )}
              <span>{data.status}</span>
            </div>
            {data?.message ? (
              <span className="break-all">
                <span className="text-textFadedLight dark:text-textFadedDark">
                  Moderator Comment:
                </span>{" "}
                {data.message}
              </span>
            ) : (
              <span>No Message Provided</span>
            )}
          </>
        )}
        {data.status === "AwaitingApproval" && (
          <>
            <span>Awaiting Review</span>
            <span>
              Submitted On {new Date(data.submitted).toLocaleDateString()}
            </span>
            {data?.errors && data.errors.length > 0 ? (
              <>
                <span>
                  {data.errors.length} Error
                  {data.errors.length === 1 ? "" : "s"}
                </span>
              </>
            ) : (
              // TODO: put something here for audio packs or make it stretch
              <>
                {data.newTheme.type === "Audio" ? (
                  <span>No Errors</span>
                ) : (
                  <span>No Errors</span>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
