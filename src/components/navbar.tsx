import React from 'react'
import { useAtom } from 'jotai'
import { commandState } from '@/states/command-menu'
import { CommandIcon } from './icons'

const Navbar: React.FC = () => {
  const [open, setOpen] = useAtom(commandState)
  return (
    <div className="mx-auto flex w-full max-w-180 justify-end px-4 pt-6">
      <button
        aria-label="Menu"
        className="inline-flex size-12 cursor-pointer items-center justify-center rounded-[10px] bg-transparent transition-[background-color,box-shadow] duration-200 hover:bg-accent active:ring-3 active:ring-ring focus:outline-none [&_svg_path]:fill-foreground"
        onClick={() => setOpen(!open)}
      >
        <CommandIcon />
      </button>
    </div>
  )
}

export default Navbar
