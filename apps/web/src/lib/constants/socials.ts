import { FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

export const SOCIALS = [
    {
        label: 'X / Twitter',
        href: 'https://twitter.com/Aesopsk',
        Icon: FaXTwitter,
    },
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/company/aesops/',
        Icon: FaLinkedin,
    },
    {
        label: 'GitHub',
        href: 'https://github.com/aesopske',
        Icon: FaGithub,
    },
    {
        label: 'YouTube',
        href: 'https://www.youtube.com/@aesops7379',
        Icon: FaYoutube,
    },
] as const

export const CONTACT_EMAILS = [
    { label: 'General', email: 'info@aesops.co.ke' },
    { label: 'Consulting', email: 'consultancy@aesops.co.ke' },
] as const
