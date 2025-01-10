/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
	  extend: {
		fontFamily: {
		  mono: ['Space Mono', 'monospace'],
		},
		colors: {
		  primary: '#ffffff',
		  background: '#000000',
		  accent: '#666666',
		},
		keyframes: {
		  'slide-up': {
			'0%': { transform: 'translateY(100%)', opacity: '0' },
			'100%': { transform: 'translateY(0)', opacity: '1' },
		  }
		},
		animation: {
		  'slide-up': 'slide-up 0.3s ease-out'
		}
	  },
	},
	plugins: [],
  }