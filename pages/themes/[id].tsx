import { useRouter } from "next/router";
import { CSSFullThemeCard } from "../../components";

export default function FullThemeViewPage() {
  const router = useRouter();
  let { id } = router.query;
  let parsedId: string = "";
  // this is here because for some reason @types/next thinks that router.query can be an array of strings
  if (Array.isArray(id)) {
    parsedId = id[0];
  } else {
    parsedId = id || "";
  }

  return (
    <main>
      <CSSFullThemeCard parsedId={parsedId} />
    </main>
  );
}
