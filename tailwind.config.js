/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        suse: ["SUSE", "sans-serif"],
      },
      colors: {
        offwhite: "#f5f5f5",
        dark_gray: "#312B2D",
        green: "#3AA394",
        yellow: "#D3AD69",
        background: "#6E5C62",
        very_light_gray: "#B7AEB4",
        light_gray: "#615458",
      },
    },
  },
  plugins: [],
};

