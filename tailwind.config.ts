import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        barlow: ["var(--font-barlow)"],
      },
      colors: {
        primary: '#1D4ED8', // Example primary color
        secondary: '#6B7280', // Example secondary color
        destructive: '#DC2626', // Example destructive color
        bloodRed: '#B91C1C', // Custom blood red color
      },
    },
  },
  plugins: [],
};

export default config;