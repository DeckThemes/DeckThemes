import { useMemo, useState } from "react";
import { HighlightCardView } from "@components/HomePage/HighlightCardView";
import { RadioDropdown, HorizontalRadio, TwoItemToggle } from "@components/Primitives";

export function DesktopHighlights({
  options,
}: {
  options: {
    title: string;
    buttonText?: string;
    searchFilter: string;
    hrefLink: string;
  }[];
}) {
  // this can be condensed since we're only handling one option now but i don't have it in me to do that right now
  const [orderValue, setOrderValue] = useState<string>("Popular");
  const orderUrl = useMemo(
    () => `&order=${orderValue === "Popular" ? "Most Downloaded" : "Last Updated"}`,
    [orderValue]
  );
  const [selectedRadioOption, setRadioOption] = useState<string>(options[0].searchFilter);
  const currentOption = useMemo(
    () => options.find((e) => e.searchFilter === selectedRadioOption) || options[0],
    [selectedRadioOption]
  );

  return (
    <>
      <div className="mb-24 flex w-full max-w-7xl flex-col gap-4">
        <div className="flex w-full flex-col items-center pb-4">
          <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row ">
            <h2 className="text-5xl font-extrabold">{currentOption.title}</h2>
            <TwoItemToggle
              options={[
                { value: "Popular", displayText: "Popular" },
                { value: "Recent", displayText: "Recent" },
              ]}
              value={orderValue}
              onValueChange={setOrderValue}
            />
          </div>
        </div>
        <div className="flex w-full flex-col-reverse gap-4 sm:flex-col">
          <div>
            <HighlightCardView
              apiURL={`/themes?perPage=7&filters=${currentOption.searchFilter}${orderUrl}`}
              viewMoreURL={`${currentOption.hrefLink + orderUrl}`}
            />
          </div>
        </div>
      </div>
    </>
  );
}
