import { getCollection } from 'astro:content'

export const GET = async () => {
  const base = 'https://lexunix.me'
  const posts = await getCollection('blog')
  const urls = [
    '/',
    '/projects',
    '/dashboard',
    '/writing',
    ...posts.map(post => `/writing/${post.id}`)
  ]
    .map(path => `<url><loc>${base}${path}</loc></url>`)
    .join('')

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    {
      headers: { 'content-type': 'application/xml' }
    }
  )
}
