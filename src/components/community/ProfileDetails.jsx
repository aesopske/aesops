import { Box, Divider } from '@chakra-ui/react'
import React from 'react'
import Modall from '../common/Modall'
import UserApps from './UserApps'
import UserDatasets from './UserDatasets'
import UserPosts from './UserPosts'

function ProfileDetails({ onClose, isOpen, profile, details }) {
    const userPosts =
        details.posts?.length &&
        details.posts?.filter((post) => post.author_email === profile.email)

    const userDatasets =
        details.datasets?.length &&
        details.datasets?.filter((post) => post.author_email === profile.email)

    const userApps =
        details.apps?.length &&
        details.apps?.filter((post) => post.author_email === profile.email)

    const unavailable =
        !userPosts.length && !userDatasets.length && !userApps.length

    return (
        <Modall
            size='lg'
            onClose={onClose}
            isOpen={isOpen}
            title={`Contributions`}>
            <Box height='auto' borderRadius='10px'>
                {userPosts.length > 0 && (
                    <>
                        <UserPosts posts={userPosts} />
                        <Divider my='1rem' />
                    </>
                )}
                {userDatasets.length > 0 && (
                    <>
                        <UserDatasets datasets={userDatasets} />
                        <Divider my='1rem' />
                    </>
                )}
                {userApps.length > 0 && <UserApps apps={userApps} />}
                {unavailable && (
                    <Box>
                        Contribution history is unavailable for this user.
                    </Box>
                )}
            </Box>
        </Modall>
    )
}

ProfileDetails.defaultProps = {
    onClose: () => {},
    isOpen: false,
    profile: {},
    details: {},
}

export default ProfileDetails
