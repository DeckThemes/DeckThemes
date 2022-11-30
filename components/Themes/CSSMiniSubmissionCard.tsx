import Link from "next/link";
import { Url } from "url";
import { PartialCSSThemeInfo } from "../../types";

export function CSSMiniSubmissionCard({ data }: { data: PartialCSSThemeInfo }) {
  function imageURLCreator(): string {
    if (data?.images[0]?.id) {
      return `url(${process.env.API_URL}/blobs/${data?.images[0]?.id})`;
    } else {
      return `url(https://assets.pokemon.com/assets/cms2/img/pokedex/full/258.png)`;
    }
  }

  return (
    <div className="text-textDark">
      <Link href={`/theme/${data.id}`}>
        <article
          key={`Theme_${data.name}`}
          className="CssLoader_ThemeBrowser_SingleItem_BgImage w-[260px]"
          style={{
            backgroundImage: imageURLCreator(),
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            borderRadius: "5px",
          }}
        >
          <div
            className="CssLoader_ThemeBrowser_SingleItem_BgOverlay"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "RGBA(0,0,0,0.8)",
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
      </Link>
    </div>
  );
}
