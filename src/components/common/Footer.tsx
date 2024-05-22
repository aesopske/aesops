'use client'

import React from 'react'
import Link from 'next/link'
import { FaXTwitter } from 'react-icons/fa6'
import { usePathname } from 'next/navigation'
import {
    FaLinkedin,
    FaFacebook,
    FaGithub,
    FaYoutube,
    FaTiktok,
} from 'react-icons/fa'

import Logo from './Logo'
import Text from './atoms/Text'
import Heading from './atoms/Heading'
import AesopLink from './atoms/AesopLink'

function Footer() {
    const links = [
        {
            label: 'Datasets',
            link: '/datasets',
        },
        {
            label: 'Competitions',
            link: '/competitions',
        },
        {
            label: 'Blog',
            link: '/blog',
        },
        {
            label: 'Community',
            link: '/community',
        },
        {
            label: 'Trends',
            link: '/trends',
        },
        {
            label: 'About Us',
            link: '/aboutus',
        },
    ]
    const socials = [
        {
            label: 'LinkedIn',
            href: 'https://www.linkedin.com/company/aesops/',
            icon: <FaLinkedin className='w-full h-full' />,
        },
        {
            label: 'Github',
            href: 'https://github.com/aesopske',
            icon: <FaGithub className='w-full h-full' />,
        },
        {
            label: 'Twitter',
            href: 'https://twitter.com/Aesopsk',
            icon: <FaXTwitter className='w-full h-full' />,
        },
        {
            label: 'Facebook',
            href: 'https://facebook.com/aesopske',
            icon: <FaFacebook className='w-full h-full' />,
        },
        {
            label: 'TikTok',
            href: 'https://facebook.com/aesopske',
            icon: <FaTiktok className='w-full h-full' />,
        },
        {
            label: 'YouTube',
            href: 'www.youtube.com/@aesops7379',
            icon: <FaYoutube className='w-full h-full' />,
        },
        // {
        //     label: 'Rss Feed',
        //     href: `${process.env.SITE_URL}/rss.xml`,
        //     icon: <FaRss className='w-full h-full' />,
        // },
    ]

    const legal = [
        {
            label: 'Privacy Policy',
            href: `${process.env.SITE_URL}/legal/privacy-policy`,
        },
    ]

    const pathname = usePathname()
    if (pathname?.includes('/studio')) return null
    return (
        <section className='w-full h-full pt-10 px-6 bg-gradient-to-b pb-5 from-brand-background via-aes-light to-aes-primary lg:pt-32'>
            <div className='mx-auto max-w-screen-xl grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
                <div className='w-56 h-auto col-span-2 flex items-start justify-start md:col-span-3 lg:col-span-3 lg:h-56'>
                    <Logo className='h-auto w-24 md:w-56' />
                </div>

                <div className='flex flex-col gap-4'>
                    <Heading type='h4'>Company</Heading>
                    <div className='flex flex-col gap-2 text-sm'>
                        {links.map((link) => (
                            <Link
                                passHref
                                key={link.label}
                                href={link.link}
                                className='cursor-pointer border-b border-dashed pb-1 border-gray-400 w-fit font-sans'>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className='flex flex-col gap-4'>
                    <Heading type='h4'>Engage With Us</Heading>
                    <div className='flex flex-col gap-2'>
                        {socials.map((social) => (
                            <AesopLink
                                isExternal
                                target='_blank'
                                key={social.label}
                                href={social.href}
                                rel='noopener noreferrer'
                                className='flex items-center gap-2'>
                                <span className='w-8 h-8 p-1.5 border border-transparent  rounded-full'>
                                    {social.icon}
                                </span>

                                <Text as='span' className='text-sm'>
                                    {social.label}
                                </Text>
                            </AesopLink>
                        ))}
                    </div>
                </div>
                <div className='flex flex-col gap-4'>
                    <Heading type='h4'>Legal</Heading>

                    <div className='flex flex-col gap-2 text-sm'>
                        {legal.map((leg) => (
                            <a
                                href={leg.href}
                                key={leg.label}
                                target='_blank'
                                className='cursor-pointer border-b border-dashed pb-1 border-gray-400 w-fit font-sans'
                                rel='noopener noreferrer'>
                                {leg.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <hr className='my-8 border border-aes-primary/10 max-w-3xl mx-auto' />

            <Text className='text-center w-full capitalize my-4 text-white'>
                all rights reserved
                <Link
                    href='/'
                    className='border-b  border-dashed border-gray-400 ml-2'>
                    Aesops
                </Link>
                <span className='mx-1'>&copy;</span>
                <span>{new Date().getFullYear()}</span>
            </Text>
        </section>
    )
}

export default Footer
