'use client'

import { Button, Toggle } from '@/components/ui'
import { Sun, Moon, Computer } from 'lucide-react'
import { useTheme } from 'next-themes'

function Themeswitcher() {
    const { setTheme, theme } = useTheme()
    return (
        <div className='flex items-center w-fit border-2 dark:border-slate-200 border-slate-700 rounded-full overflow-hidden dark:text-white'>
            {['system', 'light', 'dark'].map((t) => (
                <Button
                    key={t}
                    variant='ghost'
                    onClick={() => setTheme(t)}
                    data-theme-active={t === theme}
                    className='rounded-none dark:text-white data-[theme]:dark:text-black'>
                    {t === 'system' ? (
                        <Computer size={20} />
                    ) : t === 'light' ? (
                        <Sun size={20} />
                    ) : (
                        <Moon size={20} />
                    )}
                </Button>
            ))}
        </div>
    )
}
export default Themeswitcher
