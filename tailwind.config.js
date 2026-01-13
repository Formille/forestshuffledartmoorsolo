/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f4e8',
          100: '#d9e4c8',
          200: '#b8cc9a',
          300: '#8fa866',
          400: '#6b853f',
          500: '#4d6b2d',
          600: '#2d5016',
          700: '#1f3a0f',
          800: '#14280a',
          900: '#0a1505',
        },
        tree: {
          50: '#faf7f2',
          100: '#f3ede0',
          200: '#e6d9c0',
          300: '#d4be9a',
          400: '#c19f6f',
          500: '#b0854f',
          600: '#8d6a3f',
          700: '#6b5033',
          800: '#4a3624',
          900: '#2a1f15',
        },
        moor: {
          50: '#f5f3f8',
          100: '#eae5f0',
          200: '#d4cae1',
          300: '#b8a5cc',
          400: '#9a7fb3',
          500: '#7d5a9a',
          600: '#63477a',
          700: '#4d365c',
          800: '#35253f',
          900: '#1e1523',
        },
      },
    },
  },
  plugins: [],
}

