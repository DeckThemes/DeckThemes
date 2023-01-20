import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { generateThemeParamStr, genericGET } from "../../api";
import {
  FilterSelectorCard,
  LoadingSpinner,
  LoadMoreButton,
  MiniThemeCardRoot,
} from "../../components";
import { FilterQueryResponse, ThemeQueryRequest, ThemeQueryResponse } from "../../types";

export default function Themes() {
  const router = useRouter();

  const [themeArr, setThemeArr] = useState<ThemeQueryResponse>({ total: 0, items: [] });
  const [loaded, setLoaded] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(true);

  const [serverSearchOpts, setServerSearchOpts] = useState<FilterQueryResponse>({
    filters: [],
    order: [],
  });
  const [chosenSearchOpts, setChosenSearchOpts] = useState<ThemeQueryRequest>({
    page: 1,
    perPage: 24,
    filters: "",
    order: "",
    search: "",
  });
  useEffect(() => {
    if (ready) {
      const searchOpts = generateThemeParamStr(chosenSearchOpts, "AUDIO.");
      genericGET(`/themes${searchOpts}`).then((data) => {
        if (data) {
          setThemeArr(data);
        }
        setLoaded(true);
      });
    }
  }, [chosenSearchOpts, ready]);

  useEffect(() => {
    genericGET("/themes/filters?type=AUDIO").then((filterData) => {
      if (filterData) {
        setServerSearchOpts(filterData);
      }
    });
    if (router.isReady) {
      let urlFilters, urlOrder;
      if (typeof router.query?.filters === "string") {
        urlFilters = router.query.filters;
      }
      if (typeof router.query?.order === "string") {
        urlOrder = router.query.order;
      }
      setChosenSearchOpts({
        ...chosenSearchOpts,
        filters: urlFilters || "",
        order: urlOrder || "",
      });
      // This ready here makes sure that themes aren't fetched until the initial url values have been pre-filled
      setReady(true);
    }
  }, [router.query, router.pathname, router.isReady]);

  return (
    <>
      <Head>
        <title>DeckThemes | AudioLoader Packs</title>
      </Head>
      <main className="flex flex-col items-center">
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-bold text-3xl md:text-5xl pt-4">Audio Packs</h2>
          <FilterSelectorCard
            filterOpts={serverSearchOpts.filters}
            onFilterChange={(e) => {
              const newFilters = e.target.value;
              router.push(
                {
                  pathname: "/packs",
                  query: { filters: newFilters, order: chosenSearchOpts.order },
                },
                undefined,
                { shallow: true }
              );
              setChosenSearchOpts({ ...chosenSearchOpts, filters: newFilters });
            }}
            filterValue={chosenSearchOpts.filters}
            orderOpts={serverSearchOpts.order}
            onOrderChange={(e) => {
              const newOrder = e.target.value;
              router.push(
                {
                  pathname: "/packs",
                  query: { filters: chosenSearchOpts.filters, order: newOrder },
                },
                undefined,
                { shallow: true }
              );
              setChosenSearchOpts({ ...chosenSearchOpts, order: newOrder });
            }}
            orderValue={chosenSearchOpts.order}
            searchValue={chosenSearchOpts.search}
            onSearchChange={(e) => {
              setChosenSearchOpts({ ...chosenSearchOpts, search: e.target.value });
            }}
          />
          {themeArr.total > 0 ? (
            <>
              <div className="flex gap-4 flex-wrap items-center justify-center px-1 sm:px-10">
                {themeArr.items.map((e) => {
                  return <MiniThemeCardRoot data={e} key={`ThemeCard ${e.id}`} />;
                })}
              </div>
              <div className="mt-4 mx-4">
                <LoadMoreButton
                  fetchPath="/themes"
                  paramStrFilterPrepend="AUDIO."
                  themeArr={themeArr}
                  setThemeArr={setThemeArr}
                  origSearchOpts={chosenSearchOpts}
                />
              </div>
            </>
          ) : (
            <>
              {loaded ? (
                <span className="pt-10 text-xl text-red-500">No Themes Found</span>
              ) : (
                <div className="flex items-center text-4xl gap-2 pt-10">
                  <LoadingSpinner />
                  <span>Loading</span>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
