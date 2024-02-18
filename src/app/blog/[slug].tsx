import { client } from 'sanity/lib/client'

async function BlogPage() {
    const post = await client.fetch('*[_type == "post"]')
    return <div>BlogPage</div>
}
export default BlogPage
