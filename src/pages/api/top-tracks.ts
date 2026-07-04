import { getTopTracks } from '../../lib/spotify'

export const GET = async () => {
  const response = await getTopTracks()
  const { items } = await response.json()
  const topTracks = items.map((item: any) => ({
    name: item.name,
    artist: item.artists.map((artist: any) => artist.name).join(', '),
    imgUrl: item.album.images[1].url,
    href: item.external_urls.spotify
  }))
  return new Response(JSON.stringify(topTracks), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
    }
  })
}
