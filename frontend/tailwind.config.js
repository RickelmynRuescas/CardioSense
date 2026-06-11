/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0f0f1a',
          secondary: '#1a1a2e',
          card: '#16213e',
        },
        accent: {
          DEFAULT: '#00b4d8',
          dark: '#0096c7',
          light: '#48cae4',
        },
      },
    },
  },
  plugins: [],
}

