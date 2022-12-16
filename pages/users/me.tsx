import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { authContext } from "../_app";
import { fetchDiscordUrl, genericGET } from "../../api";
import {
  FilterQueryResponse,
  ThemeQueryRequest,
  ThemeQueryResponse,
  ThemeSubmissionQueryResponse,
} from "../../types";
import {
  CSSMiniSubmissionCard,
  CSSMiniThemeCard,
  FilterSelectorCard,
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
  const { accountInfo, setAccountInfo } = useContext(authContext);
  const router = useRouter();
  const [loaded, setLoaded] = useState(true);
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

  async function getFilters() {
    const data = await genericGET(
      `/users/${accountInfo?.id}/themes/filters`,
      "Error Fetching User Filters!"
    );
    if (data) {
      setServerSearchOpts(data);
    }

    const submissionData = await genericGET(
      `/users/${accountInfo?.id}/submissions/filters`,
      "Error Fetching User Submission Filters!"
    );
    if (submissionData) {
      setServerSubSearchOpts(submissionData);
    }

    const starredData = await genericGET(
      `/users/${accountInfo?.id}/stars/filters`,
      "Error Fetching User Starred Theme Filters!",
      true
    );
    if (starredData) {
      setServerStarSearchOpts(starredData);
    }
  }

  useEffect(() => {
    if (accountInfo?.id) {
      getFilters();
    }
  }, [accountInfo]);

  useEffect(() => {
    async function getAndSetSubmissions() {
      const searchOpts = generateParamStr(
        // This just changes "All" to "", as that is what the backend looks for
        submissionSearchOpts.filters !== "All"
          ? submissionSearchOpts
          : { ...submissionSearchOpts, filters: "" },
        "CSS."
      );
      const data = await genericGET(
        `/users/me/submissions${searchOpts}`,
        "Error Fetching Submissions!",
        true
      );
      if (data) {
        setSubs(data);
      }
    }
    if (accountInfo?.username) {
      getAndSetSubmissions();
    }
  }, [submissionSearchOpts, accountInfo]);

  useEffect(() => {
    async function getAndSetApprThemes() {
      // This just changes "All" to "", as that is what the backend looks for
      const searchOpts = generateParamStr(
        approvedThemeSearchOpts.filters !== "All"
          ? approvedThemeSearchOpts
          : { ...approvedThemeSearchOpts, filters: "" },
        "CSS."
      );
      const data = await genericGET(`/users/me/themes${searchOpts}`, "Error Fetching Submissions!");
      if (data) {
        setApprThemes(data);
      }
    }
    if (accountInfo?.username) {
      getAndSetApprThemes();
    }
  }, [approvedThemeSearchOpts, accountInfo]);

  useEffect(() => {
    async function getAndSetStarThemes() {
      // This just changes "All" to "", as that is what the backend looks for
      const searchOpts = generateParamStr(
        starredThemeSearchOpts.filters !== "All"
          ? starredThemeSearchOpts
          : { ...starredThemeSearchOpts, filters: "" },
        "CSS."
      );
      const data = await genericGET(
        `/users/me/stars${searchOpts}`,
        "Error Fetching Starred Themes!"
      );
      if (data) {
        setStarredThemes(data);
      }
    }
    if (accountInfo?.username) {
      getAndSetStarThemes();
    }
  }, [starredThemeSearchOpts, accountInfo]);

  function logOut() {
    setAccountInfo(undefined);
    // We do a little trolling
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  }

  if (!accountInfo?.username) {
    return (
      <>
        <Head>
          <title>DeckThemes | Log In</title>
        </Head>
        <main className="flex flex-col items-center text-center px-5">
          <h1 className="text-4xl font-semibold pt-20">You Are Not Logged In</h1>
          <button
            className="text-discordColor font-medium text-5xl pt-10"
            onClick={fetchDiscordUrl}
          >
            <span>Login</span>
          </button>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>DeckThemes | My Profile</title>
      </Head>
      <main className="flex flex-col items-center w-full">
        <PfpDisplay
          avatar={accountInfo.avatar}
          username={accountInfo.username}
          id={accountInfo.id}
        />
        {/* <h3 className="mt-4 font-medium text-2xl">Your Saved Themes</h3>
      <BigDivider /> */}
        {/* below is a placeholder,  the "Saved Themes" section is supposed to go there */}
        <div className="mt-4" />
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
                return <CSSMiniThemeCard data={e} key={`Approved Theme ${i}`} />;
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
        {approvedThemes.total >= 0 ? (
          <div className="flex flex-col w-full items-center px-4">
            <h4 className="text-2xl font-medium">Your Themes</h4>
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
                return <CSSMiniThemeCard data={e} key={`Approved Theme ${i}`} />;
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
                  (new Date().valueOf() - new Date(e.submitted).valueOf()) / (1000 * 60 * 60 * 24) <
                    7
                )
                  return <CSSMiniSubmissionCard data={e} key={`Theme Submission ${i}`} />;
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
        <div className="mt-5" />
        <button
          onClick={logOut}
          className="mt-auto p-5 mb-5 font-medium text-xl bg-cardLight dark:bg-cardDark rounded-full"
        >
          Log Out
        </button>
      </main>
    </>
  );
}
