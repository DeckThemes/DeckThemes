import { useState, useEffect, useContext, useRef } from "react";
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
  LoadingSkeletonCard,
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

  const [loaded, setLoaded] = useState<boolean>(false);

  async function fetchNewData() {
    setLoaded(false);

    // If there is a prepend value AND a filter, the generateParamStr function will separate them with a '.'
    const prependValue = typeOptionPreset || type ? `${type}` : "";
    // Turns the object of orders/filters/etc into an actual html query string
    const searchOptStr = generateParamStr(
      // This just changes "All" to an empty string
      searchOpts.filters !== "All" ? searchOpts : { ...searchOpts, filters: "" },
      prependValue
    );
    return genericGET(`${themeDataApiPath}${searchOptStr}`).then((data) => {
      if (data) {
        setThemeData(data);
        setLoaded(true);
      }
    });
  }

  // These are split into 2 useEffect's as I found it silly to re-fetch filters every time searchOpts changes
  useEffect(() => {
    if (accountInfo?.username || noAuthRequired) {
      fetchNewData();
      onSearchOptsChange(searchOpts, type);
    }
  }, [searchOpts, accountInfo, type, noAuthRequired, themeDataApiPath]);
  useEffect(() => {
    if (accountInfo?.username || noAuthRequired) {
      genericGET(`${filterDataApiPath}${type ? `?type=${type}` : ""}`).then((data) => {
        if (data) {
          setServerFilters(data);
        }
      });
    }
  }, [accountInfo, type, noAuthRequired, filterDataApiPath]);

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

  const [isSticky, setIsSticky] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (componentRef.current) {
      const rect = componentRef.current.getBoundingClientRect();
      const isElementSticky = rect.top <= 0;

      setIsSticky(isElementSticky);
    }
  };

  useSubmissionCards && console.log(themeData, loaded);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {themeData.total >= 0 ? (
        <div className="flex flex-col w-full items-center px-4 relative">
          <h4 className="text-2xl font-medium">{title}</h4>
          {isSticky && (
            <div
              className="fixed top-0 z-[9] w-full bg-base-2T-dark px-6 h-24 backdrop-blur-xl max-w-7xl rounded-b-xl blur-md pointer-events-none invisible lg:visible"
              aria-hidden={true}
            ></div>
          )}
          <div
            ref={componentRef}
            className={`w-full max-w-7xl flex items-center justify-center relative lg:sticky top-0 z-10 transition-all ${
              isSticky ? "px-4" : ""
            }`}
          >
            <FilterSelectorCard
              filterOpts={serverFilters.filters}
              onFilterChange={(e) => {
                setSearchOpts({ ...searchOpts, filters: e });
              }}
              filterValue={searchOpts.filters}
              showFiltersWithZero={showFiltersWithZero}
              orderOpts={serverFilters.order}
              onOrderChange={(e) => {
                setSearchOpts({ ...searchOpts, order: e });
              }}
              orderValue={searchOpts.order}
              searchValue={searchOpts.search}
              onSearchChange={(e) => {
                setSearchOpts({ ...searchOpts, search: e.target.value });
              }}
              typeOptions={typePresets[typeOptionPreset]}
              onTypeChange={(e) => {
                setType(e);
              }}
              typeValue={type}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full max-w-7xl justify-center items-center md:items-stretch flex-wrap gap-4">
            {loaded ? (
              <>
                {themeData.total === 0 && <span>No Results Found</span>}
                {/* @ts-ignore */}
                {useSubmissionCards && themeData?.items?.[0]?.newTheme ? (
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
              </>
            ) : (
              <>
                {Array(4)
                  .fill("")
                  .map((_, i) => (
                    <LoadingSkeletonCard key={`Skeleton_Card_${i}`} />
                  ))}
              </>
            )}
          </div>
          <div className="mt-16 mx-4">
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
