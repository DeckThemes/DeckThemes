import Link from "next/link";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { Url } from "url";
import {
  FormattedSubmissionIntent,
  FormattedSubmissionStatus,
  ThemeSubmissionInfo,
} from "../../types";
import { CSSMiniThemeCard } from "./CSSMiniThemeCard";

export function CSSMiniSubmissionCard({ data }: { data: ThemeSubmissionInfo }) {
  return (
    <Link
      href={`/submissions/${data.id}`}
      className="flex flex-col items-center transition-all hover:translate-y-1 bg-cardLight dark:bg-cardDark hover:bg-borderLight hover:dark:bg-borderDark p-4 rounded-3xl w-[300px] text-center"
    >
      <span className="text-xl mb-2">{FormattedSubmissionIntent[data.intent]}</span>
      <CSSMiniThemeCard data={data.newTheme} submissionId={data.id} />
      {
        (() => {
          switch (data.status) {
            case "Approved":
              return (
                <>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-xl gap-2 mt-2">
                      <BsCheckCircleFill className="text-emerald-600" />
                      <span>Approved</span>
                    </div>
                    {data?.message ? (
                      <span>
                        <span className="text-textFadedLight dark:text-textFadedDark">
                          Moderator Comment:
                        </span>{" "}
                        {data.message}
                      </span>
                    ) : (
                      <span>No Message Provided</span>
                    )}
                  </div>
                </>
              );
            case "Denied":
              return (
                <>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-xl gap-2 mt-2">
                      <BsXCircleFill className="text-red-500" />
                      <span>Denied</span>
                    </div>
                    {data?.message ? (
                      <>
                        <span>
                          <span className="text-textFadedLight dark:text-textFadedDark">
                            Moderator Comment:
                          </span>{" "}
                          {data.message}
                        </span>
                      </>
                    ) : (
                      <span>No Message Provided</span>
                    )}
                  </div>
                </>
              );
            case "Dead":
              return (
                <>
                  <div>Dead</div>
                </>
              );
            case "AwaitingApproval":
              return (
                <>
                  <div className="flex flex-col items-center">
                    <span>Awaiting Review</span>
                    <span>Submitted On {new Date(data.submitted).toLocaleDateString()}</span>
                  </div>
                </>
              );
            default:
              return null;
          }
        })() // I LOOOOOOOOOOOOOOOOVE self-invoking anonymous functions!
      }
    </Link>
  );
}
