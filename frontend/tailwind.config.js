/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base:'#0B0B10', card:'#0F1117', elevated:'#1A1F2B',
        accent:'#7C3AED', text:'#E6E8F0', subtext:'#9AA4B2'
      }
    }
  },
  plugins: [],
}
