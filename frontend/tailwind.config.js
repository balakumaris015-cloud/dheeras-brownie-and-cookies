/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cocoa: {
          50: "#fff8f1",
          100: "#f7ead9",
          200: "#e9cfb1",
          300: "#d6ad7f",
          400: "#ba7e4f",
          500: "#8c5637",
          600: "#6f3f2c",
          700: "#512f23",
          800: "#352019",
          900: "#211512"
        },
        berry: "#9d2235",
        pistachio: "#688c5f",
        honey: "#d99a2b"
      },
      boxShadow: {
        bakery: "0 24px 70px rgba(58, 35, 24, 0.18)"
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
