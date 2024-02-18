import { getPosts } from '@sanity/lib/requests'

async function Blog() {
    const posts = await getPosts()
    return (
        <div className='container px-6 max-w-screen-3xl mx-auto bg-blue-200 my-12'>
            <pre>{JSON.stringify(posts, null, 3)}</pre>
        </div>
    )
}
export default Blog
