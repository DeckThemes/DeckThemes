/* eslint-disable @next/next/no-img-element */

export function DownloadButtonWithIcon({ iconName }: { iconName: string }) {
  return (
    <button className="p-2 group hover:-translate-y-1 bg-base-3-light dark:bg-base-3-dark rounded-xl border-2 border-borders-base1-light hover:border-borders-base2-light dark:border-borders-base1-dark hover:dark:border-borders-base2-dark transition">
      <div className="w-16 h-16 relative">
        {iconName === "steamdeck" ? (
          <>
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-0 z-20 w-[64px] h-[64px] fill-black dark:fill-white group-hover:opacity-0 transition-opacity"
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
              className="absolute z-10 top-0 w-[64px] h-[64px] fill-[url(#Gradient1)]"
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
              className="w-[64px] h-[64px] fill-black dark:fill-white group-hover:fill-[#0078D4] group-hover:dark:fill-[#0078D4] transition-colors"
            >
              <title>Windows 11</title>
              <path d="M0,0H11.377V11.372H0ZM12.623,0H24V11.372H12.623ZM0,12.623H11.377V24H0Zm12.623,0H24V24H12.623" />
            </svg>
          </>
        )}
      </div>
    </button>
  );
}
