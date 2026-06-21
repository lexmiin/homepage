import { Command } from 'cmdk'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import React, { useEffect, useMemo } from 'react'
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

const externalLink = (url: string) => {
  return () => window.open(url, '_blank', 'noopener noreferrer')
}

const CommandMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(commandState)
  const { theme, setTheme, systemTheme } = useTheme()
  const router = useRouter()

  const pages = useMemo(
    () => [
      {
        name: 'Home',
        icon: <HomeIcon />,
        cb: () => router.push('/')
      },
      {
        name: 'Projects',
        icon: <ProjectIcon />,
        cb: () => router.push('/projects')
      },
      {
        name: 'Dashboard',
        icon: <DashboardIcon />,
        cb: () => router.push('/dashboard')
      },
      {
        name: 'Writing',
        icon: <WritingIcon />,
        cb: () => router.push('/writing')
      }
    ],
    [router]
  )

  const socials = useMemo(
    () => [
      {
        name: 'Email',
        icon: <EmailIcon />,
        cb: () => router.push('mailto:hello@lexunix.me')
      },
      {
        name: 'GitHub',
        icon: <GitHubIcon />,
        cb: externalLink('https://github.com/lexmiin')
      }
    ],
    [router]
  )

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const handleItemClick = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        e.preventDefault()
        setIsOpen(open => !open)
      }

      if (e.key === 'Enter') {
        setIsOpen(false)
      }
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
            cb={() => setTheme(systemTheme ? systemTheme : 'light')}
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
