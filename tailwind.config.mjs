// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
	  extend: {
		fontFamily: {
		  sans: ['Figtree', 'system-ui', 'sans-serif'],
		  display: ['Figtree', 'system-ui', 'sans-serif'],
		},
		colors: {
		  purple: {
			50: '#f5f3ff',
			100: '#ede9fe',
			200: '#ddd6fe',
			300: '#c4b5fd',
			400: '#a78bfa',
			500: '#8b5cf6',
			600: '#7c3aed',
			700: '#6d28d9',
			800: '#5b21b6',
			900: '#4c1d95',
		  },
		  gray: {
			50: '#f9fafb',
			100: '#f3f4f6',
			200: '#e5e7eb',
			300: '#d1d5db',
			400: '#9ca3af',
			500: '#6b7280',
			600: '#4b5563',
			700: '#374151',
			800: '#1f2937',
			900: '#111827',
		  },
		},
		typography: (theme) => ({
		  DEFAULT: {
			css: {
			  'color': theme('colors.gray.700'),
			  'a': {
				'color': theme('colors.purple.600'),
				'&:hover': {
				  color: theme('colors.purple.700'),
				},
			  },
			  'h1, h2, h3, h4': {
				'font-weight': '600',
				'color': theme('colors.gray.900'),
			  },
			},
		  },
		  dark: {
			css: {
			  'color': theme('colors.gray.300'),
			  'a': {
				'color': theme('colors.purple.400'),
				'&:hover': {
				  color: theme('colors.purple.300'),
				},
			  },
			  'h1, h2, h3, h4': {
				'color': theme('colors.gray.100'),
			  },
			},
		  },
		}),
		animation: {
		  'fade-in': 'fade-in 0.5s linear forwards',
		  'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
		},
		keyframes: {
		  'fade-in': {
			'0%': {
			  opacity: '0',
			},
			'100%': {
			  opacity: '1',
			},
		  },
		  'fade-in-up': {
			'0%': {
			  opacity: '0',
			  transform: 'translateY(10px)',
			},
			'100%': {
			  opacity: '1',
			  transform: 'translateY(0)',
			},
		  },
		},
	  },
	},
	plugins: [
	  require('@tailwindcss/typography'),
	],
  }