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
      {/* <div className="mb-12 flex flex-col items-center">
        <h1 className="pt-4 text-3xl font-extrabold md:text-5xl lg:pt-24">CSS Themes</h1>
      </div> */}
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
                query: {
                  filters: searchOpts.filters,
                  order: searchOpts.order,
                  type: type,
                },
              },
              undefined,
              { shallow: true }
            );
          }}
        />
      )}
    </>
  );
}
