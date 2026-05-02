import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Kuwait palette — warm cream surfaces, ink-on-cream typography
        bg: "#fbf8f1",
        surface: "#ffffff",
        "surface-2": "#f4efe2",
        "surface-3": "#ebe4d2",
        ink: "#1a1816",
        "ink-2": "#4a4640",
        "ink-3": "#847f74",
        "ink-4": "#b8b1a1",
        // Single accent — emerald with Kuwaiti-flag green pull
        accent: "#2d6e3e",
        "accent-2": "#1d4e2d",
        gold: "#c9a13b",
        crimson: "#c43e3e",
        // Faction tints (used sparingly — for portraits and quest tags)
        "f-tribal": "#a1654a",
        "f-merchant": "#9b6f2e",
        "f-government": "#4a6f9b",
        "f-religious": "#6f4a9b",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        ar: ["var(--font-reem)", "SF Arabic", "system-ui", "sans-serif"],
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
      },
      borderRadius: {
        DEFAULT: "12px",
        lg: "16px",
        xl: "20px",
        full: "999px",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        rewardIn: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        rewardOut: {
          to: { opacity: "0", transform: "translateX(20px)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease",
        slideUp: "slideUp 0.4s cubic-bezier(.32,.72,0,1)",
      },
    },
  },
  plugins: [],
};

export default config;
