import HoverCard from '@/components/common/molecules/HoverCard'
import { Avatar, AvatarFallback, AvatarImage } from '@src/components/ui/avatar'
import { cn } from '@src/lib/utils'
import { AUTHOR_PLUS } from '@sanity/utils/types'
import AboutAuthor from '../about-author/AboutAuthor'

type AuthorDetailsProps = {
    author: AUTHOR_PLUS
    isSmall?: boolean
    isSmaller?: boolean
    hideDetails?: boolean
    isMultiple?: boolean
    className?: string
}

export type AUTHOR_DETAIL_PROPS = Partial<AuthorDetailsProps>

function AuthorDetails({
    author,
    isSmall,
    isSmaller,
    hideDetails,
    isMultiple,
    className,
}: AuthorDetailsProps) {
    return (
        <HoverCard
            hideDetails={!author.isCoreMember || hideDetails}
            renderTrigger={() => (
                <Avatar
                    className={cn(
                        isSmall && 'w-8 h-8',
                        isSmaller && 'w-6 h-6',
                        'object-cover shadow-sm z-0 rounded-full',
                        isMultiple && 'p-[2px] border-none shadow-none',
                        className,
                    )}>
                    <AvatarImage
                        alt={author?.name}
                        src={author.photoURL}
                        className='object-cover rounded-full w-full h-full'
                    />
                    <AvatarFallback>{author?.initials}</AvatarFallback>
                </Avatar>
            )}>
            <AboutAuthor author={author} hideBio hidePosts />
        </HoverCard>
    )
}
export default AuthorDetails
