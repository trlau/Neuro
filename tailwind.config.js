const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "#2563EB", // Strong Blue
        secondary: "#1E293B", // Dark Slate
        background: "#0F172A", // Deep Navy
        card: "#1E293B", // Soft Slate
        textLight: "#E2E8F0", // Light Grayish Text
      },
      boxShadow: {
        glow: "0px 4px 20px rgba(37, 99, 235, 0.3)", // Soft glow effect
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
