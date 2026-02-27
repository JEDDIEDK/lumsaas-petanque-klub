import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        sand: "#F5F2E9",
        charcoal: "#2C2C2C",
        stone: "#8A8A8A",
        moss: "#4B5D3A"
      },
      boxShadow: {
        card: "0 10px 30px rgba(44, 44, 44, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
