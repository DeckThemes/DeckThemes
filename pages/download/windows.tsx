/* eslint-disable react/no-unescaped-entities */
import { DeckIcon } from "@components/DeckIcon";
import InstallSection from "@components/Download/InstallSection";
import Link from "next/link";

export default function WindowsDownload() {
  return (
    <>
      <main className="page-shadow mx-4 flex flex-col items-center rounded-3xl border-[1px] py-12 border-borders-base3-light dark:border-borders-base1-dark dark:bg-base-2-dark">
	  	<div className="flex h-full w-full max-w-7xl flex-col items-center justify-center gap-6 px-4 pt-4 lg:pt-24">
          {/* Headline */}
			<h1 className="mx-auto max-w-4xl text-center text-5xl font-extrabold tracking-tight sm:text-6xl">
				<span className="">
				CSSLoader <br className="block sm:hidden" />
				</span>{" "}
				for Windows
			</h1>

			{/* Blurb */}
			<p className="font-fancy mx-auto mt-6 max-w-2xl text-center text-sm font-medium leading-6 text-fore-10-light dark:text-fore-10-dark sm:text-lg">
				CSSLoader on Windows uses a native backend with a standalone frontend. You also install CSSLoader on your <Link className="text-brandBlue hover:underline" href={"/download/deck"}>Steam Deck</Link>
			</p>

			<InstallSection>
				<InstallSection.Header>
					Install CSSLoader Desktop
				</InstallSection.Header>

				<InstallSection.Content>
					<ol className="flex w-full flex-col gap-4 list-decimal">
						<li>
							<div className="">
								Download the latest .msi installer from <a className="text-brandBlue hover:underline" href="https://github.com/beebls/CSSLoader-Desktop/releases" target="_blank" rel="noreferrer">Github</a> to get started.
							</div>
						</li>

						<li>
							<div className="flex flex-row items-center">
								Run the installer and follow the on-screen instructions. Note that if this is your first time using CSSLoader Desktop, you'll be prompted to install the backend on launch.
							</div>
						</li>

						<li>
							<div className="flex flex-row items-center">
								Restart Steam
							</div>
						</li>
					</ol>
				</InstallSection.Content>
			</InstallSection>

			<InstallSection>
				<InstallSection.Header>
					Using CSSLoader Desktop
				</InstallSection.Header>

				<InstallSection.Content>
				<div className="w-full">Here's a quick rundown of how to use the CSSLoader Desktop app.</div>
					<ul className="flex w-full flex-col gap-4 list-disc">
						<li>
							<div className="flex flex-row items-center">
								Manage your themes on the Themes page. Toggle them on or off using the switch, or customize them under the Theme Settings button.
							</div>
						</li>

						<li>
							<div className="flex flex-row items-center">
								Explore all of our themes on the Store page.
							</div>
						</li>

						<li>
							<div className="flex flex-row items-center">
								Login with your token on the Settings page to star themes.
							</div>
						</li>
					</ul>
				</InstallSection.Content>
			</InstallSection>
		  </div>
      </main>
    </>
  );
}
