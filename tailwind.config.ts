import type { Config } from "tailwindcss";

// Palette taken from the real Itamarati identity:
// navy from the logo lettering, yellow from the logo stars and storefront.
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f4fa",
          100: "#e1e8f3",
          200: "#c3d0e6",
          300: "#93a9cf",
          400: "#5f7fb3",
          500: "#3f6199",
          600: "#324f82",
          700: "#2b4579", // logo navy
          800: "#233a66",
          900: "#1c2f53",
          950: "#111d36",
        },
        accent: {
          50: "#fffbeb",
          100: "#fff3c2",
          200: "#ffe78a",
          300: "#ffd94d",
          400: "#fbcf2e",
          500: "#f5c21b", // logo / storefront yellow
          600: "#d9a30a",
          700: "#a67a06",
          800: "#7d5c08",
          900: "#5c440a",
          950: "#2e2205",
        },
        ink: "#0d1117",
        paper: "#f5f2ea",
        surface: {
          dark: "#0d1117",
          card: "#ffffff",
          muted: "#f5f2ea",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "0.875rem",
        "3xl": "1.25rem",
        "4xl": "1.75rem",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(13,17,23,0.06)",
        soft: "0 8px 24px -12px rgba(13,17,23,0.18)",
        glow: "4px 4px 0 0 #0d1117",
        hard: "6px 6px 0 0 #0d1117",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
