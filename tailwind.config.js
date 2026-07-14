/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F2F2F0', // warm light gray
          text: '#1C1C1E', // elegant dark gray/black
          accent: '#2563EB', // electric blue
          accentHover: '#1D4ED8',
          accentLight: '#EFF6FF',
          grayDark: '#2D2D30',
          grayLight: '#E5E5E0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
