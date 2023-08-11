// @ts-nocheck
// This is a terrible mess, but it can be cleaned later
import React, { useState } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { twMerge } from "tailwind-merge";
import { useContext } from "react";
import { authContext, desktopModeContext } from "contexts";
import { fetchDiscordUrl } from "../../apiHelpers";
import { NavIcon } from "./NavIcon";
import { Permissions } from "../../types";
import { MiniPfpDisplay } from "../Users";
import { LoadingSpinner } from "../Generic";
import { useHasCookie } from "../../hooks";
import { DesktopNav } from "../Desktop";
import { FaCaretDown } from "react-icons/fa";
import Link from "next/link";

export default function Nav() {
  const { accountInfo } = useContext(authContext);
  const { desktopMode } = useContext(desktopModeContext);
  const hasCookie = useHasCookie();
  const [alignValue, setAlignValue] = useState<"center" | "end">("center");

  if (desktopMode) return <DesktopNav />;

  return (
    <>
      <NavigationMenu.Root
        onValueChange={(e) => {
          if (e) {
            setAlignValue(e.slice(0, -1));
            return;
          }
        }}
        delayDuration={0}
        className="relative !z-[9999] my-8 w-full px-4 text-xs font-bold"
      >
        <div className="mx-auto flex max-w-7xl justify-between">
          <div className="flex items-center">
            <NavIcon />
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <NavigationMenu.List className="center shadow-blackA7 m-0 flex list-none rounded-lg p-1">
              <NavigationMenu.Item value="center1">
                <NavigationMenu.Trigger className="group flex select-none items-center justify-between gap-[2px] rounded-lg px-3 py-2 text-[15px] font-bold leading-none outline-none transition hover:bg-base-5-dark hover:text-white focus:shadow-[0_0_0_2px] dark:hover:bg-base-5-dark">
                  Browse{" "}
                  <FaCaretDown
                    className="relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
                    aria-hidden
                  />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="absolute top-0 left-0 w-full sm:w-auto">
                  <ul className="m-0 grid list-none gap-x-[10px] p-[12px] sm:w-[320px] sm:grid-flow-col sm:grid-rows-2">
                    <ListItem
                      title="CSS Themes"
                      href="/themes?filters=All&order=Most+Downloaded&type=CSS"
                    >
                      Steam Deck, Desktop, and Big Picture
                    </ListItem>
                    <ListItem
                      title="Audio Packs"
                      href="/packs?filters=All&order=Most+Downloaded&type=AUDIO"
                    >
                      Steam Deck and Big Picture
                    </ListItem>
                  </ul>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              <NavigationMenu.Item value="center2">
                <NavigationMenu.Trigger className="group flex select-none items-center  justify-between gap-[2px] rounded-lg px-3 py-2 text-[15px] font-bold leading-none outline-none transition hover:bg-base-5-dark hover:text-white focus:shadow-[0_0_0_2px] dark:hover:bg-base-5-dark">
                  Social{" "}
                  <FaCaretDown
                    className="relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
                    aria-hidden
                  />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="absolute top-0 left-0 w-full data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight sm:w-auto">
                  <div className="grid sm:grid-cols-[0.75fr_1fr]">
                    {/* <ul className="flex-1 h-full flex p-4">
                    <ListItem className="patreon-link h-full w-full min-w-[350px]" title="Patreon" href={process.env.NEXT_PUBLIC_DOCS_URL || "/"}>
                      Keep DeckThemes running by supporting us on Patreon
                    </ListItem>
                  </ul> */}
                    <li className="grid p-4">
                      <NavigationMenu.Link asChild>
                        <a
                          className="patreon-link flex h-full w-full min-w-[250px] flex-col justify-end rounded-xl p-4"
                          href={process.env.NEXT_PUBLIC_PATREON_URL || "/"}
                        >
                          <div className="mb-[5px] text-lg font-bold leading-[1.2]">Patreon</div>
                          <p className="text-sm font-medium leading-[1.4] opacity-80">
                            Keep DeckThemes running by supporting us on Patreon
                          </p>
                        </a>
                      </NavigationMenu.Link>
                    </li>
                    <ul className="m-0 grid list-none gap-x-[10px] p-[12px] sm:w-[300px] sm:grid-flow-col sm:grid-rows-3">
                      <ListItem href="https://github.com/beebls/DeckThemes" title="GitHub">
                        Contribute to DeckThemes and CSSLoader on our GitHub
                      </ListItem>
                      {!!process.env.NEXT_PUBLIC_DISCORD_URL && (
                        <ListItem href={process.env.NEXT_PUBLIC_DISCORD_URL} title="Discord">
                          Get updates, support, and chat with the community
                        </ListItem>
                      )}
                      <ListItem
                        title="Documentation"
                        href={process.env.NEXT_PUBLIC_DOCS_URL || "/"}
                      >
                        Learn how to make your own themes and packs
                      </ListItem>
                    </ul>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>

              {/* Nav arrow thing */}
              {/* <NavigationMenu.Indicator className="top-full z-[1] flex h-[10px] items-end justify-center overflow-hidden transition-[width,transform_250ms_ease] data-[state=visible]:animate-fadeIn data-[state=hidden]:animate-fadeOut">
                <div className="relative top-[70%] h-[10px] w-[10px] rotate-[45deg] rounded-tl-[2px] bg-black dark:bg-white" />
              </NavigationMenu.Indicator> */}
            </NavigationMenu.List>
          </div>

          <div
            className="absolute top-full left-1/2 !z-[9999] flex w-full max-w-7xl -translate-x-1/2"
            style={{ justifyContent: alignValue }}
          >
            <NavigationMenu.Viewport className="relative !z-[9999] mt-[10px] h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-2xl bg-black !text-white transition-all duration-300 data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut sm:w-[var(--radix-navigation-menu-viewport-width)]" />
          </div>

          {/* Account, Upload, Submissions */}
          <div className="flex items-center gap-8 font-extrabold">
            <>
              {accountInfo?.username ? (
                <>
                  <NavigationMenu.List className="center shadow-blackA7 relative m-0 flex list-none rounded-lg p-1">
                    <NavigationMenu.Item value="end1">
                      <NavigationMenu.Trigger className="group flex select-none items-center justify-between gap-[2px] rounded-lg px-3 text-[15px] font-bold leading-none outline-none transition hover:bg-base-5-dark hover:text-white focus:shadow-[0_0_0_2px] dark:hover:bg-base-5-dark">
                        <MiniPfpDisplay accountInfo={accountInfo} goToMe hideName />
                        <FaCaretDown
                          className="relative top-[1px] transition-transform ease-in group-data-[state=open]:-rotate-180"
                          aria-hidden
                        />
                      </NavigationMenu.Trigger>
                      <NavigationMenu.Content className="absolute top-0 right-0 w-full sm:w-auto">
                        {/* Note, these don't work if you're already on the /themes page. ugh */}
                        <ul className="m-0 grid list-none gap-x-[10px] p-[12px] sm:w-[300px] sm:grid-flow-col sm:grid-rows-3">
                          <ListItem title="Profile" href="/users/me">
                            View Your Profile
                          </ListItem>
                          <ListItem title="Upload" href="/submit">
                            Submit Themes or Audio Packs
                          </ListItem>
                          {accountInfo.permissions.includes(Permissions.viewSubs) && (
                            <ListItem title="Submissions" href="/submissions">
                              View Current Submissions
                            </ListItem>
                          )}
                        </ul>
                      </NavigationMenu.Content>
                    </NavigationMenu.Item>
                  </NavigationMenu.List>
                </>
              ) : (
                <>
                  {hasCookie ? (
                    <>
                      <LoadingSpinner size={32} />
                    </>
                  ) : (
                    <>
                      <button
                        className="flex h-fit select-none items-center justify-center gap-2 rounded-full border border-borders-base3-dark px-4 py-2 text-xs font-bold text-fore-11-light transition duration-150 hover:scale-95 hover:bg-base-3-dark hover:text-fore-11-dark hover:active:scale-90 dark:text-fore-11-dark"
                        onClick={fetchDiscordUrl}
                      >
                        <div>
                          Login <span className="hidden sm:inline-block">with Discord</span>
                        </div>
                      </button>
                    </>
                  )}
                </>
              )}
            </>
          </div>
        </div>
      </NavigationMenu.Root>
    </>
  );
}

const ListItem = React.forwardRef(({ className, children, title, ...props }, forwardedRef) => (
  <li>
    <NavigationMenu.Link asChild>
      <Link
        className={twMerge(
          "block select-none rounded-[6px] p-3 text-[15px] leading-none no-underline outline-none transition-colors hover:bg-base-4-dark focus:shadow-[0_0_0_2px]",
          className
        )}
        {...props}
        // @ts-ignore
        ref={forwardedRef}
      >
        <div className="mb-[5px] font-bold leading-[1.2]">{title}</div>
        <p className="text-sm font-medium leading-[1.4] opacity-80">{children}</p>
      </Link>
    </NavigationMenu.Link>
  </li>
));
ListItem.displayName = "ListItem";
