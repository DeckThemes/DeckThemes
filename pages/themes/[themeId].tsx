import Head from "next/head";
import { useRouter } from "next/router";
import { CSSFullThemeCard, LoadingSpinner } from "../../components";

export async function getStaticPaths() {
  // const data = fetch("https://api.deckthemes.com/themes?perPage=1000")
  //   .then((res) => res.json())
  //   .then((json) => {
  //     return json.items.map((e) => e.id);
  //   });
  return {
    paths: [],
    fallback: "blocking",
  };
}

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

  if (!parsedId) {
    return (
      <main className="w-full flex-grow flex items-center justify-center">
        <span className="text-3xl">No Theme Found</span>
      </main>
    );
  }

  return (
    <>
      <main>
        <CSSFullThemeCard parsedId={parsedId} />
      </main>
    </>
  );
}
