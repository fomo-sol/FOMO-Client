// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-pretendard)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
};
