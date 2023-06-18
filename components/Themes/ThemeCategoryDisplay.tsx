import { useState, useEffect, useContext } from "react";
import { generateParamStr, genericGET } from "../../apiHelpers";
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
  TypeOptionPreset,
  typePresets,
} from ".";

export function ThemeCategoryDisplay({
  themeDataApiPath,
  filterDataApiPath,
  title,
  useSubmissionCards,
  typeOptionPreset = "None",
  themesPerPage = 5,
  defaultFilter = "",
  defaultOrder = "",
  defaultType = "",
  noAuthRequired = false,
  showFiltersWithZero = false,
  onSearchOptsChange = () => {},
}: {
  themeDataApiPath: string;
  filterDataApiPath: string;
  title: string;
  typeOptionPreset?: TypeOptionPreset;
  useSubmissionCards?: boolean;
  themesPerPage?: number;
  defaultFilter?: string;
  defaultOrder?: string;
  defaultType?: string;
  noAuthRequired?: boolean;
  showFiltersWithZero?: boolean;
  onSearchOptsChange?: (searchOpts: any, type: any) => void;
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
    order: defaultOrder,
    search: "",
  });
  const [themeData, setThemeData] = useState<ThemeQueryResponse | ThemeSubmissionQueryResponse>({
    total: 0,
    items: [],
  });
  const [type, setType] = useState<string>(defaultType);

  function fetchNewData() {
    // If there is a prepend value AND a filter, the generateParamStr function will separate them with a '.'
    const prependValue = typeOptionPreset || type ? `${type}` : "";
    // Turns the object of orders/filters/etc into an actual html query string
    const searchOptStr = generateParamStr(
      // This just changes "All" to an empty string
      searchOpts.filters !== "All" ? searchOpts : { ...searchOpts, filters: "" },
      prependValue
    );
    genericGET(`${themeDataApiPath}${searchOptStr}`).then((data) => {
      if (data) {
        setThemeData(data);
      }
    });
  }

  // These are split into 2 useEffect's as I found it silly to re-fetch filters every time searchOpts changes
  useEffect(() => {
    if (accountInfo?.username || noAuthRequired) {
      fetchNewData();
      onSearchOptsChange(searchOpts, type);
    }
  }, [searchOpts, accountInfo, type, noAuthRequired]);
  useEffect(() => {
    if (accountInfo?.username || noAuthRequired) {
      genericGET(`${filterDataApiPath}${type ? `?type=${type}` : ""}`).then((data) => {
        if (data) {
          setServerFilters(data);
        }
      });
    }
  }, [accountInfo, type, noAuthRequired]);

  useEffect(() => {
    // This ensures if you switch types, that it resets your filter so that you see all entries again
    // This could just be made to reset your filter on ANY type change, however I think until this proves too cumbersome to handle, it's fine as is
    if (
      type.includes("CSS") &&
      (searchOpts.filters === "Music" || searchOpts.filters === "Audio")
    ) {
      setSearchOpts({ ...searchOpts, filters: "All" });
    }
    if (type.includes("DESKTOP") && !searchOpts.filters.includes("Desktop")) {
      setSearchOpts({ ...searchOpts, filters: "All" });
    }
    if (type.includes("BPM") && searchOpts.filters.includes("Desktop")) {
      setSearchOpts({ ...searchOpts, filters: "All" });
    }
    if (type.includes("AUDIO") && searchOpts.filters !== "All") {
      setSearchOpts({ ...searchOpts, filters: "All" });
    }
  }, [type]);

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
            showFiltersWithZero={showFiltersWithZero}
            orderOpts={serverFilters.order}
            onOrderChange={(e) => {
              setSearchOpts({ ...searchOpts, order: e.target.value });
            }}
            orderValue={searchOpts.order}
            searchValue={searchOpts.search}
            onSearchChange={(e) => {
              setSearchOpts({ ...searchOpts, search: e.target.value });
            }}
            typeOptions={typePresets[typeOptionPreset]}
            onTypeChange={(e) => {
              setType(e.target.value);
            }}
            typeValue={type}
          />
          <div className="flex flex-col md:flex-row w-full max-w-7xl justify-center items-center md:items-stretch flex-wrap gap-4">
            {themeData.total === 0 && <span>No Results Found</span>}
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
              paramStrFilterPrepend={typeOptionPreset || type ? `${type}.` : ""}
              origSearchOpts={searchOpts}
              type={type}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
