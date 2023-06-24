import { useTheme } from "next-themes";

export function DeckIcon({ iconName }: { iconName: string }) {
  const { resolvedTheme } = useTheme();
  const iconSrc = `/deck-icons/${iconName}-${resolvedTheme}.svg`;

  // eslint-disable-next-line @next/next/no-img-element
  return <img className="max-w-4 mx-2 max-h-4" alt="Steam Deck icon" src={iconSrc} />;
}
