/* eslint-disable react/no-unescaped-entities */
import { DeckIcon } from "@components/DeckIcon";
import InstallSection from "@components/Download/InstallSection";
import Link from "next/link";

export default function WindowsDownload() {
  return (
    <>
      <div className="flex h-full w-full max-w-7xl flex-col items-center justify-center gap-6 px-4 pt-4 lg:pt-24">
        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-center text-5xl font-extrabold tracking-tight sm:text-6xl">
          <span className="">
            CSS Loader <br className="block sm:hidden" />
          </span>{" "}
          for Windows
        </h1>
        {/* Blurb */}
        <p className="font-fancy mx-auto mt-6 max-w-2xl text-center text-sm font-medium leading-6 text-fore-10-light dark:text-fore-10-dark sm:text-lg">
          CSS Loader on Windows uses a native backend with a standalone frontend. You also install
          CSS Loader on your{" "}
          <Link className="text-brandBlue hover:underline" href={"/download/deck"}>
            Steam Deck
          </Link>
        </p>
        <InstallSection>
          <InstallSection.Header>Install CSS Loader Desktop</InstallSection.Header>

          <InstallSection.Content>
            <ol className="flex w-full list-decimal flex-col gap-4">
              <li>
                <div className="">
                  Download the latest .msi installer from{" "}
                  <a
                    className="text-brandBlue hover:underline"
                    href="https://github.com/beebls/CSSLoader-Desktop/releases"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Github
                  </a>{" "}
                  to get started.
                </div>
              </li>

              <li>
                <div className="flex flex-row items-center">
                  Run the installer and follow the on-screen instructions. Note that if this is your
                  first time using CSS Loader Desktop, you'll be prompted to install the backend on
                  launch.
                </div>
              </li>
              <li>
                <div>
                  Your antivirus may flag the backend executable, if so, please allow it to run.{" "}
                  <a
                    className="text-brandBlue hover:underline"
                    href="https://github.com/DeckThemes/SDH-CssLoader"
                    target="_blank"
                    rel="noreferrer"
                  >
                    The source code
                  </a>{" "}
                  and{" "}
                  <a
                    className="text-brandBlue hover:underline"
                    href="https://github.com/DeckThemes/SDH-CssLoader/releases"
                    target="_blank"
                    rel="noreferrer"
                  >
                    released binaries
                  </a>{" "}
                  are both public for you to audit
                </div>
              </li>

              <li>
                <div className="flex flex-col items-center gap-4">
                  Windows contains an oddity that makes it impossible to create a symlink without
                  elevated permissions or developer mode. CSS Loader requires a symlink to support
                  local images or fonts.
                  <br />
                  Enable developer mode on Windows as follows:
                  <ul className="flex w-full list-disc flex-col gap-4 pl-16">
                    <li>Open Settings</li>
                    <li>
                      Select 'Privacy & Security' On Windows 10, this menu is called 'Updates &
                      Security'
                    </li>
                    <li>Select 'For developers'</li>
                    <li>Enable 'Developer Mode'</li>
                    <li>
                      If CSS Loader's backend is already installed, reboot your machine for this to
                      take effect.
                    </li>
                    <li>Developer Mode may be disabled after one reboot</li>
                  </ul>
                </div>
              </li>
            </ol>
          </InstallSection.Content>
        </InstallSection>
        <InstallSection>
          <InstallSection.Header>Using CSS Loader Desktop</InstallSection.Header>

          <InstallSection.Content>
            <ul className="flex w-full list-disc flex-col gap-4">
              <li>
                <div>
                  The <b>Themes</b> tab is where you can toggle and customize your installed themes.
                  All installed themes are displayed here.
                </div>
              </li>

              <li>
                <div>
                  The <b>Store</b> is where you'll find new themes to download, browse and install
                  at your will, and <b>Login with Token</b> to be able to star themes.
                </div>
              </li>

              <li>
                <div>
                  <b>Manage</b> contains buttons to update and delete your installed themes.
                </div>
              </li>

              <li>
                <div>
                  <b>Settings</b> contains an input field for your DeckThemes login token, as well
                  as additional settings for CSS Loader.
                </div>
              </li>
            </ul>
          </InstallSection.Content>
        </InstallSection>
        <span className="text-xl">
          More info can be found on{" "}
          <a
            href="https://github.com/beebls/CSSLoader-Desktop#cssloader-desktop"
            className="text-brandBlue hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            CSS Loader Desktop's readme
          </a>
        </span>
      </div>
    </>
  );
}
