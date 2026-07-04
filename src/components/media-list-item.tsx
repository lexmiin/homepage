import type { ReactNode } from 'react'
import s from '@/styles/media-list.module.scss'

interface Props {
  src: string
  title: string
  href: string
  size?: number
  children: ReactNode
}

export default function MediaListItem({
  src,
  title,
  href,
  size = 48,
  children
}: Props) {
  return (
    <li className={s['list-item']}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={s.content}
      >
        <div className={s['image-container']}>
          <img src={src} alt={title} width={size} height={size} />
          <img
            src={src}
            alt={title}
            width={size}
            height={size}
            className={s.glow}
          />
        </div>
        <div className={s['text-container']}>
          <p>{title}</p>
          <p className={s.description}>{children}</p>
        </div>
      </a>
    </li>
  )
}
