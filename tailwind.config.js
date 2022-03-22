module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1C465C",
        secondary: "#356C8A",
        active: "#1C465C",
        hover: "#417B9D",
        pressed: "#417B9D",
        black: "#1E1E1E",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
