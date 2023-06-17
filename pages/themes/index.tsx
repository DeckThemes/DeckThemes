import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ThemeCategoryDisplay } from "../../components";

export default function Themes() {
  const router = useRouter();
  const [defaults, setDefaults] = useState<
    { defaultFilter: string; defaultOrder: string; defaultType: string } | undefined
  >(undefined);
  useEffect(() => {
    if (router.isReady) {
      let urlFilters, urlOrder, urlType;
      if (typeof router.query?.filters === "string") {
        urlFilters = router.query.filters;
      }
      if (typeof router.query?.order === "string") {
        urlOrder = router.query.order;
      }
      if (typeof router.query?.type === "string") {
        urlType = router.query.type;
      }
      setDefaults({
        defaultFilter: urlFilters || "",
        defaultOrder: urlOrder || "",
        defaultType: urlType || "CSS",
      });
      // This ready here makes sure that themes aren't fetched until the initial url values have been pre-filled
    }
  }, [router.query, router.pathname, router.isReady]);
  return (
    <>
      <Head>
        <title>DeckThemes | CSSLoader Themes</title>
      </Head>
      <main className="flex flex-col items-center">
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-bold text-3xl md:text-5xl pt-4">CSS Themes</h2>
        </div>
        {defaults !== undefined && (
          <ThemeCategoryDisplay
            {...defaults}
            themeDataApiPath="/themes"
            filterDataApiPath="/themes/filters"
            title=""
            typeOptionPreset="Desktop+BPM"
            themesPerPage={24}
            noAuthRequired
            onSearchOptsChange={(searchOpts, type) => {
              router.push(
                {
                  pathname: "/themes",
                  query: { filters: searchOpts.filters, order: searchOpts.order, type: type },
                },
                undefined,
                { shallow: true }
              );
            }}
          />
        )}
      </main>
    </>
  );
}
