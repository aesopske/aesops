'use client'

import Text from './atoms/Text'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

type user = {
    name: string
    date: string
    read?: string
    photoURL?: string
}

type UserAvatarProps = {
    user: user | null
}

function UserAvatar({ user }: UserAvatarProps) {
    const firstLastNameLetters = () => {
        if (user) {
            const name = user?.name.split(' ')
            return name[0][0] + name[1][0]
        }
        return ''
    }

    return (
        <div className='flex items-start gap-2'>
            <Avatar className='border'>
                <AvatarImage src={user?.photoURL} alt={user?.name} />
                <AvatarFallback>{firstLastNameLetters()}</AvatarFallback>
            </Avatar>

            <div className='flex flex-1 flex-col items-start gap-0 justify-between'>
                <Text className='capitalize font-semibold'>
                    {user?.name.toLowerCase()}
                </Text>
                {user?.read ? (
                    <Text className='text-xs'>
                        {user?.date} &bull; {user?.read}
                    </Text>
                ) : (
                    <Text className='text-xs'>{user?.date}</Text>
                )}
            </div>
        </div>
    )
}

export default UserAvatar
