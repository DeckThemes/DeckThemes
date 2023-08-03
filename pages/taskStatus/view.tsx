import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { ImSpinner5 } from "react-icons/im";
import { toast } from "react-toastify";
import { checkAndRefreshToken, genericGET } from "../../apiHelpers";
import { TaskQueryResponse } from "../../types";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function TaskView() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  let { task } = router.query;

  const [apiStatus, setStatus] = useState<TaskQueryResponse | null>(null);
  async function getStatus() {
    if (task) {
      const waitForRefresh = await checkAndRefreshToken();
      if (waitForRefresh) {
        genericGET(`/tasks/${task}`)
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
  }, [task]);

  return (
    <>
      <Head>
        <title>DeckThemes | Task Status</title>
      </Head>
      {typeof task === "string" ? (
        <>
          {apiStatus ? (
            <div className="flex flex-col items-center text-center">
              <div className="mb-8 flex flex-col items-center">
                <span className="text-2xl font-semibold capitalize md:text-3xl">
                  {apiStatus.name}
                </span>
                <span className="text-xl font-medium">Task {task?.split("-")[0]}</span>
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
                  {!apiStatus.success && <span>{apiStatus.status}</span>}
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
              <a
                href="https://discord.gg/zSyf5GgdQY"
                target="_blank"
                rel="noreferrer"
                className="m-4 flex items-center justify-center gap-4 rounded-xl bg-base-3-light px-4 py-2 text-left text-xl transition-colors hover:bg-base-4-light dark:bg-base-3-dark dark:hover:bg-base-4-dark"
              >
                <Image
                  alt="Discord Logo"
                  height="32"
                  width="32"
                  src={`https://cdn.simpleicons.org/discord/${
                    resolvedTheme === "light" ? "black" : "white"
                  }`}
                />
                <span className="text-md rounded-3xl">
                  Join our Discord for support and updates on your submission
                </span>
              </a>
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
    </>
  );
}
