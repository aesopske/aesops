/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            colors: {
                brandaccent: {
                    50: '#fff1da', // brandaccent-50
                    100: '#ffd7ae',
                    200: '#ffbe7d',
                    300: '#ffa44c',
                    400: '#ff8a1a',
                    500: '#e67100', // brandaccent-500
                    600: '#b45700',
                    700: '#813e00',
                    800: '#4f2400',
                    900: '#200b00',
                },
                brandprimary: {
                    50: '#e0fbff',
                    100: '#bbedf4',
                    200: '#94dfea',
                    300: '#6cd2e1',
                    400: '#49c4d8',
                    500: '#32aabe',
                    600: '#238595',
                    700: '#155f6b', // brandprimary-700
                    800: '#033941',
                    900: '#001518', // brandprimary-900
                },
                'brand-background': 'var(--brand-background)',
                'brand-foreground': 'var(--brand-foreground)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: 0 },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: 0 },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
            transitionProperty: {
                height: 'height',
                spacing: 'margin, padding',
                size: 'width, height',
            },
            transitionDuration: {
                0: '0ms',
                200: '200ms',
                300: '300ms',
                500: '500ms',
                700: '700ms',
                1000: '1000ms',
            },
            fontFamily: {
                heading: ['Bricolage Grotesque Variable', 'sans-serif'],
                sans: ['Bricolage Grotesque Variable', 'sans-serif'],
                serif: ['Lora Variable', 'serif'],
            },
        },
    },
    plugins: [
        require('tailwindcss-animate'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/container-queries'),
    ],
}
