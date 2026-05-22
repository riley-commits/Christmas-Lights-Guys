import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#FBF7F2",
          subtle: "#F3EDE4",
          card: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#1A1A1A",
          muted: "#5C5C5C",
          subtle: "#8A8A8A",
        },
        line: {
          DEFAULT: "#E6DFD3",
          strong: "#CFC6B5",
        },
        brand: {
          DEFAULT: "#C8102E",
          dark: "#A40D26",
          soft: "#FCE7EB",
        },
        pine: {
          DEFAULT: "#1F6B3A",
          dark: "#155029",
          soft: "#E2F0E7",
        },
        amber: {
          DEFAULT: "#D98E1F",
          soft: "#FBEFD8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["2.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "800" }],
        "display-lg": ["2rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        "display-md": ["1.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
      },
      borderRadius: {
        sm: "0.375rem",
        DEFAULT: "0.625rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(26,26,26,0.04), 0 1px 3px rgba(26,26,26,0.06)",
        pop: "0 10px 30px rgba(26,26,26,0.10)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
