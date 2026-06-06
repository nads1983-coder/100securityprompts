import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        muted: "#667085",
        line: "#d9dee7",
        soft: "#f6f8fb",
        panel: "#ffffff",
        teal: "#0f766e",
        amber: "#b45309",
        danger: "#b42318"
      },
      boxShadow: {
        line: "0 0 0 1px rgba(17, 24, 39, 0.08)",
        soft: "0 16px 38px rgba(17, 24, 39, 0.08)"
      }
    },
  },
  plugins: [],
};

export default config;
