import { pixelBasedPreset, type TailwindConfig } from 'react-email'

export const emailTailwindConfig: TailwindConfig = {
    presets: [pixelBasedPreset],
    theme: {
        extend: {
            colors: {
                background: '#F8F3ED',
                card: '#FFFFFF',
                primary: '#155f6b',
                border: '#E5DDD1',
                muted: '#6B6156',
            },
        },
    },
}
