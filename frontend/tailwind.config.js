/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'military-green': {
          DEFAULT: 'var(--color-military-green)',
          light: 'var(--color-military-green-light)',
          dark: 'var(--color-military-green-dark)',
        },
        'military-khaki': {
          DEFAULT: 'var(--color-military-khaki)',
          light: 'var(--color-military-khaki-light)',
          dark: 'var(--color-military-khaki-dark)',
        },
        'military-dark': 'var(--color-military-dark)',
        'military-gray': 'var(--color-military-gray)',
        'military-light-gray': 'var(--color-military-light-gray)',
        'camo-brown': 'var(--color-camo-brown)',
        'camo-sand': 'var(--color-camo-sand)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        military: ['Courier New', 'monospace'],
      },
      boxShadow: {
        'military-sm': 'var(--shadow-sm)',
        'military-md': 'var(--shadow-md)',
        'military-lg': 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
};
