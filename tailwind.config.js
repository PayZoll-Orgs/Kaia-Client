/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          400: '#FFD60A',
        },
        purple: {
          400: '#B794F4',
        },
        cyan: {
          500: '#06B6D4',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
