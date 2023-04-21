const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type{import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      ...colors,
      current: 'currentColor',
      transparent: 'transparent',
      primary: colors.violet,
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
    },
    extend: {
      fontSize: {
        '2xs': '0.625rem',
      },
      strokeWidth: {
        ...defaultTheme.spacing,
      },
      zIndex: {
        60: 60,
        70: 70,
        80: 80,
        90: 90,
        100: 100,
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}
