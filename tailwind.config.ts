import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        panel: "#111",
        border: "#222",
        muted: "#888",
        accent: "#f59e0b",
        up: "#22c55e",
        down: "#ef4444",
      },
    },
  },
  plugins: [],
} satisfies Config;
