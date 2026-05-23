/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        heb: ["Heebo", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eef9ff",
          100: "#daf0ff",
          200: "#bde5ff",
          300: "#8fd3ff",
          400: "#5ab8fc",
          500: "#3196f5",
          600: "#1f76e5",
          700: "#1a5dcc",
          800: "#1c4ea4",
          900: "#1c4382",
        },
        accent: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
      },
      boxShadow: {
        soft: "0 8px 30px -8px rgba(31, 118, 229, 0.25)",
        card: "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
      },
      keyframes: {
        pop: { "0%": { transform: "scale(0.95)", opacity: "0" }, "100%": { transform: "scale(1)", opacity: "1" } },
      },
      animation: { pop: "pop 0.25s ease-out" },
    },
  },
  plugins: [],
};
