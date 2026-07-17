import type { ReactNode } from 'react'

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
    <li className="-mx-4 rounded-md bg-transparent px-4 hover:bg-accent [&:first-child_.media-text]:border-t-0 [&:hover+li_.media-text]:border-transparent [&:hover_.media-text]:border-transparent">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-20 w-full list-none items-center gap-4"
      >
        <div className="relative flex size-14 items-center justify-center overflow-hidden rounded-md">
          <img src={src} alt={title} width={size} height={size} />
          <img
            src={src}
            alt={title}
            width={size}
            height={size}
            className="absolute top-[-0.1em] right-[1.15em] scale-200 opacity-25 blur-[12px]"
          />
        </div>
        <div className="media-text flex flex-1 flex-col border-t border-border py-4 text-sm">
          <p>{title}</p>
          <p className="text-muted-foreground">{children}</p>
        </div>
      </a>
    </li>
  )
}
