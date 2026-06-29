import Link from 'next/link'
import { MyDatasetsList } from './_components/my-datasets-list'

export const metadata = { title: 'My Datasets | Aesops' }

export default function ProfilePage() {
    return (
        <div>
            <div className='mb-6 flex justify-end'>
                <Link
                    href='/upload'
                    className='rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90'>
                    + Upload new
                </Link>
            </div>
            <MyDatasetsList />
        </div>
    )
}
