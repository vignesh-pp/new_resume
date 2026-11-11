/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
        serif: ['Merriweather', 'Lora', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Poppins', 'Montserrat', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        lora: ['Lora', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      screens: {
        'print': { 'raw': 'print' },
      },
    },
  },
  plugins: [],
}

