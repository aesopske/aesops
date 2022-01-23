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

    return (
        <Modall
            size='lg'
            onClose={onClose}
            isOpen={isOpen}
            title={`Contributions`}>
            <Box height='auto' borderRadius='10px'>
                {!userPosts.length ? null : <UserPosts posts={userPosts} />}
                <Divider my='1rem' />
                {!userDatasets.length ? null : (
                    <UserDatasets datasets={userDatasets} />
                )}
                <Divider my='1rem' />
                {!userApps.length ? null : <UserApps apps={userApps} />}
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
