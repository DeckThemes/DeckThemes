import { Dispatch, SetStateAction } from "react";
import { CSSSubmissionInfo } from "../../types";
import {
  fieldClasses,
  fieldContainerClasses,
  fieldTitleClasses,
  sectionContainerClasses,
} from "./SubmitPageTailwindClasses";

export function CSSSubmitPanel({
  info,
  setInfo,
}: {
  info: CSSSubmissionInfo;
  setInfo: Dispatch<SetStateAction<CSSSubmissionInfo>>;
}) {
  return (
    <>
      <div className={`${sectionContainerClasses}`}>
        <div className={`${fieldContainerClasses}`}>
          <span className={`${fieldTitleClasses}`}>Name</span>
          <input
            type="text"
            value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
            className={fieldClasses}
          />
        </div>
        <div className={`${fieldContainerClasses}`}>
          <span className={`${fieldTitleClasses}`}>CSS</span>
          <textarea
            value={info.css}
            onChange={(e) => setInfo({ ...info, css: e.target.value })}
            className={`${fieldClasses} w-full h-64`}
            placeholder="/* Insert Your CSS Here */"
          />
        </div>
      </div>
    </>
  );
}
