/* eslint-disable @next/next/no-img-element */
import { LoadingSpinner } from "@components/Generic";
import { Dropzone } from "@components/Primitives";
import { MetaInfo } from "@customTypes/ThemeSubmissionTypes";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { genericFetch } from "../../../apiHelpers";
import { fieldTitleClasses, metaFieldContainerClasses } from "../SubmitPageTailwindClasses";

type UploadStatus = "uploading" | "uploaded" | "error";

type ImageItem = {
  id: string;
  file: File;
  previewUrl: string;
  status: UploadStatus;
  blobId?: string;
  error?: string;
};

const maxFiles = 5;
const acceptedTypes = ["image/jpeg", "image/png"];
const acceptedExtensions = [".jpg", ".jpeg", ".png"];

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

function isAcceptedImage(file: File) {
  const type = file.type.toLowerCase();
  if (acceptedTypes.includes(type)) return true;
  const name = file.name.toLowerCase();
  return acceptedExtensions.some((ext) => name.endsWith(ext));
}

export function ImageSubmissionPanel({ setInfo }: { setInfo: Dispatch<SetStateAction<MetaInfo>> }) {
  const [items, setItems] = useState<ImageItem[]>([]);
  const itemsRef = useRef<ImageItem[]>([]);

  const maxImageSizeLabel = process.env.NEXT_PUBLIC_MAX_IMG_SIZE || "1MB";
  const maxImageSizeBytes = parseSizeToBytes(maxImageSizeLabel);

  useEffect(() => {
    setInfo((prev) => {
      const nextBlobs = items.map((item) => item.blobId || "");
      const same =
        prev.imageBlobs.length === nextBlobs.length &&
        prev.imageBlobs.every((value, index) => value === nextBlobs[index]);
      if (same) return prev;
      return { ...prev, imageBlobs: nextBlobs };
    });
  }, [items, setInfo]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const uploadImage = useCallback((itemId: string, file: File) => {
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
        setItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  status: "uploaded",
                  blobId: json.id,
                  error: undefined,
                }
              : item
          )
        );
      })
      .catch((err) => {
        toast.error(
          `Error Uploading Image! ${JSON.stringify(err instanceof Error ? err.message : err)}`
        );
        setItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  status: "error",
                  error: err instanceof Error ? err.message : "Upload failed",
                }
              : item
          )
        );
      });
  }, []);

  const addFiles = useCallback(
    (incomingFiles: File[]) => {
      if (incomingFiles.length === 0) return;
      const remainingSlots = maxFiles - items.length;
      if (remainingSlots <= 0) {
        toast.error(`You can only upload ${maxFiles} images.`);
        return;
      }
      const validFiles: File[] = [];
      incomingFiles.forEach((file) => {
        if (!isAcceptedImage(file)) {
          toast.error(`"${file.name}" is not a .jpg or .png image.`);
          return;
        }
        if (maxImageSizeBytes && file.size > maxImageSizeBytes) {
          toast.error(`"${file.name}" is too large. Max size is ${maxImageSizeLabel}.`);
          return;
        }
        validFiles.push(file);
      });
      if (validFiles.length === 0) return;
      if (validFiles.length > remainingSlots) {
        toast.error(`Only ${remainingSlots} more image${remainingSlots === 1 ? "" : "s"} allowed.`);
      }

      const filesToAdd = validFiles.slice(0, remainingSlots);
      const newItems: ImageItem[] = filesToAdd.map((file) => ({
        id: createLocalId(),
        file,
        previewUrl: URL.createObjectURL(file),
        status: "uploading",
      }));

      setItems((prev) => [...prev, ...newItems]);
      newItems.forEach((item) => uploadImage(item.id, item.file));
    },
    [items.length, maxImageSizeBytes, maxImageSizeLabel, uploadImage]
  );

  const removeItem = (item: ImageItem) => {
    URL.revokeObjectURL(item.previewUrl);
    setItems((prev) => prev.filter((entry) => entry.id !== item.id));
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    setItems((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  return (
    <div className={`${metaFieldContainerClasses}`}>
      <span className={`${fieldTitleClasses}`}>Images</span>
      <div className="flex w-full flex-col gap-4">
        <Dropzone
          accept="image/png,image/jpeg,.png,.jpg,.jpeg"
          multiple
          onFilesAdded={addFiles}
          title="Drag and drop images here"
          helperText={`JPG or PNG, up to ${maxImageSizeLabel} each. Max ${maxFiles} images.`}
          buttonText="Upload images"
        />

        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-semibold">
              Selected images ({items.length}/{maxFiles})
            </span>
          </div>
          {items.length === 0 ? (
            <span className="text-xs text-textFadedLight dark:text-textFadedDark">
              No images selected yet.
            </span>
          ) : (
            items.map((item, index) => (
              <div
                key={item.id}
                className="flex w-full flex-col gap-3 rounded-xl border border-borders-base1-light bg-base-3-light p-3 dark:border-borders-base1-dark dark:bg-base-3-dark md:flex-row md:items-center"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-borders-base1-light dark:border-borders-base1-dark">
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-1 top-1 rounded-full bg-brandBlue px-2 py-0.5 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1">
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
                <div className="flex flex-row flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="rounded-full border-2 border-borders-base1-light px-3 py-1 text-xs font-semibold transition hover:border-borders-base2-light disabled:pointer-events-none disabled:opacity-50 dark:border-borders-base1-dark hover:dark:border-borders-base2-dark"
                    onClick={() => moveItem(index, index - 1)}
                    disabled={index === 0}
                  >
                    Move Up
                  </button>
                  <button
                    type="button"
                    className="rounded-full border-2 border-borders-base1-light px-3 py-1 text-xs font-semibold transition hover:border-borders-base2-light disabled:pointer-events-none disabled:opacity-50 dark:border-borders-base1-dark hover:dark:border-borders-base2-dark"
                    onClick={() => moveItem(index, index + 1)}
                    disabled={index === items.length - 1}
                  >
                    Move Down
                  </button>
                  <button
                    type="button"
                    className="rounded-full border-2 border-red-500 px-3 py-1 text-xs font-semibold text-red-500 transition hover:border-red-600 hover:text-red-600"
                    onClick={() => removeItem(item)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
