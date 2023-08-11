import { useState, useEffect, useContext, useRef } from "react";
import { generateParamStr, genericGET } from "../../apiHelpers";
import { authContext } from "contexts";
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
import { twMerge } from "tailwind-merge";

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
  title?: string;
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

  // If you spammed the radio or otherwise changed things, there were cases where useSubmissionCards was true even before the submission data had loaded, causing type errors
  // This now only sets what type of card to use after said data has loaded
  const [debouncedUseSubmissionCards, setDebouncedUseSubmissionCards] = useState<
    boolean | undefined
  >(useSubmissionCards);

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
        setDebouncedUseSubmissionCards(useSubmissionCards);
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
    if (
      type.includes("AUDIO") &&
      searchOpts.filters !== "All" &&
      // This is here to not break /submissions
      searchOpts.filters !== "AwaitingApproval"
    ) {
      setSearchOpts({ ...searchOpts, filters: "All" });
    }
  }, [type]);

  const [isSticky, setIsSticky] = useState(false);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (stickyHeaderRef.current) {
        const rect = stickyHeaderRef?.current?.getBoundingClientRect();
        const isElementSticky = rect?.top <= 0;

        setIsSticky(isElementSticky);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {themeData.total >= 0 ? (
        <div className="relative flex h-full w-full flex-col items-center px-4">
          {title && <h4 className="text-2xl font-medium">{title}</h4>}
          {isSticky && (
            <div className="category-sticky-header-blur hidden lg:block" aria-hidden={true}></div>
          )}
          <div
            ref={stickyHeaderRef}
            className={`z-10 flex w-full max-w-7xl items-center justify-center transition-all duration-300 lg:sticky lg:top-0 ${
              isSticky ? "lg:px-4" : ""
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
                setSearchOpts({ ...searchOpts, search: e });
              }}
              typeOptions={typePresets[typeOptionPreset]}
              onTypeChange={(e) => {
                setType(e);
              }}
              typeValue={type}
            />
          </div>
          <div className="grid w-full max-w-7xl grid-cols-1 flex-wrap items-center justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 md:items-stretch lg:grid-cols-4">
            {loaded ? (
              <>
                {themeData.total === 0 && <span>No Results Found</span>}
                {/* @ts-ignore */}
                {debouncedUseSubmissionCards && themeData?.items?.[0]?.newTheme ? (
                  <>
                    {themeData.items.map((e, i) => {
                      return (
                        <MiniSubmissionCard
                          //   This gives type errors bcus the fetch type is "Themes | Submissions", and despite the fact that I check for themes or submissions here, ts doesn't know that
                          // @ts-ignore
                          data={e}
                          key={`Approved Theme ${i}`}
                        />
                      );
                    })}
                  </>
                ) : (
                  <>
                    {themeData.items.map((e, i) => {
                      return (
                        <>
                          <MiniThemeCardRoot
                            // @ts-ignore
                            data={e}
                            key={`Approved Theme ${i}`}
                          />
                        </>
                      );
                    })}
                  </>
                )}
                <LoadMoreButton
                  themeArr={themeData}
                  setThemeArr={setThemeData}
                  fetchPath={themeDataApiPath}
                  paramStrFilterPrepend={typeOptionPreset || type ? `${type}.` : ""}
                  origSearchOpts={searchOpts}
                  type={type}
                />
              </>
            ) : (
              <>
                {Array(4)
                  .fill("")
                  .map((_, i) => (
                    <LoadingSkeletonCard
                      key={`Skeleton_Card_${i}`}
                      className={twMerge(
                        "hidden",
                        `${
                          i === 1
                            ? "sm:inline"
                            : i === 2
                            ? "md:inline"
                            : i === 3
                            ? "lg:inline"
                            : "inline"
                        }`
                      )}
                    />
                  ))}
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
