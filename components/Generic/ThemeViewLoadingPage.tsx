import Head from "next/head";

export function ThemeViewLoadingPage() {
  return (
    <>
      <Head>
        <title>DeckThemes | Loading</title>
      </Head>
      <div className="font-fancy flex h-full w-full flex-grow justify-center text-center lg:text-left">
        <>
          <div className="themeview-skeleton flex h-fit w-full max-w-7xl flex-col items-center rounded-3xl">
            <div className="flex w-full flex-[75%] animate-pulse flex-col gap-4 text-left md:flex-row">
              <div className="flex w-full flex-col gap-4">
                <div className="h-12 w-full max-w-[32rem] rounded-full bg-base-4-light dark:bg-base-4-dark"></div>

                <div className="flex w-full flex-row items-center gap-4 self-center pb-4">
                  <div className="flex h-6 w-full max-w-[12rem] flex-row items-center gap-1 rounded-full bg-base-4-light dark:bg-base-4-dark"></div>

                  <div className="flex h-8 w-full max-w-[4rem] flex-row items-center gap-1 rounded-full bg-base-4-light dark:bg-base-4-dark"></div>
                  <div className="flex h-8 w-full max-w-[4rem] flex-row items-center gap-1 rounded-full bg-base-4-light dark:bg-base-4-dark"></div>
                </div>

                <div className="flex w-full flex-col gap-4 self-center pb-4">
                  <div className="flex h-6 max-w-[36rem] flex-row items-center gap-1 rounded-full bg-base-4-light dark:bg-base-4-dark"></div>
                  <div className="flex h-6 max-w-[36rem] flex-row items-center gap-1 rounded-full bg-base-4-light dark:bg-base-4-dark"></div>
                  <div className="flex h-6 max-w-[22rem] flex-row items-center gap-1 rounded-full bg-base-4-light dark:bg-base-4-dark"></div>
                </div>

                <div className="flex w-full flex-col items-center gap-4 self-center pb-4 md:flex-row">
                  <div className="flex h-10 w-[8rem] flex-row items-center gap-1 rounded-full bg-base-4-light dark:bg-base-4-dark"></div>
                  <div className="flex h-6 w-[10rem] flex-row items-center gap-1 rounded-full bg-base-4-light dark:bg-base-4-dark"></div>
                </div>

                <div
                  className="aspect-video rounded-2xl bg-base-4-light dark:bg-base-4-dark"
                  style={{
                    width: "100%",
                    position: "relative",
                    maxHeight: "80vh",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </>
      </div>
    </>
  );
}
