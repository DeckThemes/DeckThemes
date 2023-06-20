import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { ImSpinner5 } from "react-icons/im";
import { toast } from "react-toastify";
import { checkAndRefreshToken } from "../../apiHelpers";
import { TaskQueryResponse } from "../../types";

export default function TaskView() {
  const router = useRouter();
  let { task } = router.query;

  const [apiStatus, setStatus] = useState<TaskQueryResponse | null>(null);
  async function getStatus() {
    if (task) {
      const waitForRefresh = await checkAndRefreshToken();
      if (waitForRefresh) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${task}`, {
          method: "GET",
          credentials: "include",
        })
          .then((res) => {
            process.env.NEXT_PUBLIC_DEV_MODE === "true" && console.log(res);
            if (res.status < 200 || res.status >= 300 || !res.ok) {
              throw new Error("Response Not OK");
            }
            return res.json();
          })
          .then((json) => {
            setStatus(json);
          })
          .catch((err) => {
            toast.error(`Error Submitting Theme! ${JSON.stringify(err)}`);
            console.error("Error Submitting Theme!", err);
          });
      }
    }
  }
  useEffect(() => {
    if (apiStatus?.completed === null) {
      setTimeout(() => {
        getStatus();
      }, 1000);
    }
  }, [apiStatus]);

  useEffect(() => {
    getStatus();
    // See above
  }, [task]);

  function convertToPascalCase(str: string) {
    return str
      .split(" ")
      .map((e) => e[0].toUpperCase() + e.slice(1))
      .join(" ");
  }

  return (
    <>
      <Head>
        <title>DeckThemes | Task Status</title>
      </Head>
      <main className="flex flex-grow flex-col items-center justify-center p-4">
        {typeof task === "string" ? (
          <>
            {apiStatus ? (
              <div className="flex flex-col items-center text-center">
                <div className="mb-8 flex flex-col items-center">
                  <span className="text-2xl font-semibold md:text-3xl">
                    {convertToPascalCase(apiStatus.name)}
                  </span>
                  <span className="text-xl font-medium">
                    Task {task?.split("-")[0]}
                  </span>
                </div>
                {apiStatus.completed ? (
                  <>
                    <div className="mb-4">
                      {apiStatus.success ? (
                        <div className="flex items-center gap-2 text-5xl">
                          <BsCheckCircleFill className="text-emerald-600" />
                          <span>Success</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-5xl">
                          <BsXCircleFill className="text-red-500" />
                          <span>Failed</span>
                        </div>
                      )}
                    </div>
                    <span className="text-lg">
                      {apiStatus?.success ? "Completed " : "Failed "}In{" "}
                      <b>
                        {(new Date(apiStatus.completed).valueOf() -
                          new Date(apiStatus.started).valueOf()) /
                          1000}{" "}
                      </b>
                      Seconds
                    </span>
                    {!apiStatus.success && (
                      <span>{convertToPascalCase(apiStatus.status)}</span>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-5xl">
                      <ImSpinner5 className="animate-spin text-amber-600" />
                      <span>Processing</span>
                    </div>
                    <span>{apiStatus.status}</span>
                  </>
                )}
                <div className="m-4 rounded-xl bg-cardLight px-4 py-2 text-xl transition-colors hover:bg-borderLight dark:bg-cardDark hover:dark:bg-borderDark">
                  <a
                    href="https://discord.gg/zSyf5GgdQY"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-3xl bg-gradient-to-tl from-violet-800 to-violet-500 bg-clip-text p-1 text-transparent"
                  >
                    Join our Discord <br className="flex md:hidden" />
                    <span className="text-textLight dark:text-textDark">
                      to keep updated on your submission&apos;s status!
                    </span>
                  </a>
                </div>
              </div>
            ) : (
              <>
                <span>Loading</span>
              </>
            )}
          </>
        ) : (
          <h1>Error! Task not a string</h1>
        )}
      </main>
    </>
  );
}
