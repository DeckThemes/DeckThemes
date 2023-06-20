import { useMemo, useState } from "react";
import { OrderValueToggle } from "./OrderValueToggle";
import { HighlightCardView } from "./HighlightCardView";
import { RadioDropdown, HorizontalRadio } from "@components/Primitives";
import { TransitionedCarouselTitle } from "..";

export function HighlightCarousel({
  options,
}: {
  options: {
    title: string;
    buttonText?: string;
    searchFilter: string;
    hrefLink: string;
  }[];
}) {
  const [orderValue, setOrderValue] = useState<string>("Popular");
  const [transitioning, setTransitioning] = useState<boolean>(false);
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
      <div className="flex flex-col w-full gap-4 max-w-7xl">
        <div className="w-full flex flex-col items-center pb-4">
          <TransitionedCarouselTitle
            setTransitioning={setTransitioning}
            titles={options.map((e) => e.title)}
            currentTitle={currentOption.title}
          />
          <div className="pt-24 flex flex-col md:flex-row gap-4 items-center justify-between w-full ">
            <div className="flex flex-col sm:flex-row self-center">
              <RadioDropdown
                triggerClass="flex md:hidden"
                options={options.map((e) => ({
                  value: e.searchFilter,
                  displayText: e.title,
                }))}
                value={selectedRadioOption}
                onValueChange={setRadioOption}
              />
              <div className="hidden md:flex">
                <HorizontalRadio
                  options={options.map((e) => ({
                    value: e.searchFilter,
                    displayText: e?.buttonText || e.title,
                    disabled: transitioning,
                  }))}
                  value={selectedRadioOption}
                  onValueChange={setRadioOption}
                />
              </div>
            </div>
            <OrderValueToggle
              {...{ orderValue, setOrderValue }}
              orderOptions={["Popular", "Recent"]}
            />
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-col w-full gap-4">
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
