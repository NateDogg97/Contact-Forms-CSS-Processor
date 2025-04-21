/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.js",
    "./src/components/**/*.js",
    "./src/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          '50': '#f0f9ff',
          '100': '#e0f2fe',
          '600': '#2563eb',
          '700': '#1d4ed8',
        },
        gray: {
          '50': '#f8fafc',
          '100': '#f1f5f9',
          '200': '#e2e8f0',
          '300': '#cbd5e1',
          '400': '#94a3b8',
          '500': '#64748b',
          '600': '#475569',
          '700': '#334155',
          '800': '#1e293b',
        },
        green: {
          '50': '#f0fdf4',
          '600': '#16a34a',
          '700': '#15803d',
        },
        red: {
          '50': '#fef2f2',
          '600': '#dc2626',
          '700': '#b91c1c',
        },
        orange: {
          '600': '#ea580c',
          '700': '#c2410c',
        }
      }
    },
  }
}