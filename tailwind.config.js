/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,ts}'],
  safelist: ['tablet:mr-[140px]', 'laptop:mr-[140px]', 'pc:mr-[140px]', 'w-0', 'w-[360px]'],
  theme: {
    extend: {
      screens: {
        tablet: '768px',
        small_laptop: '1024px',
        laptop: '1280px',
        pc: '1536px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [],
};
