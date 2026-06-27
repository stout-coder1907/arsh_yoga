/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: "#F7F5EE",
        cream: "#FBF9F2",
        forest: {
          DEFAULT: "#2B4C36",
          soft: "#3D6A4A",
          deep: "#1F3A28",
        },
        gold: "#B8893A",
        charcoal: "#1C1C1C",
        muted: "#6B6B66",
        line: "#E6E1D3",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        pill: "999px",
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(31,58,40,0.18)",
      },
    },
  },
  plugins: [],
};
