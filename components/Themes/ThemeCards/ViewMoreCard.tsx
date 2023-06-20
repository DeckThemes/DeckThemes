import Link from "next/link";
import { BsSearch } from "react-icons/bs";

export function ViewMoreCard({ href }: { href: string }) {
  return (
    <>
      <Link
        href={href}
        className="flex w-full flex-1 transition-all hover:-translate-y-1"
      >
        <div className="w-full rounded-xl border-2 border-borders-base1-light bg-base-3-light transition hover:border-borders-base2-light dark:border-borders-base1-dark dark:bg-base-3-dark hover:dark:border-borders-base2-dark">
          <div className="flex h-[162.5px] flex-col items-center justify-center rounded-xl bg-fore-4-light drop-shadow-lg dark:bg-fore-4-dark">
            <BsSearch size={64} />
          </div>
          <div className="flex h-[76px] flex-grow flex-col items-center justify-center p-4">
            <span className="font-fancy text-2xl font-semibold">View More</span>
          </div>
        </div>
      </Link>
    </>
  );
}
