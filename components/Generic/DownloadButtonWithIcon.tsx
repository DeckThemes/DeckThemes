/* eslint-disable @next/next/no-img-element */

export function DownloadButtonWithIcon({ iconName }: { iconName: string }) {
  return (
    <button className="gap-2 mb-2 sm:mb-0 group no-underline inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-brandBlue text-white hover:bg-fore-11-dark hover:text-fore-contrast-dark active:opacity-60 border-2 border-borders-base1-light hover:border-borders-base2-light dark:border-borders-base1-dark hover:dark:border-borders-base2-dark transition">
      <div className="w-4 h-4 relative">
        {iconName === "steamdeck" ? (
          <>
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 absolute top-0 left-0 z-20 fill-white group-hover:opacity-0 transition-opacity"
            >
              <linearGradient id="Gradient1">
                <stop offset="0%" stopColor="#1a9eff" />
                <stop offset="100%" stopColor="#d333f7" />
              </linearGradient>
              <title>Steam Deck</title>
              <path d="M8.999 0v4.309c4.242 0 7.694 3.45 7.694 7.691s-3.452 7.691-7.694 7.691V24c6.617 0 12-5.383 12-12s-5.383-12-12-12Zm0 6.011c-3.313 0-6 2.687-5.998 6a5.999 5.999 0 1 0 5.998-6z" />
            </svg>
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 absolute z-10 top-0 left-0 fill-[url(#Gradient1)]"
            >
              <linearGradient id="Gradient1">
                <stop offset="0%" stopColor="#1a9eff" />
                <stop offset="100%" stopColor="#d333f7" />
              </linearGradient>
              <title>Steam Deck</title>
              <path d="M8.999 0v4.309c4.242 0 7.694 3.45 7.694 7.691s-3.452 7.691-7.694 7.691V24c6.617 0 12-5.383 12-12s-5.383-12-12-12Zm0 6.011c-3.313 0-6 2.687-5.998 6a5.999 5.999 0 1 0 5.998-6z" />
            </svg>
          </>
        ) : (
          <>
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 fill-white group-hover:fill-[#0078D4] group-hover:dark:fill-[#0078D4] transition-colors"
            >
              <title>Windows 11</title>
              <path d="M0,0H11.377V11.372H0ZM12.623,0H24V11.372H12.623ZM0,12.623H11.377V24H0Zm12.623,0H24V24H12.623" />
            </svg>
          </>
        )}
      </div>
	  <div>Download for {iconName === "steamdeck" && <>Steam Deck</>} {iconName === "windows11" && <>Windows</>} </div>
    </button>
  );
}
