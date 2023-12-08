import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ThemeCategoryDisplay } from "../../components";

export default function Packs() {
  const router = useRouter();
  const [defaults, setDefaults] = useState<
    { defaultFilter: string; defaultOrder: string } | undefined
  >(undefined);
  useEffect(() => {
    if (router.isReady) {
      let urlFilters, urlOrder;
      if (typeof router.query?.filters === "string") {
        urlFilters = router.query.filters;
      }
      if (typeof router.query?.order === "string") {
        urlOrder = router.query.order;
      }
      setDefaults({
        defaultFilter: urlFilters || "",
        defaultOrder: urlOrder || "",
      });
      // This ready here makes sure that themes aren't fetched until the initial url values have been pre-filled
    }
  }, [router.query, router.pathname, router.isReady]);
  return (
    <>
      <Head>
        <title>DeckThemes | Audio Loader Packs</title>
      </Head>
      {defaults !== undefined && (
        <ThemeCategoryDisplay
          {...defaults}
          themeDataApiPath="/themes"
          filterDataApiPath="/themes/filters"
          title=""
          defaultType="AUDIO"
          themesPerPage={24}
          noAuthRequired
          onSearchOptsChange={(searchOpts, type) => {
            router.push(
              {
                pathname: "/packs",
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
