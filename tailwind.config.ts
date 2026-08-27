
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				info: {
					DEFAULT: 'hsl(var(--info))',
					foreground: 'hsl(var(--info-foreground))'
				},
				grade: {
					0: 'hsl(var(--grade-0))',
					1: 'hsl(var(--grade-1))',
					2: 'hsl(var(--grade-2))',
					3: 'hsl(var(--grade-3))',
					4: 'hsl(var(--grade-4))',
					5: 'hsl(var(--grade-5))'
				},
				chart: {
					1: 'hsl(var(--chart-1))',
					2: 'hsl(var(--chart-2))',
					3: 'hsl(var(--chart-3))',
					4: 'hsl(var(--chart-4))',
					5: 'hsl(var(--chart-5))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
        // Premium brand colors
        royal: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#9b87f5', // Primary Royal Indigo
          500: '#7e69ab', // Secondary Royal Indigo
          600: '#6e59a5', // Tertiary Royal Indigo
          700: '#5b46a4',
          800: '#4c359f',
          900: '#3c2e85',
        },
        gold: {
          50: '#fef9ef',
          100: '#fef7cd', // Soft Gold
          200: '#fceeb0',
          300: '#fbe192',
          400: '#f9d370',
          500: '#f5c650',
          600: '#e6ac2f',
          700: '#c98c24',
          800: '#a36d22',
          900: '#85591f',
        },
        slate: {
          50: '#f8f9fa',
          100: '#edf0f3',
          200: '#e1e5ea',
          300: '#cbd2da',
          400: '#acb5c0',
          500: '#8e9196', // Neutral Slate
          600: '#6e757e',
          700: '#565c65',
          800: '#33353a',
          900: '#221F26', // Dark Slate
        },
        medical: {
          blue: {
            DEFAULT: '#3699FF',
            light: '#E1F0FF',
            dark: '#2D8AF3'
          },
          green: {
            DEFAULT: '#1BC5BD',
            light: '#C9F7F5',
            dark: '#0BB7AF'
          },
          gray: {
            DEFAULT: '#F3F6F9',
            100: '#F3F6F9',
            200: '#EBEDF3',
            300: '#E4E6EF',
            400: '#D1D3E0',
            500: '#B5B5C3',
            600: '#7E8299',
            700: '#5E6278',
            800: '#3F4254',
            900: '#181C32'
          }
        }
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          }
        },
        'blur-in': {
          '0%': {
            opacity: '0',
            filter: 'blur(10px)'
          },
          '100%': {
            opacity: '1',
            filter: 'blur(0)'
          }
        },
        'pulse-soft': {
          '0%, 100%': {
            opacity: '1'
          },
          '50%': {
            opacity: '0.8'
          }
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          }
        }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.7s ease-out forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'blur-in': 'blur-in 0.8s ease-out forwards',
        'pulse-soft': 'pulse-soft 3s infinite ease-in-out',
        'float': 'float 6s infinite ease-in-out'
			},
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 30px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 30px rgba(0, 0, 0, 0.07)',
        'button': '0 4px 10px rgba(54, 153, 255, 0.25)',
        'premium': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'premium-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-dots': 'radial-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
        'gradient-indigo': 'linear-gradient(120deg, #E5E9FF, #F9FBFF)',
        'gradient-purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-gold': 'linear-gradient(120deg, #fef9ef, #fef7cd)',
      },
      backgroundSize: {
        'dots-sm': '20px 20px',
      }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
