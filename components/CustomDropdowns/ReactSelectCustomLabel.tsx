export function ReactSelectCustomLabel({
  mainText,
  bubbleValue = undefined,
}: {
  mainText: string;
  bubbleValue?: string | number;
}) {
  return (
    <div className="w-full flex items-center justify-between px-4 py-2 gap-2 border-cardLight dark:border-cardDark">
      <span className="w-fit h-8 flex items-center">
        {mainText !== "AwaitingApproval" ? mainText : "Awaiting Approval"}
      </span>
      {bubbleValue !== undefined && (
        <span className="bg-cardLight dark:bg-cardDark p-2 rounded-3xl w-8 h-8 flex items-center justify-center text-center">
          {bubbleValue}
        </span>
      )}
    </div>
  );
}
