/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0f172a",
        "midnight-light": "#1e293b",
        accent: "#14b8a6",
        "neon-cyan": "#14b8a6",
        "neon-green": "#22c55e",
        "neon-magenta": "#d946ef",
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#e2e8f0',
            a: {
              color: '#14b8a6',
              '&:hover': {
                color: '#2dd4bf',
              },
            },
            h1: { color: '#f1f5f9' },
            h2: { color: '#f1f5f9' },
            h3: { color: '#f1f5f9' },
            h4: { color: '#f1f5f9' },
            strong: { color: '#f1f5f9' },
            code: { color: '#14b8a6' },
            blockquote: { color: '#cbd5e1' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

