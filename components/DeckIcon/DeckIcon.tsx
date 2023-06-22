import { useTheme } from "next-themes";

export function DeckIcon ({ iconName } : { iconName: string}) {
	const { theme } = useTheme();
	const iconSrc = `/deck-icons/${iconName}-${theme === 'light' ? 'dark' : 'light'}.svg`;

	// eslint-disable-next-line @next/next/no-img-element
	return <img className="mx-2 max-w-4 max-h-4" alt="Steam Deck icon" src={iconSrc} />;
}