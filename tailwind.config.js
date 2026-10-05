/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // YouTube's dark theme
      colors: {
        yt: {
          bg: "#0f0f0f",
          surface: "#272727",
          hover: "#3f3f3f",
          menu: "#282828",
          border: "#303030",
          muted: "#aaaaaa",
          text: "#f1f1f1",
        },
      },
    },
  },
  plugins: [],
};
