/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",

  ],
  theme: {
    fontFamily:{
      titlefont:[ "Playwrite AU QLD, serif"
      ]
    },
    extend: {
      colors:{
        bgcolor:"#C6E7FF",
        secondbgcolor:"#3ABEF9",
      },
    },
  },
  plugins: [],

}

