import { Dispatch, SetStateAction } from "react";
import { GitSubmissionInfo } from "../../types";
import { MiniDivider } from "../Generic";
import {
  fieldClasses,
  fieldContainerClasses,
  fieldTitleClasses,
  sectionContainerClasses,
} from "./SubmitPageTailwindClasses";

export function GitSubmitPanel({
  info,
  setInfo,
}: {
  info: GitSubmissionInfo;
  setInfo: Dispatch<SetStateAction<GitSubmissionInfo>>;
}) {
  return (
    <>
      <div className={`${sectionContainerClasses}`}>
        <div className={`${fieldContainerClasses}`}>
          <span className={`${fieldTitleClasses}`}>Repo URL</span>
          <input
            type="text"
            value={info.url}
            onChange={(e) => setInfo({ ...info, url: e.target.value })}
            className={fieldClasses}
          />
        </div>
        <MiniDivider />
        <div className={`${fieldContainerClasses}`}>
          <span className={`${fieldTitleClasses}`}>Commit ID</span>
          <input
            type="text"
            value={info.commit}
            placeholder="Leave blank for latest commit"
            onChange={(e) => setInfo({ ...info, commit: e.target.value })}
            className={fieldClasses}
          />
        </div>
        <MiniDivider />
        <div className={`${fieldContainerClasses}`}>
          <span className={`${fieldTitleClasses}`}>Subfolder</span>
          <input
            type="text"
            value={info.subfolder}
            onChange={(e) => setInfo({ ...info, subfolder: e.target.value })}
            className={fieldClasses}
          />
        </div>
      </div>
    </>
  );
}
