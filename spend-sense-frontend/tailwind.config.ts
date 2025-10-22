import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primaryPurple: {
          50: "#f6f5ff",
          100: "#efeaff",
          200: "#ddd5ff",
          300: "#cbb9ff",
          400: "#b797ff",
          500: "#8a4dff",
          600: "#6f29ff",
          700: "#5213e6",
          800: "#3a0fa0",
          900: "#24086a",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        expenseflow: {
          primary: "#8a4dff",
          "primary-focus": "#6f29ff",
          secondary: "#7f9cf5",
          accent: "#f472b6",
          neutral: "#f7fafc",
          "base-100": "#ffffff",
          info: "#60a5fa",
          success: "#34d399",
          warning: "#f59e0b",
          error: "#f43f5e",
        },
      },
      "light",
    ],
  },
};

export default config;
