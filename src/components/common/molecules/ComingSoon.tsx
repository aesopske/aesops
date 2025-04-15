import { Clock, Construction } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

interface ComingSoonProps {
    title?: string
    description?: string
    showIcon?: 'clock' | 'construction' | 'none'
    className?: string
}

function ComingSoon({
    title = 'Coming Soon',
    description = 'This feature is currently under development and will be available soon.',
    showIcon = 'clock',
    className = '',
}: ComingSoonProps) {
    return (
        <div
            className={`flex h-full w-full items-center justify-start ${className}`}>
            <Card className='max-w-md border-dashed bg-background/50 text-center shadow-sm'>
                <CardHeader className='pb-2'>
                    {showIcon !== 'none' && (
                        <div className='mb-2 flex justify-center'>
                            {showIcon === 'clock' ? (
                                <Clock className='h-12 w-12 text-muted-foreground opacity-80' />
                            ) : (
                                <Construction className='h-12 w-12 text-muted-foreground opacity-80' />
                            )}
                        </div>
                    )}
                    <CardTitle className='text-2xl font-semibold tracking-tight'>
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className='text-base'>
                        {description}
                    </CardDescription>
                    <div className='mt-6'>
                        <div className='relative h-1.5 w-full overflow-hidden rounded-full bg-muted'>
                            <div className='absolute left-0 h-full w-1/3 animate-pulse rounded-full bg-primary'></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ComingSoon
