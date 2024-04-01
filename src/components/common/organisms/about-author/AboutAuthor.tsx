import { AUTHOR_PLUS, POST } from '@sanity/lib/types'
import Heading from '@/components/common/atoms/Heading'
import Socials from '@/components/common/organisms/author-card/Socials'
import { Avatar, AvatarImage, AvatarFallback } from '@src/components/ui/avatar'
import ListWrapper from '@src/components/common/ListWrapper'
import SmallPostCard from '../posts/SmallPostCard'

type AboutAuthorProps = {
    author: AUTHOR_PLUS
    hideBio?: boolean
    hidePosts?: boolean
}

function AboutAuthor({ author, hideBio, hidePosts }: AboutAuthorProps) {
    return (
        <div className='space-y-5'>
            <div className='flex items-center w-full gap-2'>
                <Avatar className='border h-20 w-20'>
                    <AvatarImage
                        src={author.photoURL}
                        alt={author?.name}
                        className='object-cover'
                    />
                    <AvatarFallback>{author?.initials}</AvatarFallback>
                </Avatar>
            </div>
            <div className='space-y-2'>
                <div>
                    <Heading type='h6' className='font-bold capitalize'>
                        {author?.name}
                    </Heading>
                    {author?.isCoreMember ? (
                        <div className='flex items-center gap-1'>
                            <span className='text-xs text-gray-500'>
                                Core Member &bull; {author?.role}
                            </span>
                        </div>
                    ) : (
                        <div className='flex items-center gap-1'>
                            <span className='text-xs text-gray-500'>
                                Community Member
                            </span>
                        </div>
                    )}
                </div>
                {!author?.bio || hideBio ? null : (
                    <div className='space-y-2 text-aes-dark/70 text-sm line-clamp-6'>
                        <p>{author?.bio}</p>
                    </div>
                )}
            </div>

            {hidePosts || author?.posts?.length === 0 ? null : (
                <div className='flex flex-col gap-2'>
                    <Heading type='h5' className='font-semibold uppercase'>
                        Posts
                    </Heading>

                    <ListWrapper list={author?.posts ?? []} itemKey='_key'>
                        {(post: POST) => (
                            <SmallPostCard hideAuthor post={post} />
                        )}
                    </ListWrapper>
                </div>
            )}

            <Socials socials={author.socials ?? []} />
        </div>
    )
}
export default AboutAuthor
