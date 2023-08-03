import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

export function PageSelector({
  total,
  perPage,
  currentPage,
  onChoose,
}: {
  total: number;
  perPage: number;
  currentPage: number;
  onChoose: (page: number) => void;
}) {
  const totalPages =
    Math.trunc(total / perPage) + (total % perPage === 0 ? 0 : 1);
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {total > perPage ? (
          <>
            <button
              className={`text-xl ${
                currentPage !== 1
                  ? "visible cursor-pointer"
                  : "invisible cursor-default"
              }`}
              onClick={() => {
                currentPage !== 1 && onChoose(currentPage - 1);
              }}
            >
              <BsArrowLeft />
            </button>
            {Array(totalPages)
              .fill("")
              .map((_, i) => (
                <button
                  key={`Page ${i + 1}`}
                  className={`${
                    currentPage === i + 1
                      ? "bg-borderLight dark:bg-borderDark"
                      : "bg-cardLight dark:bg-cardDark"
                  } flex h-8 w-8 items-center justify-center rounded-3xl`}
                  onClick={() => onChoose(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            <button
              className={`text-xl ${
                currentPage !== totalPages
                  ? "visible cursor-pointer"
                  : "invisible cursor-default"
              }`}
              onClick={() => {
                currentPage !== totalPages && onChoose(currentPage + 1);
              }}
            >
              <BsArrowRight />
            </button>
          </>
        ) : null}
      </div>
    </>
  );
}
