import { Dispatch, SetStateAction } from "react";
import { CSSSubmissionInfo } from "../../types";
import {
  fieldClasses,
  fieldContainerClasses,
  fieldTitleClasses,
  sectionContainerClasses,
} from "./SubmitPageTailwindClasses";
import { LabelledInput, LabelledTextArea } from "@components/Primitives";

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
        <LabelledInput
          rootClass="w-full md:w-1/2"
          label="Name"
          value={info.name}
          onValueChange={(e) => setInfo({ ...info, name: e })}
        />
        <LabelledTextArea
          rootClass="w-full md:w-1/2"
          label="CSS"
          value={info.css}
          onValueChange={(e) => setInfo({ ...info, css: e })}
        />
      </div>
    </>
  );
}
