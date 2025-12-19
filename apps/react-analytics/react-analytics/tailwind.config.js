/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        enterprise: {
          blue: '#3b82f6',
          dark: '#1f2937',
          gray: '#6b7280',
        }
      }
    },
  },
  plugins: [],
}