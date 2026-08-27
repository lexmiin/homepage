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
        className="inline-flex size-12 cursor-pointer items-center justify-center rounded-[10px] bg-transparent focus:outline-none motion-safe:pointer-fine:transition-[background-color,box-shadow] motion-safe:pointer-fine:duration-200 pointer-fine:hover:bg-accent pointer-fine:active:ring-3 pointer-fine:active:ring-ring [&_svg_path]:fill-foreground"
        onClick={() => setOpen(!open)}
      >
        <CommandIcon />
      </button>
    </div>
  )
}

export default Navbar
