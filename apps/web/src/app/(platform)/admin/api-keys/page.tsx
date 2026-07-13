import { ApiKeysList } from './_components/api-keys-list'

export const metadata = { title: 'API keys | Admin | Aesops' }

export default function AdminApiKeysPage() {
    return (
        <div>
            <h2 className='text-lg font-medium text-foreground'>API keys</h2>
            <p className='mt-0.5 text-sm text-muted-foreground'>
                Keys for programmatic access — e.g. the scraper upload endpoint.
            </p>
            <div className='mt-4'>
                <ApiKeysList />
            </div>
        </div>
    )
}
