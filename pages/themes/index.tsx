import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { generateThemeParamStr, genericGET } from "../../api";
import {
  MiniThemeCardRoot,
  FilterSelectorCard,
  LoadingSpinner,
  LoadMoreButton,
} from "../../components";
import { FilterQueryResponse, ThemeQueryRequest, ThemeQueryResponse } from "../../types";

export default function Themes() {
  const router = useRouter();

  const [themeArr, setThemeArr] = useState<ThemeQueryResponse>({ total: 0, items: [] });
  const [loaded, setLoaded] = useState<boolean>(false);

  const [ready, setReady] = useState<boolean>(false);

  const [serverSearchOpts, setServerSearchOpts] = useState<FilterQueryResponse>({
    filters: [],
    order: [],
  });
  const [chosenSearchOpts, setChosenSearchOpts] = useState<ThemeQueryRequest>({
    page: 1,
    perPage: 25,
    filters: "",
    order: "",
    search: "",
  });
  useEffect(() => {
    if (ready) {
      // This just changes "All" to "", as that is what the backend looks for
      const searchOpts = generateThemeParamStr(chosenSearchOpts, "CSS.");
      genericGET(`/themes${searchOpts}`, true).then((data) => {
        if (data) {
          setThemeArr(data);
        }
        setLoaded(true);
      });
    }

    // if (loaded) {
    // let stateObj = { id: "100" };
    // window.history.pushState(
    //   stateObj,
    //   "unused",
    //   `/themes${
    //     chosenSearchOpts.filters !== "All" && chosenSearchOpts.filters !== ""
    //       ? `?filters=${chosenSearchOpts.filters}${
    //           chosenSearchOpts.order !== "Alphabetical (A to Z)"
    //             ? `&order=${chosenSearchOpts.order}`
    //             : ""
    //         }`
    //       : `${
    //           chosenSearchOpts.order !== "Alphabetical (A to Z)"
    //             ? `?order=${chosenSearchOpts.order}`
    //             : ""
    //         }`
    //   }`
    // );
    // }
  }, [chosenSearchOpts, ready]);

  useEffect(() => {
    genericGET("/themes/filters?target=CSS").then((filterData) => {
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
        <title>DeckThemes | CSSLoader Themes</title>
      </Head>
      <main className="flex flex-col items-center">
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-bold text-3xl md:text-5xl pt-4">CSS Themes</h2>
          <FilterSelectorCard
            filterOpts={serverSearchOpts.filters}
            onFilterChange={(e) => {
              setChosenSearchOpts({ ...chosenSearchOpts, filters: e.target.value });
            }}
            filterValue={chosenSearchOpts.filters}
            orderOpts={serverSearchOpts.order}
            onOrderChange={(e) => {
              setChosenSearchOpts({ ...chosenSearchOpts, order: e.target.value });
            }}
            orderValue={chosenSearchOpts.order}
            searchValue={chosenSearchOpts.search}
            onSearchChange={(e) => {
              setChosenSearchOpts({ ...chosenSearchOpts, search: e.target.value });
            }}
          />
          {themeArr.total > 0 ? (
            <>
              <div className="flex gap-4 flex-wrap items-center justify-center px-10">
                {themeArr.items.map((e) => {
                  return <MiniThemeCardRoot data={e} key={`ThemeCard ${e.id}`} />;
                })}
              </div>

              <div className="mt-4">
                <LoadMoreButton
                  themeArr={themeArr}
                  setThemeArr={setThemeArr}
                  paramStrFilterPrepend="CSS."
                  fetchPath="/themes"
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
