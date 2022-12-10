import { useRouter } from "next/router";
import { CSSFullThemeCard } from "../../components";

export default function FullThemeViewPage() {
  const router = useRouter();
  let { themeId } = router.query;
  let parsedId: string = "";
  // this is here because for some reason @types/next thinks that router.query can be an array of strings
  if (Array.isArray(themeId)) {
    parsedId = themeId[0];
  } else {
    parsedId = themeId || "";
  }

  return (
    <main>
      <CSSFullThemeCard parsedId={parsedId} />
    </main>
  );
}
