import Link from "next/link";
import { BsSearch } from "react-icons/bs";

export function ViewMoreCard({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="hover:translate-y-1 transition-all hover:bg-cardLight dark:hover:bg-cardDark rounded-xl"
    >
      <div className="w-[260px] h-[242.5px] bg-cardLight dark:bg-cardDark rounded-xl ">
        <div className="bg-cardLight dark:bg-cardDark rounded-xl flex flex-col items-center justify-center w-[260px] h-[162.5px] drop-shadow-lg">
          <BsSearch size={64} />
        </div>
        <div className="flex flex-col items-center justify-center p-4 flex-grow h-[80px]">
          <span className="font-fancy text-2xl font-medium">View More</span>
        </div>
      </div>
    </Link>
  );
}
