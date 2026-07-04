import React from 'react'
import s from '@/styles/navbar.module.scss'
import { useAtom } from 'jotai'
import { commandState } from '@/states/command-menu'
import { CommandIcon } from './icons'

const Navbar: React.FC = () => {
  const [open, setOpen] = useAtom(commandState)
  return (
    <div className={s.nav}>
      <button
        aria-label="Menu"
        className={s.button}
        onClick={() => setOpen(!open)}
      >
        <CommandIcon />
      </button>
    </div>
  )
}

export default Navbar
