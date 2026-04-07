/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          blue: '#2563eb',
          'blue-dark': '#1d4ed8',
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0'
        },
        triage: {
          p1: '#e11d48',
          'p1-bg': '#fff1f2',
          p2: '#d97706',
          'p2-bg': '#fffbeb',
          p3: '#059669',
          'p3-bg': '#ecfdf5'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
