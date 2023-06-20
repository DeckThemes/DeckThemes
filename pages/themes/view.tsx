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
      <main className="w-full flex-grow flex items-center justify-center">
        <span className="text-3xl">No Theme Found</span>
      </main>
    );
  }

  return (
    <>
      <main className="flex flex-col items-center page-shadow border-[1px] dark:border-borders-base1-dark dark:bg-base-2-dark py-12 mx-4 rounded-3xl">
        <FullThemeCard parsedId={parsedId} />
      </main>
    </>
  );
}
