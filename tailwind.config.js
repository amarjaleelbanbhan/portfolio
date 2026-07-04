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
        "midnight-deep": "#07111f",
        accent: "#14b8a6",
        "neon-cyan": "#14b8a6",
        "neon-green": "#22c55e",
        "neon-magenta": "#d946ef",
      },
      fontFamily: {
        heading: ['Inter', 'system-ui', 'sans-serif'],
        code: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(20,184,166,0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(20,184,166,0.6)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease forwards',
        'fade-in': 'fade-in 0.5s ease forwards',
        blink: 'blink 1s step-end infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      backgroundSize: {
        '200%': '200% 100%',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#e2e8f0',
            a: {
              color: '#14b8a6',
              '&:hover': { color: '#2dd4bf' },
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

