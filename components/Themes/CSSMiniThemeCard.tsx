import Link from "next/link";
import { PartialCSSThemeInfo } from "../../types";

export function CSSMiniThemeCard({
  data,
  submissionId = "",
}: {
  data: PartialCSSThemeInfo;
  submissionId?: string;
}) {
  function imageURLCreator(): string {
    if (data?.images[0]?.id && data.images[0].id !== "MISSING") {
      return `url(${process.env.NEXT_PUBLIC_API_URL}/blobs/${data?.images[0].id})`;
    } else {
      return `url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Steam_Deck_logo_%28blue_background%29.svg/2048px-Steam_Deck_logo_%28blue_background%29.svg.png)`;
    }
  }

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
            <div
              className="CssLoader_ThemeBrowser_SingleItem_PreviewImage"
              style={{
                width: "240px",
                backgroundImage: imageURLCreator(),
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "150px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            />
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
      <div className="text-textDark hover:translate-y-1 transition-all sm:w-[260px] w-full">
        <div>
          <InnerContent />
        </div>
      </div>
    );
  }

  return (
    <div className="text-textDark hover:translate-y-1 transition-all sm:w-[260px] w-full">
      <Link href={`/themes/view?themeId=${data.id}`}>
        <InnerContent />
      </Link>
    </div>
  );
}
