/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFB7B2',    // Rosa Forever 1630
        secondary: '#B5EAD7',  // Menta
        accent: '#FAF9F6',     // Fondo Hueso
        dark: '#4A4A4A',       // Texto Gris
        card: '#FFFFFF',       // Blanco puro
      }
    },
  },
  plugins: [],
}