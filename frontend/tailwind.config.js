/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#0ea5e9", dark: "#0284c7", light: "#e0f2fe" },
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
    },
  },
  plugins: [],
}

