import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiArrowDown } from "react-icons/fi";
import { genericGET, getThemeById } from "../../api";
import { ThemeImageCarousel } from "../../components";
import { FullCSSThemeInfo } from "../../types";

export default function FullThemeViewPage() {
  const router = useRouter();
  let { id } = router.query;

  let [themeData, setThemeData] = useState<FullCSSThemeInfo | undefined>(undefined);

  useEffect(() => {
    let parsedId: string = "";
    // this is here because for some reason @types/next thinks that router.query can be an array of strings
    if (Array.isArray(id)) {
      parsedId = id[0];
    } else {
      parsedId = id || "";
    }

    // Actual useful code starts here
    async function getThemeData() {
      const data = await genericGET(`/css_themes/${parsedId}`, "Theme Fetch Failed!");
      // const data = await getThemeById(parsedId);
      setThemeData(data);
    }
    getThemeData();
  }, [id]);
  return (
    <main>
      {themeData !== undefined ? (
        <>
          <h1>{themeData.name}</h1>
          <h3>{themeData.target}</h3>
          <h3>{themeData.specifiedAuthor}</h3>
          <h3>{themeData.version}</h3>
          {themeData.images !== undefined && <ThemeImageCarousel data={themeData} />}
          {themeData.download !== undefined ? (
            <>
              <button
                className="flex items-center bg-cardLight dark:bg-cardDark p-2 text-3xl rounded-full"
                onClick={() => {
                  themeData !== undefined &&
                    location.assign(`${process.env.API_URL}/blobs/${themeData.download.id}`);
                }}
              >
                <div className="bg-bgLight dark:bg-bgDark p-2 rounded-full">
                  <FiArrowDown size={48} />
                </div>
                <span className="font-semibold ml-2 mr-2">{themeData.download.downloadCount}</span>
                <span className="pr-3">
                  Download
                  {themeData.download.downloadCount !== 1 ? "s" : ""}
                </span>
              </button>
            </>
          ) : (
            <span>Error! No Download Information</span>
          )}
        </>
      ) : (
        <span>Error! Invalid Theme ID</span>
      )}
    </main>
  );
}
