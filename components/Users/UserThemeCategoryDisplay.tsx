import { useState, useEffect, useContext } from "react";
import { generateParamStr, genericGET } from "../../api";
import { authContext } from "../../pages/_app";

import {
  FilterQueryResponse,
  ThemeQueryRequest,
  ThemeQueryResponse,
  ThemeSubmissionQueryResponse,
} from "../../types";
import { FilterSelectorCard, MiniSubmissionCard, MiniThemeCardRoot, PageSelector } from "../Themes";

export function UserThemeCategoryDisplay({
  themeDataApiPath,
  filterDataApiPath,
  title,
  useSubmissionCards,
}: {
  themeDataApiPath: string;
  filterDataApiPath: string;
  title: string;
  useSubmissionCards?: boolean;
}) {
  const { accountInfo } = useContext(authContext);

  const [serverFilters, setServerFilters] = useState<FilterQueryResponse>({
    filters: [],
    order: [],
  });
  const [searchOpts, setSearchOpts] = useState<ThemeQueryRequest>({
    page: 1,
    perPage: 5,
    filters: "",
    order: "",
    search: "",
  });
  const [themeData, setThemeData] = useState<ThemeQueryResponse | ThemeSubmissionQueryResponse>({
    total: 0,
    items: [],
  });

  useEffect(() => {
    if (accountInfo?.username) {
      // This just changes "All" to "", as that is what the backend looks for
      const searchOptStr = generateParamStr(
        searchOpts.filters !== "All" ? searchOpts : { ...searchOpts, filters: "" },
        "CSS."
      );
      genericGET(`${themeDataApiPath}${searchOptStr}`, "Error Fetching Theme Data!").then(
        (data) => {
          if (data) {
            setThemeData(data);
          }
        }
      );
    }
  }, [searchOpts, accountInfo]);

  useEffect(() => {
    if (accountInfo?.id) {
      genericGET(`${filterDataApiPath}`, "Error Fetching Filters!").then((data) => {
        if (data) {
          setServerFilters(data);
        }
      });
    }
  }, [accountInfo]);

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
          />
          <div className="flex md:flex-row w-full justify-center items-center flex-wrap gap-4">
            {themeData.total === 0 && <span>No Themes Found</span>}
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
            <PageSelector
              total={themeData.total}
              perPage={searchOpts.perPage}
              currentPage={searchOpts.page}
              onChoose={(page) => {
                setSearchOpts({ ...searchOpts, page: page });
              }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
