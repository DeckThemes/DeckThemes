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
        defaultType: urlType || "",
      });
      // This ready here makes sure that themes aren't fetched until the initial url values have been pre-filled
    }
  }, [router.query, router.pathname, router.isReady]);
  return (
    <>
      <Head>
        <title>DeckThemes | CSSLoader Themes</title>
      </Head>
      <main className="flex flex-col items-center page-shadow border-[1px] border-borders-base1-light bg-base-2-light dark:border-borders-base1-dark dark:bg-base-2-dark py-12 mx-4 rounded-3xl">
        <div className="flex flex-col items-center mb-12">
          <h1 className="font-extrabold text-3xl md:text-5xl pt-4 lg:pt-24">CSS Themes</h1>
        </div>
        {defaults !== undefined && (
          <ThemeCategoryDisplay
            {...defaults}
            themeDataApiPath="/themes"
            filterDataApiPath="/themes/filters"
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
