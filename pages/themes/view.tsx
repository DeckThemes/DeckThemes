import { useRouter } from "next/router";
import { FullThemeCard, LoadingSpinner } from "../../components";
import { useState, useEffect, useContext } from "react";
import { desktopModeContext } from "contexts";

export default function FullThemeViewPage() {
  const { desktopMode } = useContext(desktopModeContext);
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
      <main
        className={`flex flex-col items-center dark:bg-base-2-dark ${
          desktopMode
            ? "py-24"
            : "page-shadow mx-4 rounded-3xl  border-[1px] border-borders-base3-light py-12 dark:border-borders-base1-dark"
        }`}
      >
        <FullThemeCard parsedId={parsedId} />
      </main>
    </>
  );
}
