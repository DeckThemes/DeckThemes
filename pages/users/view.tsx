import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { authContext } from "../_app";
import { genericGET } from "../../api";
import {
  AccountData,
  FilterQueryResponse,
  Permissions,
  ThemeQueryRequest,
  ThemeQueryResponse,
  ThemeSubmissionQueryResponse,
} from "../../types";
import {
  MiniSubmissionCard,
  FilterSelectorCard,
  LoadingSpinner,
  MiniThemeCardRoot,
  PageSelector,
  PfpDisplay,
} from "../../components";
import { generateParamStr } from "../../api";
import Head from "next/head";

function BigDivider() {
  return (
    <div className="h-2 bg-borderLight dark:bg-borderDark w-full my-4 md:w-10/12 md:rounded-3xl" />
  );
}

export default function Account() {
  const router = useRouter();
  let { userId } = router.query;
  let parsedId: string = "";
  // this is here because for some reason @types/next thinks that router.query can be an array of strings
  if (Array.isArray(userId)) {
    parsedId = userId[0];
  } else {
    parsedId = userId || "";
  }

  const [loaded, setLoaded] = useState<boolean>(false);
  const { accountInfo, setAccountInfo } = useContext(authContext);
  const [userInfo, setUserInfo] = useState<AccountData | undefined>();
  const [serverSearchOpts, setServerSearchOpts] = useState<FilterQueryResponse>({
    filters: [],
    order: [],
  });
  const [serverSubSearchOpts, setServerSubSearchOpts] = useState<FilterQueryResponse>({
    filters: [],
    order: [],
  });
  const [serverStarSearchOpts, setServerStarSearchOpts] = useState<FilterQueryResponse>({
    filters: [],
    order: [],
  });
  const [starredThemes, setStarredThemes] = useState<ThemeQueryResponse>({
    total: 0,
    items: [],
  });
  const [starredThemeSearchOpts, setStarSearchOpts] = useState<ThemeQueryRequest>({
    page: 1,
    perPage: 5,
    filters: "",
    order: "",
    search: "",
  });
  const [approvedThemeSearchOpts, setApprSearchOpt] = useState<ThemeQueryRequest>({
    page: 1,
    perPage: 5,
    filters: "",
    order: "",
    search: "",
  });
  const [approvedThemes, setApprThemes] = useState<ThemeQueryResponse>({
    total: 0,
    items: [],
  });
  const [submissionSearchOpts, setSubSearchOpts] = useState<ThemeQueryRequest>({
    page: 1,
    perPage: 10,
    filters: "",
    order: "",
    search: "",
  });
  const [submissions, setSubs] = useState<ThemeSubmissionQueryResponse>({
    total: 0,
    items: [],
  });

  async function getAdminFilters() {
    const submissionData = await genericGET(
      `/users/${parsedId}/submissions/filters`,
      "Error Fetching User Submission Filters!"
    );
    if (submissionData) {
      setServerSubSearchOpts(submissionData);
    }

    const starredData = await genericGET(
      `/users/${parsedId}/stars/filters`,
      "Error Fetching User Starred Theme Filters!",
      true
    );
    if (starredData) {
      setServerStarSearchOpts(starredData);
    }
  }

  useEffect(() => {
    if (parsedId) {
      genericGET(`/users/${parsedId}/themes/filters`, "Error Fetching User Filters!").then(
        (data) => {
          if (data) {
            setServerSearchOpts(data);
          }
        }
      );
      if (accountInfo?.permissions.includes(Permissions.admin)) {
        getAdminFilters();
      }
    }
  }, [accountInfo]);

  useEffect(() => {
    if (accountInfo?.permissions.includes(Permissions.admin)) {
      const searchOpts = generateParamStr(
        // This just changes "All" to "", as that is what the backend looks for
        submissionSearchOpts.filters !== "All"
          ? submissionSearchOpts
          : { ...submissionSearchOpts, filters: "" },
        "CSS."
      );
      genericGET(
        `/users/${parsedId}/submissions${searchOpts}`,
        "Error Fetching Submissions!",
        true
      ).then((data) => {
        if (data) {
          setSubs(data);
        }
      });
    }
  }, [submissionSearchOpts, userInfo, accountInfo]);

  useEffect(() => {
    async function getAndSetApprThemes() {
      // This just changes "All" to "", as that is what the backend looks for
      const searchOpts = generateParamStr(
        approvedThemeSearchOpts.filters !== "All"
          ? approvedThemeSearchOpts
          : { ...approvedThemeSearchOpts, filters: "" },
        "CSS."
      );
      const data = await genericGET(
        `/users/${parsedId}/themes${searchOpts}`,
        "Error Fetching Submissions!",
        true
      );
      if (data) {
        setApprThemes(data);
      }
    }
    if (userInfo?.username) {
      getAndSetApprThemes();
    }
  }, [approvedThemeSearchOpts, userInfo]);

  useEffect(() => {
    if (accountInfo?.permissions.includes(Permissions.admin)) {
      // This just changes "All" to "", as that is what the backend looks for
      const searchOpts = generateParamStr(
        starredThemeSearchOpts.filters !== "All"
          ? starredThemeSearchOpts
          : { ...starredThemeSearchOpts, filters: "" },
        "CSS."
      );
      genericGET(`/users/${parsedId}/stars${searchOpts}`, "Error Fetching Starred Themes!").then(
        (data) => {
          if (data) {
            setStarredThemes(data);
          }
        }
      );
    }
  }, [starredThemeSearchOpts, userInfo, accountInfo]);

  useEffect(() => {
    if (parsedId) {
      genericGET(`/users/${parsedId}`, "Error Fetching User Data!", true).then((data) => {
        if (data) {
          setUserInfo(data);
        }
        setLoaded(true);
        return;
      });
    }
  }, [parsedId]);

  function logOut() {
    setAccountInfo(undefined);
    // We do a little trolling
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  }

  if (!loaded) {
    return (
      <>
        <Head>
          <title>DeckThemes | Loading</title>
        </Head>
        <main className="flex justify-center flex-grow items-center text-center px-5">
          <LoadingSpinner />
          <h1 className="text-4xl font-semibold">Loading</h1>
        </main>
      </>
    );
  }

  if (!userInfo?.username) {
    return (
      <>
        <Head>
          <title>DeckThemes | Invalid User</title>
        </Head>
        <main className="flex justify-center flex-grow items-center text-center px-5">
          <h1 className="text-4xl font-semibold pt-20">Error! Invalid User ID</h1>
        </main>
      </>
    );
  }

  const calcDisplayName = () => {
    const slicedName = userInfo.username.slice(0, userInfo.username.lastIndexOf("#"));
    if (slicedName.slice(-1) === "s" || slicedName.slice(-1) === "S") {
      return `${slicedName}'`;
    } else {
      return `${slicedName}'s`;
    }
  };

  return (
    <>
      <Head>
        <title>{userInfo.username} | DeckThemes</title>
      </Head>
      <main className="flex flex-col items-center w-full">
        <PfpDisplay avatar={userInfo.avatar} username={userInfo.username} id={userInfo.id} />
        <div className="mt-4" />
        {approvedThemes.total >= 0 ? (
          <div className="flex flex-col w-full items-center px-4">
            <h4 className="text-2xl font-medium">{calcDisplayName()} Themes</h4>
            <FilterSelectorCard
              filterOpts={serverSearchOpts.filters}
              onFilterChange={(e) => {
                setApprSearchOpt({ ...approvedThemeSearchOpts, filters: e.target.value });
              }}
              filterValue={approvedThemeSearchOpts.filters}
              orderOpts={serverSearchOpts.order}
              onOrderChange={(e) => {
                setApprSearchOpt({ ...approvedThemeSearchOpts, order: e.target.value });
              }}
              orderValue={approvedThemeSearchOpts.order}
              searchValue={approvedThemeSearchOpts.search}
              onSearchChange={(e) => {
                setApprSearchOpt({ ...approvedThemeSearchOpts, search: e.target.value });
              }}
            />
            <div className="flex md:flex-row w-full justify-center items-center flex-wrap gap-4">
              {approvedThemes.total === 0 && <span>No Themes Found</span>}
              {approvedThemes.items.map((e, i) => {
                return <MiniThemeCardRoot data={e} key={`Approved Theme ${i}`} />;
              })}
            </div>
            <div className="mt-4 mx-4">
              <PageSelector
                total={approvedThemes.total}
                perPage={approvedThemeSearchOpts.perPage}
                currentPage={approvedThemeSearchOpts.page}
                onChoose={(page) => {
                  setApprSearchOpt({ ...approvedThemeSearchOpts, page: page });
                }}
              />
            </div>
          </div>
        ) : null}
        {accountInfo?.permissions.includes(Permissions.admin) && (
          <>
            <BigDivider />
            {starredThemes.total >= 0 ? (
              <div className="flex flex-col w-full items-center px-4">
                <h4 className="text-2xl font-medium">Starred Themes</h4>
                <FilterSelectorCard
                  filterOpts={serverStarSearchOpts.filters}
                  onFilterChange={(e) => {
                    setStarSearchOpts({ ...starredThemeSearchOpts, filters: e.target.value });
                  }}
                  filterValue={starredThemeSearchOpts.filters}
                  orderOpts={serverStarSearchOpts.order}
                  onOrderChange={(e) => {
                    setStarSearchOpts({ ...starredThemeSearchOpts, order: e.target.value });
                  }}
                  orderValue={starredThemeSearchOpts.order}
                  searchValue={starredThemeSearchOpts.search}
                  onSearchChange={(e) => {
                    setStarSearchOpts({ ...starredThemeSearchOpts, search: e.target.value });
                  }}
                />
                <div className="flex md:flex-row w-full justify-center items-center flex-wrap gap-4">
                  {starredThemes.total === 0 && <span>No Themes Found</span>}
                  {starredThemes.items.map((e, i) => {
                    return <MiniThemeCardRoot data={e} key={`Approved Theme ${i}`} />;
                  })}
                </div>
                <div className="mt-4 mx-4">
                  <PageSelector
                    total={starredThemes.total}
                    perPage={starredThemeSearchOpts.perPage}
                    currentPage={starredThemeSearchOpts.page}
                    onChoose={(page) => {
                      setStarSearchOpts({ ...starredThemeSearchOpts, page: page });
                    }}
                  />
                </div>
              </div>
            ) : null}
            <BigDivider />
            {submissions.total >= 0 ? (
              <div className="flex flex-col w-full items-center px-4">
                <h4 className="text-2xl font-medium">Your Submissions</h4>
                <FilterSelectorCard
                  filterOpts={serverSubSearchOpts.filters}
                  onFilterChange={(e) => {
                    setSubSearchOpts({ ...submissionSearchOpts, filters: e.target.value });
                  }}
                  filterValue={submissionSearchOpts.filters}
                  orderOpts={serverSubSearchOpts.order}
                  onOrderChange={(e) => {
                    setSubSearchOpts({ ...submissionSearchOpts, order: e.target.value });
                  }}
                  orderValue={submissionSearchOpts.order}
                  searchValue={submissionSearchOpts.search}
                  onSearchChange={(e) => {
                    setSubSearchOpts({ ...submissionSearchOpts, search: e.target.value });
                  }}
                />
                <div className="flex md:flex-row w-full justify-center items-center md:items-start flex-wrap gap-4">
                  {submissions.total === 0 && <span>No Submissions Found</span>}
                  {submissions.items.map((e, i) => {
                    if (
                      e.status === "AwaitingApproval" ||
                      (new Date().valueOf() - new Date(e.submitted).valueOf()) /
                        (1000 * 60 * 60 * 24) <
                        7
                    )
                      return <MiniSubmissionCard data={e} key={`Theme Submission ${i}`} />;
                  })}
                </div>
                <PageSelector
                  total={submissions.total}
                  perPage={submissionSearchOpts.perPage}
                  currentPage={submissionSearchOpts.page}
                  onChoose={(page) => {
                    setSubSearchOpts({ ...submissionSearchOpts, page: page });
                  }}
                />
              </div>
            ) : null}
          </>
        )}
      </main>
    </>
  );
}
