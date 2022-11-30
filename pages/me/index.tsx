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
import { CSSMiniSubmissionCard, CSSMiniThemeCard, FilterSelectorCard } from "../../components";
import { generateParamStr } from "../../api";

export default function Account() {
  const { accountInfo, setAccountInfo } = useContext(authContext);
  const router = useRouter();
  const [serverSearchOpts, setServerSearchOpts] = useState<FilterQueryResponse>({
    filters: [],
    order: [],
  });
  const [approvedThemeSearchOpts, setApprSearchOpt] = useState<ThemeQueryRequest>({
    page: 1,
    perPage: 50,
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
    perPage: 50,
    filters: "",
    order: "",
    search: "",
  });
  const [submissions, setSubs] = useState<ThemeSubmissionQueryResponse>({
    total: 0,
    items: [],
  });

  useEffect(() => {
    async function getFilters() {
      const data = await genericGET(
        `/users/${accountInfo?.id}/css_themes/filters`,
        "Error Fetching User Filters!"
      );
      if (data) {
        setServerSearchOpts(data);
      }
    }
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
          : { ...submissionSearchOpts, filters: "" }
      );
      const data = await genericGET(
        `/users/me/css_submissions${searchOpts}`,
        "Error Fetching Submissions!"
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
          : { ...approvedThemeSearchOpts, filters: "" }
      );
      console.log(searchOpts);
      const data = await genericGET(
        `/users/me/css_themes${searchOpts}`,
        "Error Fetching Submissions!"
      );
      if (data) {
        setApprThemes(data);
      }
    }
    if (accountInfo?.username) {
      getAndSetApprThemes();
    }
  }, [approvedThemeSearchOpts, accountInfo]);

  function logOut() {
    setAccountInfo(undefined);
    // We do a little trolling
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  }

  if (!accountInfo?.username) {
    return (
      <main className="flex flex-col items-center text-center px-5">
        <h1 className="text-4xl font-semibold pt-20">You Are Not Logged In</h1>
        <button className="text-discordColor font-medium text-5xl pt-10" onClick={fetchDiscordUrl}>
          <span>Login</span>
        </button>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center w-full">
      <div className="flex flex-col md:flex-row-reverse gap-2 items-center md:bg-cardLight md:dark:bg-cardDark rounded-full md:pl-4 mt-10">
        <Image
          src={accountInfo.avatar}
          width="142"
          height="142"
          alt="Your Discord Profile Picture"
          className="rounded-full border-8 border-borderLight dark:border-borderDark"
        />
        <h1 className="text-3xl font-semibold">{accountInfo.username}</h1>
      </div>
      <h3 className="my-4 font-medium text-2xl">Your Saved Themes</h3>

      {submissions.total > 0 || approvedThemes.total > 0 ? <></> : null}
      {approvedThemes.total >= 0 ? (
        <div className="flex flex-col w-full items-center pb-4">
          <h4 className="text-2xl font-medium">Your Themes</h4>
          <FilterSelectorCard
            filterOpts={serverSearchOpts.filters}
            onFilterChange={(e) => {
              setApprSearchOpt({ ...approvedThemeSearchOpts, filters: e.target.value });
            }}
            orderOpts={serverSearchOpts.order}
            onOrderChange={(e) => {
              setApprSearchOpt({ ...approvedThemeSearchOpts, order: e.target.value });
            }}
            searchValue={approvedThemeSearchOpts.search}
            onSearchChange={(e) => {
              setApprSearchOpt({ ...approvedThemeSearchOpts, search: e.target.value });
            }}
          />
          <div className="flex md:flex-row w-full justify-center items-center flex-wrap gap-4">
            {approvedThemes.items.map((e, i) => {
              return <CSSMiniThemeCard data={e} key={`Approved Theme ${i}`} />;
            })}
          </div>
        </div>
      ) : null}
      {submissions.total >= 0 ? (
        <div className="flex flex-col w-full items-center pb-4">
          <h4 className="text-2xl font-medium">Your Submissions</h4>
          <FilterSelectorCard
            searchOnly
            // Filter & Order are broken on this API endpoint
            // filterOpts={serverSearchOpts.filters}
            // onFilterChange={(e) => {
            //   setSubSearchOpts({ ...submissionSearchOpts, filters: e.target.value });
            // }}
            // orderOpts={serverSearchOpts.order}
            // onOrderChange={(e) => {
            //   setSubSearchOpts({ ...submissionSearchOpts, order: e.target.value });
            // }}
            searchValue={submissionSearchOpts.search}
            onSearchChange={(e) => {
              setSubSearchOpts({ ...submissionSearchOpts, search: e.target.value });
            }}
          />
          <div className="flex md:flex-row w-full justify-center items-center flex-wrap gap-4">
            {submissions.items.map((e, i) => {
              return <CSSMiniSubmissionCard data={e.new} key={`Theme Submission ${i}`} />;
            })}
          </div>
        </div>
      ) : null}
      <button
        onClick={logOut}
        className="mt-auto p-5 mb-5 font-medium text-xl bg-cardLight dark:bg-cardDark rounded-full"
      >
        Log Out
      </button>
    </main>
  );
}
