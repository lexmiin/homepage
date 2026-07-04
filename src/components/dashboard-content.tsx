import s from '@/styles/dashboard.module.scss'
import useSWR from 'swr'
import type { Playlist, Track } from '@/lib/types'
import fetcher from '@/lib/fetcher'
import MediaListItem from '@/components/media-list-item'

const tools = [
  [
    'Firefox',
    'https://www.mozilla.org/en-US/firefox/new/',
    '/tools/firefox.png',
    'Browser of choice'
  ],
  [
    'Raycast',
    'https://raycast.com/',
    '/tools/raycast.png',
    'Fast, extendable launcher'
  ],
  [
    'Ghostty',
    'https://ghostty.org/',
    '/tools/ghostty.png',
    'Terminal of choice'
  ],
  ['Neovim', 'https://neovim.io/', '/tools/neovim.png', 'Code editor'],
  ['Bear', 'https://bear.app/', '/tools/bear-notes.png', 'Note taking app'],
  ['Cron', 'https://cron.com/', '/tools/cron.png', 'Calendar of choice'],
  [
    'Apple Mail',
    'https://www.icloud.com/mail',
    '/tools/mail.png',
    'Mail client'
  ],
  [
    'SoundSource',
    'https://rogueamoeba.com/soundsource/',
    '/tools/soundsource.png',
    'Superior sound control for Mac'
  ],
  [
    'CleanShot X',
    'https://cleanshot.com/',
    '/tools/cleanshot-x.png',
    'Screenshot tool for Mac'
  ],
  ['Spotify', 'https://open.spotify.com/', '/tools/spotify.png', 'Music player']
] as const

export default function DashboardContent() {
  const { data: playlists } = useSWR<Playlist[]>('/api/playlists', fetcher)
  const { data: topTracks } = useSWR<Track[]>('/api/top-tracks', fetcher)

  return (
    <>
      <p className={s.heading}>Tools i use everyday</p>
      <ul className={s.list}>
        {tools.map(([title, href, src, description]) => (
          <MediaListItem key={title} title={title} href={href} src={src}>
            {description}
          </MediaListItem>
        ))}
      </ul>
      {playlists && (
        <>
          <p className={s.heading}>Spotify playlists</p>
          <ul className={s.list}>
            {playlists.map(playlist => (
              <MediaListItem
                key={playlist.name}
                title={playlist.name}
                src={playlist.imgUrl}
                href={playlist.href}
                size={40}
              >
                {playlist.description}
              </MediaListItem>
            ))}
          </ul>
        </>
      )}
      {topTracks && (
        <>
          <p className={s.heading}>Spoify most played songs</p>
          <ul className={s.list}>
            {topTracks.map(track => (
              <MediaListItem
                key={track.name}
                title={track.name}
                src={track.imgUrl}
                href={track.href}
                size={40}
              >
                {track.artist}
              </MediaListItem>
            ))}
          </ul>
        </>
      )}
    </>
  )
}
