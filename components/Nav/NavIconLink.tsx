import { ReactNode } from "react";
import Link from 'next/link'
import { twMerge } from "tailwind-merge";
export function NavIconLink({
    children,
    href,
    isInternal = false,
    className = "",
  }: {
    children: ReactNode;
    href: string;
    isInternal?: boolean;
    className?: string;
  }) {
    return (
      <>
        {isInternal ? (
          <Link
            href={href}
            className={twMerge(
              "text-textLight hover:text-bgDark dark:text-textDark dark:hover:text-bgLight transition-colors",
              className
            )}
          >
            {children}
          </Link>
        ) : (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={twMerge(
              "text-textLight hover:text-bgDark dark:text-textDark dark:hover:text-bgLight transition-colors",
              className
            )}
          >
            {children}
          </a>
        )}
      </>
    );
  }