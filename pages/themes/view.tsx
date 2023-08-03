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
      <div className="flex h-full w-full items-center justify-center px-4">
        <FullThemeCard parsedId={parsedId} />
      </div>
    </>
  );
}
