/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        suse: ["SUSE", "sans-serif"],
      },
      colors: {
        // Background colors - dark smoky theme
        background: "hsl(0 0% 8%)", // Main dark background (smoky black)
        "background-light": "hsl(0 0% 12%)", // Slightly lighter dark
        "background-hover": "hsl(0 0% 16%)", // Hover states

        // Primary colors - cyan accents
        primary: "hsl(180 100% 80%)", // Main cyan accent
        "primary-dark": "hsl(180 100% 60%)", // Darker cyan for hover
        "primary-light": "hsl(180 100% 90%)", // Lighter cyan

        // Secondary accent colors
        blue: "hsl(200 100% 75%)", // Cool blue accent
        purple: "hsl(280 100% 75%)", // Purple accent
        pink: "hsl(330 100% 75%)", // Pink accent

        // Text colors
        text: "hsl(210 18% 96%)", // Main text (very light)
        "text-muted": "hsl(210 14% 72%)", // Muted text
        "text-subtle": "hsl(210 10% 52%)", // Subtle text

        // Utility colors
        success: "hsl(160 100% 70%)", // Success state
        warning: "hsl(45 100% 70%)", // Warning state
        error: "hsl(0 100% 70%)", // Error state

        // Legacy color mappings (for compatibility)
        offwhite: "hsl(210 18% 96%)",
        dark_gray: "hsl(0 0% 8%)",
        very_light_gray: "hsl(210 14% 72%)",
        light_gray: "hsl(210 10% 52%)",
      },
    },
  },
  plugins: [],
};
