import Link from "next/link";
import { BsSearch } from "react-icons/bs";

export function ViewMoreCard({ href }: { href: string }) {
  return (
    <>
      <Link href={href} className="flex flex-1 w-full hover:-translate-y-1 transition-all">
        <div className="w-full bg-base-3-light dark:bg-base-3-dark rounded-xl border-2 border-borders-base1-light dark:border-borders-base1-dark hover:border-borders-base2-light hover:dark:border-borders-base2-dark transition">
          <div className="bg-fore-4-light dark:bg-fore-4-dark rounded-xl flex flex-col items-center justify-center h-[162.5px] drop-shadow-lg">
            <BsSearch size={64} />
          </div>
          <div className="flex flex-col items-center justify-center p-4 flex-grow h-[76px]">
            <span className="font-fancy text-2xl font-semibold">View More</span>
          </div>
        </div>
      </Link>
    </>
  );
}
