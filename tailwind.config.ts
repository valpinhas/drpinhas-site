import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f7f4',
          100: '#e3ebe2',
          200: '#c7d7c5',
          300: '#a3bba0',
          400: '#7d9a79',
          500: '#5d7d59',
          600: '#466445',
          700: '#38513a',
          800: '#2e4231',
          900: '#26372a',
          950: '#14201a',
        },
        cream: {
          50: '#fdfbf7',
          100: '#faf5eb',
          200: '#f4ebd4',
          300: '#ecd9b0',
          400: '#e0bf80',
          500: '#d4a455',
        },
        clay: {
          50: '#faf6f3',
          100: '#f3e9e1',
          200: '#e6d2c4',
          300: '#d4b39e',
          400: '#c08e74',
          500: '#b0735a',
          600: '#9c5c47',
          700: '#804a3b',
          800: '#6a3f34',
          900: '#58362e',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      maxWidth: {
        'prose-narrow': '42rem',
      },
    },
  },
  plugins: [],
}

export default config
