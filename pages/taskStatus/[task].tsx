import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { ImSpinner5 } from "react-icons/im";
import { checkAndRefreshToken } from "../../api";
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

  function capitalizeSuchMemesShit(str: string) {
    return str
      .split(" ")
      .map((e, i, arr) => e[0].toUpperCase() + e.slice(1) + " ")
      .join("")
      .slice(0, -1);
  }

  return (
    <>
      <Head>
        <title>DeckThemes | Task Status</title>
      </Head>
      <main className="flex flex-col items-center p-4">
        {typeof task === "string" ? (
          <>
            {apiStatus ? (
              <div className="flex flex-col items-center text-center">
                <div className="flex flex-col items-center mb-8">
                  <span className="text-2xl md:text-3xl font-semibold">
                    {capitalizeSuchMemesShit(apiStatus.name)}
                  </span>
                  <span className="text-xl font-medium">Task {task?.split("-")[0]}</span>
                </div>
                {apiStatus.completed ? (
                  <>
                    <div className="mb-4">
                      {apiStatus.success ? (
                        <div className="flex items-center text-5xl gap-2">
                          <BsCheckCircleFill className="text-emerald-600" />
                          <span>Success</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-5xl gap-2">
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
                    {!apiStatus.success && <span>{capitalizeSuchMemesShit(apiStatus.status)}</span>}
                  </>
                ) : (
                  <>
                    <div className="flex items-center text-5xl gap-2">
                      <ImSpinner5 className="text-amber-600 animate-spin" />
                      <span>Processing</span>
                    </div>
                  </>
                )}
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
