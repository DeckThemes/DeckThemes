import { useState, useEffect, useContext, useCallback } from "react";
import { generateParamStr, genericGET } from "../../api";
import { authContext } from "../../pages/_app";
import {
  FilterQueryResponse,
  ThemeQueryRequest,
  ThemeQueryResponse,
  ThemeSubmissionQueryResponse,
} from "../../types";
import {
  FilterSelectorCard,
  LoadMoreButton,
  MiniSubmissionCard,
  MiniThemeCardRoot,
} from "../Themes";

export function UserThemeCategoryDisplay({
  themeDataApiPath,
  filterDataApiPath,
  title,
  useSubmissionCards,
  addPluginChoice,
  themesPerPage = 5,
  defaultFilter = "",
  noAuthRequired = false,
}: {
  themeDataApiPath: string;
  filterDataApiPath: string;
  title: string;
  useSubmissionCards?: boolean;
  addPluginChoice?: boolean;
  themesPerPage?: number;
  defaultFilter?: string;
  noAuthRequired?: boolean;
}) {
  const { accountInfo } = useContext(authContext);

  const [serverFilters, setServerFilters] = useState<FilterQueryResponse>({
    filters: [],
    order: [],
  });
  const [searchOpts, setSearchOpts] = useState<ThemeQueryRequest>({
    page: 1,
    perPage: themesPerPage,
    filters: defaultFilter,
    order: "",
    search: "",
  });
  const [themeData, setThemeData] = useState<ThemeQueryResponse | ThemeSubmissionQueryResponse>({
    total: 0,
    items: [],
  });
  const [cssOrAudio, setCSSAudio] = useState<"CSS" | "AUDIO" | "" | undefined>(
    addPluginChoice ? "" : undefined
  );

  function fetchNewData() {
    // Submissions should include both, which to the api is an empty string
    const prependValue = addPluginChoice ? `${cssOrAudio}.` : useSubmissionCards ? "" : "CSS.";
    // This just changes "All" to "", as that is what the backend looks for
    const searchOptStr = generateParamStr(
      searchOpts.filters !== "All" ? searchOpts : { ...searchOpts, filters: "" },
      prependValue
    );
    genericGET(`${themeDataApiPath}${searchOptStr}`).then((data) => {
      if (data) {
        setThemeData(data);
      }
    });
  }

  useEffect(() => {
    if (accountInfo?.username || noAuthRequired) {
      fetchNewData();
    }
  }, [searchOpts, accountInfo, cssOrAudio]);

  useEffect(() => {
    if (accountInfo?.id) {
      genericGET(
        `${filterDataApiPath}?target=${cssOrAudio !== undefined ? cssOrAudio : "CSS"}`
      ).then((data) => {
        if (data) {
          setServerFilters(data);
        }
      });
    }
  }, [accountInfo, cssOrAudio]);

  useEffect(() => {
    // This ensures if you switch from themes to packs or vice versa, that it resets your filter so that you see all entries again
    if (
      cssOrAudio === "CSS" &&
      (searchOpts.filters === "Music" || searchOpts.filters === "Audio")
    ) {
      setSearchOpts({ ...searchOpts, filters: "All" });
    }

    if (cssOrAudio === "AUDIO" && searchOpts.filters !== "All") {
      setSearchOpts({ ...searchOpts, filters: "All" });
    }
  }, [cssOrAudio]);

  return (
    <>
      {themeData.total >= 0 ? (
        <div className="flex flex-col w-full items-center px-4">
          <h4 className="text-2xl font-medium">{title}</h4>
          <FilterSelectorCard
            filterOpts={serverFilters.filters}
            onFilterChange={(e) => {
              setSearchOpts({ ...searchOpts, filters: e.target.value });
            }}
            filterValue={searchOpts.filters}
            orderOpts={serverFilters.order}
            onOrderChange={(e) => {
              setSearchOpts({ ...searchOpts, order: e.target.value });
            }}
            orderValue={searchOpts.order}
            searchValue={searchOpts.search}
            onSearchChange={(e) => {
              setSearchOpts({ ...searchOpts, search: e.target.value });
            }}
            cssOrAudioValue={cssOrAudio}
            onCSSAudioChange={(e) => {
              setCSSAudio(e.target.value);
            }}
          />
          <div className="flex md:flex-row w-full justify-center items-center flex-wrap gap-4">
            {themeData.total === 0 && (
              <span>No {cssOrAudio === "AUDIO" ? "Packs" : "Themes"} Found</span>
            )}
            {useSubmissionCards ? (
              <>
                {themeData.items.map((e, i) => {
                  //   This gives type errors bcus the fetch type is "Themes | Submissions", and despite the fact that I check for themes or submissions here, ts doesn't know that
                  // @ts-ignore
                  return <MiniSubmissionCard data={e} key={`Approved Theme ${i}`} />;
                })}
              </>
            ) : (
              <>
                {themeData.items.map((e, i) => {
                  // @ts-ignore
                  return <MiniThemeCardRoot data={e} key={`Approved Theme ${i}`} />;
                })}
              </>
            )}
          </div>
          <div className="mt-4 mx-4">
            <LoadMoreButton
              themeArr={themeData}
              setThemeArr={setThemeData}
              fetchPath={themeDataApiPath}
              paramStrFilterPrepend={
                addPluginChoice ? `${cssOrAudio}.` : useSubmissionCards ? "" : "CSS."
              }
              origSearchOpts={searchOpts}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
