import { useRouter } from "next/router";
import { FullThemeCard, LoadingSpinner } from "../../components";
import { useState, useEffect } from "react";
import Head from "next/head";

export default function FullThemeViewPage() {
  const router = useRouter();
  let { themeId } = router.query;
  const [parsedId, setParsedId] = useState<string>("");

  useEffect(() => {
    console.log(themeId);
    // this is here because for some reason @types/next thinks that router.query can be an array of strings
    if (Array.isArray(themeId)) {
      setParsedId(themeId[0]);
    } else {
      setParsedId(themeId || "");
    }
  }, [themeId]);

  if (!parsedId) {
    return (
      <main className="flex w-full flex-grow items-center justify-center">
        <span className="text-3xl">No Theme Found</span>
      </main>
    );
  }

  return (
    <>
      <main className="page-shadow mx-4 flex flex-col items-center rounded-3xl border-[1px] py-12 dark:border-borders-base1-dark dark:bg-base-2-dark">
        <FullThemeCard parsedId={parsedId} />
      </main>
    </>
  );
}
