import { Command } from 'cmdk'
import { useAtom } from 'jotai'
import React, { useEffect, useMemo, useState } from 'react'
import {
  EmailIcon,
  GitHubIcon,
  HomeIcon,
  MoonIcon,
  ProjectIcon,
  SunIcon,
  SystemIcon,
  DashboardIcon,
  WritingIcon
} from './icons'
import { commandState } from '@/states/command-menu'

const externalLink = (url: string) => () =>
  window.open(url, '_blank', 'noopener noreferrer')
const navigate = (url: string) => () => {
  window.location.href = url
}

type Theme = 'light' | 'dark'

const getSystemTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

const CommandMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(commandState)
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null
    const initialTheme = storedTheme ?? getSystemTheme()
    setThemeState(initialTheme)
    applyTheme(initialTheme)
  }, [])

  const setTheme = (nextTheme: Theme, persist = true) => {
    if (persist) localStorage.setItem('theme', nextTheme)
    else localStorage.removeItem('theme')
    setThemeState(nextTheme)
    applyTheme(nextTheme)
  }

  const pages = useMemo(
    () => [
      { name: 'Home', icon: <HomeIcon />, cb: navigate('/') },
      { name: 'Projects', icon: <ProjectIcon />, cb: navigate('/projects') },
      {
        name: 'Dashboard',
        icon: <DashboardIcon />,
        cb: navigate('/dashboard')
      },
      { name: 'Writing', icon: <WritingIcon />, cb: navigate('/writing') }
    ],
    []
  )

  const socials = useMemo(
    () => [
      {
        name: 'Email',
        icon: <EmailIcon />,
        cb: navigate('mailto:hello@lexunix.me')
      },
      {
        name: 'GitHub',
        icon: <GitHubIcon />,
        cb: externalLink('https://github.com/lexmiin')
      }
    ],
    []
  )

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')
  const handleItemClick = () => setIsOpen(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        e.preventDefault()
        setIsOpen(open => !open)
      }
      if (e.key === 'Enter') setIsOpen(false)
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [setIsOpen])

  return (
    <Command.Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="command-input">
        <Command.Input placeholder="Search" />
        <button
          className="command-input__button"
          onClick={() => setIsOpen(false)}
        >
          <kbd className="command-input__kdb">esc</kbd>
        </button>
      </div>
      <Command.Separator />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        <Command.Group heading="Page">
          {pages.map(page => (
            <CommandItem key={page.name} {...page} onClick={handleItemClick} />
          ))}
        </Command.Group>
        <Command.Group heading="Socials">
          {socials.map(social => (
            <CommandItem
              key={social.name}
              {...social}
              onClick={handleItemClick}
            />
          ))}
        </Command.Group>
        <Command.Group heading="Theme">
          <CommandItem
            name={`Change Theme to ${theme === 'light' ? 'Dark' : 'Light'}`}
            icon={theme === 'light' ? <MoonIcon /> : <SunIcon />}
            cb={toggleTheme}
            onClick={handleItemClick}
          />
          <CommandItem
            name="Change Theme to System"
            icon={<SystemIcon />}
            cb={() => setTheme(getSystemTheme(), false)}
            onClick={handleItemClick}
          />
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  )
}

interface CommandItemProps {
  name: string
  icon: React.ReactNode
  cb: () => void
  onClick: () => void
}
const CommandItem: React.FC<CommandItemProps> = ({
  name,
  icon,
  cb,
  onClick
}) => {
  const handleSelectAndClick = () => {
    cb()
    onClick()
  }
  return (
    <Command.Item
      onSelect={handleSelectAndClick}
      onClick={handleSelectAndClick}
      value={name}
    >
      {icon} {name}
    </Command.Item>
  )
}

export default CommandMenu
