import { useTheme } from "next-themes";

export function ThemedLogoVector({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const { resolvedTheme } = useTheme();
  return (
    <>
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 420 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <linearGradient
          id="roller_gradient"
          x1="171.562"
          y1="5"
          x2="171.562"
          y2="158.75"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#AC6BF0" />
          <stop offset="0.65625" stop-color="#6883F7" />
          <stop offset="1" stop-color="#179FFF" />
        </linearGradient>
        <path
          d="M133.125 286.875C133.125 272.701 144.576 261.25 158.75 261.25V248.438C158.75 213.043 187.418 184.375 222.812 184.375H338.125C352.299 184.375 363.75 172.924 363.75 158.75V133.125V60.6543C393.619 71.2246 415 99.6523 415 133.125V158.75C415 201.191 380.566 235.625 338.125 235.625H222.812C215.766 235.625 210 241.391 210 248.438V261.25C224.174 261.25 235.625 272.701 235.625 286.875V389.375C235.625 403.549 224.174 415 210 415H158.75C144.576 415 133.125 403.549 133.125 389.375V286.875Z"
          fill={resolvedTheme === "light" ? "black" : "white"}
        />
        <path
          d="M56.25 5C27.9824 5 5 27.9824 5 56.25V107.5C5 135.768 27.9824 158.75 56.25 158.75H286.875C315.143 158.75 338.125 135.768 338.125 107.5V56.25C338.125 27.9824 315.143 5 286.875 5H56.25Z"
          fill="url(#roller_gradient)"
        />
      </svg>
    </>
  );
}
