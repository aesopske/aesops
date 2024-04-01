import { cn } from '@src/lib/utils'
import { AUTHOR_PLUS } from '@sanity/lib/types'
import AboutAuthor from '../about-author/AboutAuthor'
import HoverCard from '@/components/common/molecules/HoverCard'
import { Avatar, AvatarFallback, AvatarImage } from '@src/components/ui/avatar'

type AuthorDetailsProps = {
    author: AUTHOR_PLUS
    isSmall?: boolean
}

function AuthorDetails({ author, isSmall }: AuthorDetailsProps) {
    return (
        <HoverCard
            hideDetails={!author.isCoreMember}
            renderTrigger={() => (
                <Avatar className={cn('object-cover', isSmall && 'w-8 h-8')}>
                    <AvatarImage
                        alt={author?.name}
                        src={author.photoURL}
                        className='object-cover'
                    />
                    <AvatarFallback>{author?.initials}</AvatarFallback>
                </Avatar>
            )}>
            <AboutAuthor author={author} hideBio hidePosts />
        </HoverCard>
    )
}
export default AuthorDetails
