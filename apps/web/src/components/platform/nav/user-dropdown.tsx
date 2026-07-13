'use client'

import { useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Upload, LayoutGrid, LogOut, Database, MessageSquare, ShieldCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar'
import { Button } from '@repo/ui/components/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { authClient } from '@/lib/auth-client'

type Props = {
    name: string
    email: string
    image?: string | null
    initials: string
    isAdmin?: boolean
}

export function UserDropdown({ name, email, image, initials, isAdmin }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()

    function handleSignOut() {
        startTransition(async () => {
            await authClient.signOut()
            // Redirect back to the page we came from — if it still requires a
            // session, that page's own auth guard takes over from here.
            router.push(pathname)
            router.refresh()
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='rounded-full' disabled={isPending}>
                    <Avatar>
                        <AvatarImage src={image ?? undefined} alt={name} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className='w-60' align='end'>
                {/* user header */}
                <div className='px-3 py-3'>
                    <div className='flex items-center gap-3'>
                        <Avatar className='h-9 w-9'>
                            <AvatarImage src={image ?? undefined} alt={name} />
                            <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
                        </Avatar>
                        <div className='min-w-0'>
                            <p className='truncate text-sm font-medium text-foreground'>{name}</p>
                            <p className='truncate text-xs text-muted-foreground'>{email}</p>
                        </div>
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem asChild className='hover:bg-primary/10 focus:bg-primary/10'>
                        <Link href='/datasets' className='flex items-center gap-2.5'>
                            <Database size={14} className='text-muted-foreground' />
                            Datasets
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className='hover:bg-primary/10 focus:bg-primary/10'>
                        <Link href='/community' className='flex items-center gap-2.5'>
                            <MessageSquare size={14} className='text-muted-foreground' />
                            Community
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className='hover:bg-primary/10 focus:bg-primary/10'>
                        <Link href='/upload' className='flex items-center gap-2.5'>
                            <Upload size={14} className='text-muted-foreground' />
                            Upload dataset
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className='hover:bg-primary/10 focus:bg-primary/10'>
                        <Link href='/profile' className='flex items-center gap-2.5'>
                            <LayoutGrid size={14} className='text-muted-foreground' />
                            My datasets
                        </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                        <DropdownMenuItem asChild className='hover:bg-primary/10 focus:bg-primary/10'>
                            <Link href='/admin/api-keys' className='flex items-center gap-2.5'>
                                <ShieldCheck size={14} className='text-muted-foreground' />
                                Admin
                            </Link>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem
                        variant='destructive'
                        onClick={handleSignOut}
                        disabled={isPending}
                        className='flex items-center gap-2.5'>
                        <LogOut size={14} />
                        {isPending ? 'Signing out…' : 'Sign out'}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
