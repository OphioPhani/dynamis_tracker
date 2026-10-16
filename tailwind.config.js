/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        good: '#22c55e',
        better: '#eab308',
        best: '#3b82f6',
        ink: '#0a0b0d',
        panel: '#111316',
        panel2: '#16191d',
        line: '#2a2e34',
        mut: '#9aa0a8'
      }
    }
  },
  plugins: []
}
