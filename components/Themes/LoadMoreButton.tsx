import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { generateParamStr, genericGET } from "../../api";
import { ThemeQueryRequest, ThemeQueryResponse, ThemeSubmissionQueryResponse } from "../../types";
import { LoadingSpinner } from "../Generic";

export function LoadMoreButton({
  fetchPath = "/themes",
  origSearchOpts,
  setThemeArr,
  themeArr,
  paramStrFilterPrepend = "",
  type = "",
}: {
  fetchPath: string;
  origSearchOpts: ThemeQueryRequest;
  setThemeArr: Dispatch<SetStateAction<any>>;
  themeArr: ThemeQueryResponse | ThemeSubmissionQueryResponse;
  paramStrFilterPrepend: string;
  type?: string | undefined;
}) {
  const [loadMoreCurPage, setLoadMorePage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  function loadMore() {
    setLoading(true);
    // This just changes "All" to "", as that is what the backend looks for
    let searchOptClone = { ...origSearchOpts };
    searchOptClone.page = loadMoreCurPage + 1;
    const searchOpts = generateParamStr(
      searchOptClone.filters !== "All" ? searchOptClone : { ...searchOptClone, filters: "" },
      paramStrFilterPrepend
    );
    genericGET(`${fetchPath}${searchOpts}`, true).then((data) => {
      if (data) {
        setThemeArr({ total: themeArr.total, items: [...themeArr.items, ...data.items] });
        setLoadMorePage((curPage) => curPage + 1);
      }
      setLoading(false);
    });
  }

  useEffect(() => {
    setLoadMorePage(1);
  }, [origSearchOpts, type]);
  return (
    <>
      {themeArr.items.length < themeArr.total ? (
        <>
          {loading ? (
            <>
              <LoadingSpinner />
            </>
          ) : (
            <>
              <button
                className="bg-cardLight dark:bg-cardDark p-2 px-4 rounded-3xl font-semibold text-2xl"
                onClick={loadMore}
              >
                Load More
              </button>
            </>
          )}
        </>
      ) : null}
    </>
  );
}
