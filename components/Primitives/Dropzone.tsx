import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { twMerge } from "tailwind-merge";
import { SquishyButton } from "./SquishyButton";

type DropzoneProps = {
  onFilesAdded: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  title?: string;
  helperText?: string;
  buttonText?: string;
  rootClass?: string;
  className?: string;
};

export function Dropzone({
  onFilesAdded,
  accept,
  multiple = false,
  disabled = false,
  title = "Drag and drop files here",
  helperText = "",
  buttonText = "Upload files",
  rootClass = "",
  className = "",
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragDepth = useRef(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || disabled) return;
    onFilesAdded(Array.from(fileList));
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current = 0;
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current += 1;
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.preventDefault();
    event.stopPropagation();
    dragDepth.current -= 1;
    if (dragDepth.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    event.target.value = "";
  };

  return (
    <div className={twMerge("flex w-full flex-col gap-3", rootClass)}>
      <div
        className={twMerge(
          "flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition",
          isDragging
            ? "border-brandBlue bg-brandBlue/10"
            : "border-borders-base1-light dark:border-borders-base1-dark",
          disabled ? "pointer-events-none opacity-60" : "",
          className
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        aria-disabled={disabled}
      >
        <span className="text-sm font-semibold">{title}</span>
        {helperText && (
          <span className="text-xs text-textFadedLight dark:text-textFadedDark">
            {helperText}
          </span>
        )}
        <SquishyButton
          buttonProps={{ type: "button", disabled }}
          onClick={() => {
            if (!disabled) {
              inputRef.current?.click();
            }
          }}
        >
          {buttonText}
        </SquishyButton>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
