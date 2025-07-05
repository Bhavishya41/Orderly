/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    "from-orange-500/30",
    "to-red-500/30",
    "from-blue-500/30",
    "to-purple-500/30",
    "from-green-500/30",
    "to-teal-500/30",
    "blur-3xl",
    "top-[-10%]",
    "left-[-10%]",
    "top-[30%]",
    "right-[-10%]",
    "bottom-[-10%]",
    "left-[20%]",
    "w-[40vw]",
    "h-[40vw]",
    "w-[32vw]",
    "h-[32vw]",
    "w-[28vw]",
    "h-[28vw]",
  ],
}
