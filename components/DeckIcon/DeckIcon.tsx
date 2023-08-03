import { useTheme } from "next-themes";

export function DeckIcon({ iconName }: { iconName: string }) {
  const { resolvedTheme } = useTheme();
  // I don't feel like renaming the icons, so we're bringing this back
  const iconSrc = `/deck-icons/${iconName}-${resolvedTheme === "dark" ? "light" : "dark"}.svg`;

  // eslint-disable-next-line @next/next/no-img-element
  return <img className="max-w-4 mx-2 max-h-4" alt="Steam Deck icon" src={iconSrc} />;
}
