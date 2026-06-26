/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        cream: '#fff7dc',
        ink: '#1f1a3d',
        gold: '#facc15',
        tomato: '#f2553d',
        indigoNight: '#22204c',
        skyToy: '#a7d8ff',
      },
      fontFamily: {
        display: ['"Baloo 2"', '"Nunito"', '"Noto Sans SC"', 'sans-serif'],
      },
      boxShadow: {
        toy: '0 16px 0 rgb(31 26 61 / 0.08), 0 22px 40px rgb(31 26 61 / 0.18)',
        modal: '0 30px 0 rgb(31 26 61 / 0.08), 0 40px 90px rgb(31 26 61 / 0.35)',
      },
    },
  },
  plugins: [],
};
