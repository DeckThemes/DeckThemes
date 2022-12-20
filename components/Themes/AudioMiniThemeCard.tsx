import Link from "next/link";
import { PartialCSSThemeInfo } from "../../types";

export function AudioMiniThemeCard({
  data,
  submissionId = "",
}: {
  data: any;
  submissionId?: string;
}) {
  function imageURLCreator(): string {
    if (data?.images[0]?.id) {
      return `url(${process.env.NEXT_PUBLIC_API_URL}/blobs/${data?.images[0]?.id})`;
    } else {
      return `url(https://assets.pokemon.com/assets/cms2/img/pokedex/full/258.png)`;
    }
  }

  console.log(data);
  function InnerContent() {
    return (
      <>
        <article
          key={`Theme_${data.name}`}
          className="ThemeBrowserItem_BgImg"
          style={{
            backgroundImage: imageURLCreator(),
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            borderRadius: "5px",
          }}
        >
          <style>
            {`
              .ThemeBrowserItem_BgColor:hover {
                background: #000f;
              }
              .ThemeBrowserItem_BgColor {
                background: #000c;
                transition: background 0.2s;
              }
            `}
          </style>
          <div
            className="ThemeBrowserItem_BgColor"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backdropFilter: "blur(5px)",
              width: "100%",
              height: "100%",
              borderRadius: "3px",
            }}
          >
            <span
              className="CssLoader_ThemeBrowser_SingleItem_ThemeName"
              style={{
                textAlign: "center",
                marginTop: "5px",
                fontSize: "1.25em",
                fontWeight: "bold",
                // This stuff here truncates it if it's too long
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "90%",
              }}
            >
              {data.name}
            </span>
            <span
              className="CssLoader_ThemeBrowser_SingleItem_ThemeTarget"
              style={{
                marginTop: "-6px",
                fontSize: "1em",
                textShadow: "rgb(48, 48, 48) 0px 0 10px",
              }}
            >
              {data.target}
            </span>
            {/* All of this is lovingly borrowed from Emerald's amazing work */}
            <div
              // I'm still using the format of div-with-a-bg-image, because I think that could make it a bit easier to add icons/text in front if we want
              className="AudioLoader_PackBrowser_SingleItem_PreviewImageContainer"
              style={{
                width: "200px",
                height: "150px",
                position: "relative",
              }}
            >
              <div
                style={{
                  background:
                    data.target === "Music"
                      ? "url(https://i.imgur.com/nISGpci.png)"
                      : "linear-gradient(150deg, rgba(0, 0, 0, 0) 0%, rgba(118, 118, 118, 0) 0%, rgba(255, 255, 255, 0.2) 32%, rgba(255, 255, 255, 0.2) 35%, rgba(255, 255, 255, 0.2) 38%, rgba(210, 210, 210, 0) 70%, rgba(0, 0, 0, 0) 100%) 0% 0% / cover",
                  position: "absolute",
                  left: "0",
                  width: "75%",
                  height: "100%",
                  backgroundSize: "cover",
                  zIndex: 3,
                  borderRadius: "2px",
                }}
              />
              <div
                style={{
                  backgroundImage: imageURLCreator(),
                  backgroundColor: "#21323d",
                  position: "absolute",
                  left: "0",
                  width: "75%",
                  height: "100%",
                  backgroundSize: "cover",
                  zIndex: 2,
                  borderRadius: "2px",
                }}
              />
              <div
                style={{
                  backgroundImage:
                    data.target === "Music"
                      ? 'url("https://i.imgur.com/V9t3728.png")'
                      : 'url("https://i.imgur.com/pWm35T0.png")',
                  position: "absolute",
                  right: "5%",
                  width: "20%",
                  backgroundPosition: "right",
                  height: "100%",
                  backgroundSize: "cover",
                  zIndex: 1,
                }}
              />
            </div>
            <div
              className="CssLoader_ThemeBrowser_SingleItem_AuthorVersionContainer"
              style={{
                width: "240px",
                textAlign: "center",
                display: "flex",
              }}
            >
              <span
                className="CssLoader_ThemeBrowser_SingleItem_AuthorText"
                style={{
                  marginRight: "auto",
                  fontSize: "1em",
                  textShadow: "rgb(48, 48, 48) 0px 0 10px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {data.specifiedAuthor}
              </span>
              <span
                className="CssLoader_ThemeBrowser_SingleItem_VersionText"
                style={{
                  marginLeft: "auto",
                  fontSize: "1em",
                  textShadow: "rgb(48, 48, 48) 0px 0 10px",
                }}
              >
                {data.version}
              </span>
            </div>
          </div>
        </article>
      </>
    );
  }
  if (submissionId) {
    return (
      <div className="text-textDark hover:translate-y-1 transition-all md:w-[260px] w-full">
        <div>
          <InnerContent />
        </div>
      </div>
    );
  }

  return (
    <div className="text-textDark hover:translate-y-1 transition-all md:w-[260px] w-full">
      <Link href={`/themes/view?themeId=${data.id}`}>
        <InnerContent />
      </Link>
    </div>
  );
}
