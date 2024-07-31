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
}

export type AUTHOR_DETAIL_PROPS = Partial<AuthorDetailsProps>

function AuthorDetails({
    author,
    isSmall,
    isSmaller,
    hideDetails,
    isMultiple,
}: AuthorDetailsProps) {
    return (
        <HoverCard
            hideDetails={!author.isCoreMember || hideDetails}
            renderTrigger={() => (
                <Avatar
                    className={cn(
                        'object-cover',
                        isSmall && 'w-8 h-8',
                        isSmaller && 'w-6 h-6',
                        isMultiple && 'p-[2px]',
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
