/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        screenMinusHeader: "calc(100vh - 4rem)",
      },
      colors: {
        cssPurple: "#de2cf7",
        audioBlue: "rgb(26,159,255)",
        discordColor: "#5865F2",
        bgDark: "#2e2e2e",
        bgLight: "#e2e2e2",
        // These are used to "transform" the card values to look like the bg values
        lightenerDark: "rgba(255,255,255,0.1)",
        lightenerLight: "rgba(255,255,255,0.3)",
        cardDark: "#1e1e1e",
        cardLight: "#c2c2c2",
        borderDark: "#0e0e0e",
        borderLight: "#a2a2a2",
        darkBorderDark: "#020202",
        darkBorderLight: "rgb(140,140,140)",
        textLight: "#000",
        textFadedLight: "#333",
        textDark: "#fff",
        textFadedDark: "#aaa",
      },
    },
    fontFamily: {
      sans: ["Montserrat", "sans-serif"],
      serif: ["serif"],
    },
  },
  plugins: [],
  darkMode: "class",
};
