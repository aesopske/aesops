import { NuqsAdapter } from 'nuqs/adapters/next/app'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <NuqsAdapter>
            <div className='min-h-screen bg-brand-background'>{children}</div>
        </NuqsAdapter>
    )
}
