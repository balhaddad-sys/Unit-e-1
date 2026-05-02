import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fbf8f1",
        ink: "#1a1816",
        ash: "#5a5852",
        muted: "#8c8a83",
        line: "#e7e1d2",
        card: "#ffffff",
        accent: "var(--accent)",
        accent2: "var(--accent2)",
        accentBg: "var(--accent-bg)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
        arabic: ["var(--font-reem)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        page: "720px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,15,12,0.04), 0 4px 12px rgba(15,15,12,0.04)",
        glow: "0 0 0 1px var(--accent), 0 4px 18px var(--accent-bg)",
      },
    },
  },
  plugins: [],
};

export default config;
