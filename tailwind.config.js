/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {

    extend: {

      colors: {
        'pbg' :'#F7FFF7',
        'btnbg': '#4ECDC4',
        'textcolot': '#1A535C',
        'menubg':'#FFE66D'
      }
    },
    fontFamily: {
      iransans: ['iransans' , 'sans-sarif'],
    },
  },
  plugins: [
    require('daisyui'),
  ],
}