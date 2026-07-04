import React from 'react'
import s from '@/styles/projects.module.scss'

interface Props {
  name: string
  description: string
  href: string
  year: number
}

const ProjectItem: React.FC<Props> = ({ name, description, href, year }) => {
  return (
    <li className={s.li}>
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={s.item}
      >
        <p className={s.name}>
          {name}
          <span className={s.description}>{description}</span>
        </p>
        <div className={s.line}></div>
        <p className={s.year}>{year}</p>
      </a>
    </li>
  )
}

export default ProjectItem
