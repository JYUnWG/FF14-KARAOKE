/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          950: "#080a10",
          900: "#0e111a",
          850: "#131822",
          800: "#19202c",
          700: "#242d3b",
        },
        aether: {
          500: "#53d6c7",
          400: "#72eadc",
        },
        ember: {
          500: "#f9735b",
          400: "#ff9b7d",
        },
      },
      boxShadow: {
        active: "0 0 0 1px rgba(83, 214, 199, 0.8), 0 0 28px rgba(83, 214, 199, 0.18)",
        danger: "0 0 0 1px rgba(249, 115, 91, 0.7), 0 0 26px rgba(249, 115, 91, 0.16)",
      },
    },
  },
  plugins: [],
};
