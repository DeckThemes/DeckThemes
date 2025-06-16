import { SubmitStepsCarousel } from "@components/Submit/SubmitStepsCarousel";
import { authContext } from "contexts";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext } from "react";
import { toast } from "react-toastify";
import { genericFetch } from "../apiHelpers";
import { LoadingPage, LogInPage } from "../components";
import { useHasCookie } from "../hooks";
import { CSSSubmissionInfo, GitSubmissionInfo, MetaInfo, ZipSubmissionInfo } from "../types";

export default function Submit() {
  const router = useRouter();

  const hasCookie = useHasCookie();
  const { accountInfo } = useContext(authContext);

  async function submitTheme(
    uploadType: "css" | "audio",
    uploadMethod: string,
    uploadInfo: GitSubmissionInfo | CSSSubmissionInfo | ZipSubmissionInfo,
    metaInfo: MetaInfo
  ) {
    const formattedMeta = {
      imageBlobs: metaInfo.imageBlobs.filter(Boolean),
      description: metaInfo.description || null,
      target: metaInfo.target !== "None" ? metaInfo.target : null,
    };

    if (formattedMeta.imageBlobs.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    genericFetch(`/submissions/${uploadType}_${uploadMethod}`, {
      method: "POST",
      body: JSON.stringify({ ...uploadInfo, meta: formattedMeta }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((json) => {
        process.env.NEXT_PUBLIC_DEV_MODE === "true" && console.log(json);
        if (json?.task) {
          router.push(`/taskStatus/view?task=${json.task}`);
        } else {
          alert(`Error Submitting Theme, No Task Returned: ${json?.message || "Unknown Error"}`);
          throw new Error("No task in response");
        }
      })
      .catch((err) => {
        toast.error(
          `Error Submitting Theme, Request Failed: ${JSON.stringify(
            err instanceof Error ? err.message : err
          )}`
        );
        console.error("Error Submitting Theme:", err);
      });
  }

  if (accountInfo?.username) {
    return (
      <>
        <Head>
          <title>DeckThemes | Submit</title>
        </Head>
        <style>
          {`
          .dark .filepond--panel-root {
            background-color: hsla(220, 9%, 60%, 0.1);
          }

          .dark .filepond--drop-label {
            color: #fff;
          }

		      .dark .filepond--panel-root {
		      	background: transparent;
		      }
        
	    	  .filepond--credits {
	    	  	display: none !important;
	    	  }

		      .dark .filepond--root {
	     	  	background: #1e2024;
	    	  	border-radius: 12px;
		      }
          `}
        </style>
        {router?.query?.update && (
          <div className="text-lg font-bold">
            <span className="">
              To update a theme, submit a new theme with the same name as the original
            </span>
          </div>
        )}
        <div className="m-4 rounded-xl bg-cardLight px-4 py-2 text-xl transition-colors hover:bg-borderLight dark:bg-cardDark hover:dark:bg-borderDark">
          <a
            href={process.env.NEXT_PUBLIC_DOCS_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-3xl bg-gradient-to-tl from-blue-800 to-blue-500 bg-clip-text p-1 text-transparent"
          >
            <span className="text-textLight dark:text-textDark">Need help? </span>
            <br className="flex md:hidden" />
            View the docs <br className="flex md:hidden" />
            <span className="text-textLight dark:text-textDark">
              for guides, documentation, and tools!
            </span>
          </a>
        </div>
        <SubmitStepsCarousel submitTheme={submitTheme} />
      </>
    );
  }
  if (hasCookie) {
    return <LoadingPage />;
  }
  return <LogInPage />;
}
