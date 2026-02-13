import { Dropzone } from "@components/Primitives";
import { ZipSubmissionInfo } from "@customTypes/ThemeSubmissionTypes";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { toast } from "react-toastify";
import { LoadingSpinner } from "@components/Generic";
import { genericFetch } from "../../../apiHelpers";

type UploadStatus = "uploading" | "uploaded" | "error";

type ZipItem = {
  id: string;
  file: File;
  status: UploadStatus;
  blobId?: string;
  error?: string;
};

const acceptedTypes = [
  "application/zip",
  "application/x-zip",
  "application/x-zip-compressed",
];
const acceptedExtensions = [".zip"];

function createLocalId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseSizeToBytes(raw?: string) {
  if (!raw) return null;
  const match = raw.trim().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)$/i);
  if (!match) return null;
  const value = Number(match[1]);
  const unit = match[2].toUpperCase();
  const multipliers: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
  };
  return Math.round(value * (multipliers[unit] || 1));
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  const value = bytes / Math.pow(k, i);
  const digits = value >= 10 || i === 0 ? 0 : 1;
  return `${value.toFixed(digits)} ${sizes[i]}`;
}

function isAcceptedZip(file: File) {
  const type = file.type.toLowerCase();
  if (acceptedTypes.includes(type)) return true;
  const name = file.name.toLowerCase();
  return acceptedExtensions.some((ext) => name.endsWith(ext));
}

export function ZipSubmitPanel({
  setInfo,
}: {
  setInfo: Dispatch<SetStateAction<ZipSubmissionInfo>>;
}) {
  const [item, setItem] = useState<ZipItem | null>(null);

  const maxZipSizeLabel = process.env.NEXT_PUBLIC_MAX_ZIP_SIZE || "10MB";
  const maxZipSizeBytes = parseSizeToBytes(maxZipSizeLabel);

  const uploadZip = useCallback(
    (itemId: string, file: File) => {
      const formData = new FormData();
      formData.append("File", file);
      genericFetch("/blobs", {
        method: "POST",
        body: formData,
      })
        .then((json) => {
          if (!json?.id) {
            throw new Error("No id returned from upload");
          }
          setInfo({ blob: json.id });
          setItem((prev) =>
            prev && prev.id === itemId
              ? { ...prev, status: "uploaded", blobId: json.id, error: undefined }
              : prev
          );
        })
        .catch((err) => {
          toast.error(
            `Error Uploading File! ${JSON.stringify(err instanceof Error ? err.message : err)}`
          );
          setItem((prev) =>
            prev && prev.id === itemId
              ? {
                  ...prev,
                  status: "error",
                  error: err instanceof Error ? err.message : "Upload failed",
                }
              : prev
          );
        });
    },
    [setInfo]
  );

  const addFiles = useCallback(
    (incomingFiles: File[]) => {
      if (incomingFiles.length === 0) return;
      if (incomingFiles.length > 1) {
        toast.error("Only one .zip file can be uploaded.");
      }
      const file = incomingFiles[0];
      if (!isAcceptedZip(file)) {
        toast.error(`"${file.name}" is not a .zip archive.`);
        return;
      }
      if (maxZipSizeBytes && file.size > maxZipSizeBytes) {
        toast.error(`"${file.name}" is too large. Max size is ${maxZipSizeLabel}.`);
        return;
      }

      const nextItem: ZipItem = {
        id: createLocalId(),
        file,
        status: "uploading",
      };
      setInfo({ blob: "" });
      setItem(nextItem);
      uploadZip(nextItem.id, file);
    },
    [maxZipSizeBytes, maxZipSizeLabel, setInfo, uploadZip]
  );

  const removeItem = () => {
    setItem(null);
    setInfo({ blob: "" });
  };

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="w-full md:w-1/2">
          <Dropzone
            accept={`${acceptedTypes.join(",")},.zip`}
            multiple={false}
            onFilesAdded={addFiles}
            title="Drag and drop a zip file here"
            helperText={`ZIP archive up to ${maxZipSizeLabel}. One file only.`}
            buttonText="Upload zip"
          />

          <div className="mt-3 flex w-full flex-col gap-3">
            <span className="text-sm font-semibold">Selected file</span>
            {!item ? (
              <span className="text-xs text-textFadedLight dark:text-textFadedDark">
                No file selected yet.
              </span>
            ) : (
              <div className="flex w-full flex-col gap-2 rounded-xl border border-borders-base1-light bg-base-3-light p-3 dark:border-borders-base1-dark dark:bg-base-3-dark">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">{item.file.name}</span>
                  <span className="text-xs text-textFadedLight dark:text-textFadedDark">
                    {formatBytes(item.file.size)}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-textFadedLight dark:text-textFadedDark">
                    {item.status === "uploading" && (
                      <>
                        <LoadingSpinner size={14} />
                        <span>Uploading...</span>
                      </>
                    )}
                    {item.status === "uploaded" && (
                      <span className="text-emerald-600 dark:text-emerald-400">Uploaded</span>
                    )}
                    {item.status === "error" && (
                      <span className="text-red-500">
                        Upload failed{item.error ? `: ${item.error}` : ""}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    className="rounded-full border-2 border-red-500 px-3 py-1 text-xs font-semibold text-red-500 transition hover:border-red-600 hover:text-red-600"
                    onClick={removeItem}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
