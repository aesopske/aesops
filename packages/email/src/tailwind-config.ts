import { pixelBasedPreset, type TailwindConfig } from 'react-email'

export const emailTailwindConfig: TailwindConfig = {
    presets: [pixelBasedPreset],
    theme: {
        extend: {
            colors: {
                background: '#FFFFFF',
                card: '#FFFFFF',
                primary: '#155f6b',
                accent: '#D4956A',
                border: '#EAEAEA',
                foreground: '#242424',
                muted: '#9B9B9B',
                code: '#F4F4F4',
            },
            fontFamily: {
                sans: ['Bricolage Grotesque', 'Helvetica', 'Arial', 'sans-serif'],
            },
        },
    },
}
