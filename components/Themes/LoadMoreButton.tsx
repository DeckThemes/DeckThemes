import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { generateParamStr, genericGET } from "../../apiHelpers";
import {
  ThemeQueryRequest,
  ThemeQueryResponse,
  ThemeSubmissionQueryResponse,
} from "../../types";
import { LoadingSpinner } from "../Generic";
import { LoadingSkeletonCard } from "./ThemeCards";
import { twMerge } from "tailwind-merge";

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
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null);

  function loadMore() {
    setLoading(true);
    let searchOptClone = { ...origSearchOpts };
    searchOptClone.page = loadMoreCurPage + 1;
    const searchOpts = generateParamStr(
      searchOptClone.filters !== "All"
        ? searchOptClone
        : { ...searchOptClone, filters: "" },
      paramStrFilterPrepend
    );
    genericGET(`${fetchPath}${searchOpts}`, true)
      .then((data) => {
        if (data) {
          setThemeArr({
            total: themeArr.total,
            items: [...themeArr.items, ...data.items],
          });
          setLoadMorePage((curPage) => curPage + 1);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    setLoadMorePage(1);
  }, [origSearchOpts, type]);

  // //   this is jank central, i dont even think i have to do this, or if i even should have to
  // useEffect(() => {
  //   setThemeArr({ total: 0, items: [] });
  // }, [type, setThemeArr]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const handleIntersection = (
      entries: IntersectionObserverEntry[],
      //   @ts-ignore
      observer: IntersectionObserver
    ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    if (loadMoreButtonRef.current) {
      observer.observe(loadMoreButtonRef.current);
    }

    return () => {
      if (loadMoreButtonRef.current) {
        observer.unobserve(loadMoreButtonRef.current);
      }
    };
  }, [loadMoreButtonRef.current]);

  //   can we do something about this
  return (
    <>
      {themeArr.items.length < themeArr.total ? (
        <>
          {loading ? (
            <>
              {Array(4)
                .fill("")
                .map((_, i) => {
                  return (
                    <LoadingSkeletonCard
                      key={`InfiniteScroll_Skeleton_${i}`}
                      className={twMerge(
                        // TODO: GOD TIER JANK PLEASE MAKE BETTER
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
                  );
                })}
              {/* <LoadingSpinner /> */}
            </>
          ) : (
            <>
              <button
                ref={loadMoreButtonRef}
                className="font-fancy rounded-3xl bg-base-3-light p-2 px-4 font-semibold dark:bg-base-3-dark"
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
