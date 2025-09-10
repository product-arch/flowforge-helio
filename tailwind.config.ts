import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

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
				// Flow Builder Colors
				flow: {
					canvas: 'hsl(var(--flow-canvas))',
					grid: 'hsl(var(--flow-grid))'
				},
				node: {
					start: 'hsl(var(--node-start))',
					routing: 'hsl(var(--node-routing))',
					constraint: 'hsl(var(--node-constraint))',
					conditional: 'hsl(var(--node-conditional))',
					audit: 'hsl(var(--node-audit))',
					sms: 'hsl(var(--node-sms))',
					whatsapp: 'hsl(var(--node-whatsapp))',
					email: 'hsl(var(--node-email))',
					voice: 'hsl(var(--node-voice))',
					rcs: 'hsl(var(--node-rcs))',
					switch: 'hsl(var(--node-switch))',
					filter: 'hsl(var(--node-filter))',
					control: 'hsl(var(--node-control))',
					vendor: 'hsl(var(--node-vendor))',
					loadbalancer: 'hsl(var(--node-loadbalancer))',
					analytics: 'hsl(var(--node-analytics))',
					alert: 'hsl(var(--node-alert))',
					webhook: 'hsl(var(--node-webhook))',
					database: 'hsl(var(--node-database))',
					transform: 'hsl(var(--node-transform))',
					api: 'hsl(var(--node-api))',
					terminal: {
						success: 'hsl(var(--node-terminal-success))',
						error: 'hsl(var(--node-terminal-error))',
						warning: 'hsl(var(--node-terminal-warning))'
					}
				},
				connection: {
					DEFAULT: 'hsl(var(--connection-default))',
					active: 'hsl(var(--connection-active))',
					error: 'hsl(var(--connection-error))'
				},
				status: {
					success: 'hsl(var(--success))',
					warning: 'hsl(var(--warning))',
					error: 'hsl(var(--error))',
					info: 'hsl(var(--info))'
				}
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-success': 'var(--gradient-success)',
				'gradient-warning': 'var(--gradient-warning)',
				'gradient-error': 'var(--gradient-error)'
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [animate],
} satisfies Config;
