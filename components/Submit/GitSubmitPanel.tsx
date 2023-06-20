import { Dispatch, SetStateAction } from "react";
import { GitSubmissionInfo } from "../../types";
import { LabelledInput } from "@components/Primitives";

export function GitSubmitPanel({
  info,
  setInfo,
}: {
  info: GitSubmissionInfo;
  setInfo: Dispatch<SetStateAction<GitSubmissionInfo>>;
}) {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full gap-4">
        <LabelledInput
          rootClass="w-full md:w-1/2"
          label="Repo URL"
          value={info.url}
          onValueChange={(e) => setInfo({ ...info, url: e })}
        />
        <LabelledInput
          rootClass="w-full md:w-1/2"
          label="Commit ID"
          value={info.commit}
          onValueChange={(e) => setInfo({ ...info, commit: e })}
        />
        <LabelledInput
          rootClass="w-full md:w-1/2"
          label="Subfolder"
          value={info.subfolder}
          onValueChange={(e) => setInfo({ ...info, subfolder: e })}
        />
      </div>
    </>
  );
}
