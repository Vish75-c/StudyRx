/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#eefbf8",
          100: "#d5f5ef",
          200: "#aeeae0",
          300: "#78d9cc",
          400: "#42c0b2",
          500: "#25a398",
          600: "#1b8580",
          700: "#1a6b68",
          800: "#1a5655",
          900: "#1a4746",
        },
      },
    },
  },
  plugins: [],
};