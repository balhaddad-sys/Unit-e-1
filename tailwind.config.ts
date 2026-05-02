import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fbf8f1",
        ink: "#1a1612",
        emerald: "#00713c",
        crimson: "#a02437",
        oud: "#7a4a1b",
        khaleej: "#1c4f7a",
        dusk: "#5e3a72",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
        ar: ["var(--font-reem)", "Noto Naskh Arabic", "serif"],
      },
      maxWidth: {
        screen: "720px",
      },
    },
  },
  plugins: [],
};

export default config;
