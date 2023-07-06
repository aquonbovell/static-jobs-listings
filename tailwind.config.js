/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,json}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Simple 16 column grid
        center: "minmax(1.5rem,1fr) minmax(0,75rem) minmax(1.5rem,1fr)",
      },
      gridTemplateRows: {
        max: "auto 1fr auto",
      },
      fontFamily: {
        body: "League Spartan, sans-serif",
      },
      fontSize: {
        sm: "0.9375rem",
        base: "0.9375rem",
        xl: "1.25rem",
        "2xl": "1.563rem",
        "3xl": "1.953rem",
        "4xl": "2.441rem",
        "5xl": "3.052rem",
      },
      colors: {
        primary: "hsl(180, 29%, 50%)",
        "neutral-200": "hsl(180, 52%, 96%)",
        "neutral-300": "hsl(180, 31%, 95%)",
        "neutral-500": "hsl(180, 8%, 52%)",
        "neutral-700": "hsl(180, 14%, 20%)",
      },
    },
  },
  plugins: [],
};
