'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaXTwitter } from 'react-icons/fa6'
import { usePathname } from 'next/navigation'
import { FaLinkedin, FaFacebook, FaGithub, FaRss } from 'react-icons/fa'

import Text from './atoms/Text'
import Heading from './atoms/Heading'

function Footer() {
    const links = [
        {
            label: 'Articles',
            link: '/articles',
        },
        {
            label: 'Datasets',
            link: '/datasets',
        },
        {
            label: 'Apps',
            link: '/apps',
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
            label: 'Team',
            link: '/team',
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
            label: 'Rss Feed',
            href: `${process.env.SITE_URL}/rss.xml`,
            icon: <FaRss className='w-full h-full' />,
        },
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
        <section className='w-full h-full pt-32 px-6 bg-gradient-to-b pb-5 from-brand-background via-aes-light  to-aes-primary'>
            <div className='mx-auto max-w-screen-xl grid gap-4 grid-cols-6'>
                <div className='w-56 h-56 col-span-3 flex items-start justify-start'>
                    <Image
                        alt='logo'
                        width={300}
                        height={300}
                        src='/logo.svg'
                        className='object-contain w-full'
                    />
                </div>

                <div className='flex flex-col gap-4'>
                    <Heading type='h5'>Company</Heading>
                    <div className='flex flex-col gap-2 '>
                        {links.map((link) => (
                            <Link
                                passHref
                                key={link.label}
                                href={link.link}
                                className='cursor-pointer border-b border-dashed pb-1 border-gray-400 w-fit text-sm'>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className='flex flex-col gap-4'>
                    <Heading type='h5'>Connect With Us</Heading>
                    <div className='flex flex-col gap-2'>
                        {socials.map((social) => (
                            <a
                                target='_blank'
                                key={social.label}
                                href={social.href}
                                rel='noopener noreferrer'
                                className='flex items-center gap-2 text-sm'>
                                <span className='w-7 h-7 p-1.5 border border-transparent  rounded-full'>
                                    {social.icon}
                                </span>

                                <Text className='text-sm'>{social.label}</Text>
                            </a>
                        ))}
                    </div>
                </div>
                <div className='flex flex-col gap-4'>
                    <Heading type='h5'>Legal</Heading>

                    <div className='flex flex-col gap-2'>
                        {legal.map((leg) => (
                            <a
                                href={leg.href}
                                key={leg.label}
                                target='_blank'
                                className='cursor-pointer border-b border-dashed pb-1 border-gray-400 w-fit text-sm'
                                rel='noopener noreferrer'>
                                {leg.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <hr className='my-8 border border-aes-primary/10 max-w-3xl mx-auto' />

            <Text className='text-center w-full capitalize my-4 text-white'>
                all rights reserved {new Date().getFullYear()} &copy;
                <a
                    className='border-b  border-dashed border-gray-400 ml-2'
                    href={`${process.env.SITE_URL}`}>
                    aesops
                </a>
            </Text>
        </section>
    )
}

export default Footer
