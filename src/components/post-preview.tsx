import React from 'react'
import s from '@/styles/writing.module.scss'

interface Props {
  title: string
  description: string
  slug: string
}

const PostPreview: React.FC<Props> = ({ title, description, slug }) => {
  return (
    <li className={s['list-item']}>
      <a href={`/writing/${slug}`}>
        <div className={s.content}>
          <p>{title}</p>
          <p className={s.description}>{description}</p>
        </div>
      </a>
    </li>
  )
}

export default PostPreview
