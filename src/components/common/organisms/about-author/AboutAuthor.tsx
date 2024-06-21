import { AUTHOR_PLUS, POST } from '@sanity/utils/types'
import Heading from '@/components/common/atoms/Heading'
import Socials from '@/components/common/organisms/author-card/Socials'
import { Avatar, AvatarImage, AvatarFallback } from '@src/components/ui/avatar'
import ListWrapper from '@src/components/common/ListWrapper'
import SmallPostCard from '../posts/SmallPostCard'
import Text from '@/components/common/atoms/Text'

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
                    <Heading type='h4' className='font-bold capitalize'>
                        {author?.name}
                    </Heading>
                    {author?.isCoreMember ? (
                        <div className='flex items-center gap-1'>
                            <Text as='span' className='text-sm text-gray-500'>
                                Core Member &bull; {author?.role}
                            </Text>
                        </div>
                    ) : (
                        <div className='flex items-center gap-1'>
                            <Text as='span' className='text-sm text-gray-500'>
                                Community Member
                            </Text>
                        </div>
                    )}
                </div>
                {!author?.bio || hideBio ? null : (
                    <div className='space-y-2 text-brandprimary-900/70'>
                        <Text className='text-base font-light lg:text-sm'>
                            {author?.bio}
                        </Text>
                    </div>
                )}
            </div>

            {hidePosts || author?.posts?.length === 0 ? null : (
                <div className='flex flex-col gap-2'>
                    <Heading type='h4' className='font-semibold'>
                        More posts by author
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
