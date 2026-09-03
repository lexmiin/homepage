import { Command } from 'cmdk'
import { useAtom } from 'jotai'
import React, { useEffect, useMemo, useState } from 'react'
import {
  ChevronRightIcon,
  DocumentIcon,
  EmailIcon,
  GitHubIcon,
  HomeIcon,
  MoonIcon,
  ProjectIcon,
  SunIcon,
  SystemIcon,
  WritingIcon
} from './icons'
import { commandState } from '@/states/command-menu'

// Browsers do not expose physical-keyboard presence. A fine, hover-capable
// primary pointer is the closest capability-based proxy for PCs and laptops.
const KEYBOARD_ORIENTED_DEVICE_QUERY = '(hover: hover) and (pointer: fine)'

const externalLink = (url: string) => () =>
  window.open(url, '_blank', 'noopener noreferrer')
const navigate = (url: string) => () => {
  window.location.href = url
}

type Theme = 'light' | 'dark'
type Page = 'writing' | null

interface WritingPage {
  title: string
  description: string
  slug: string
}

interface CommandMenuProps {
  writingPages: WritingPage[]
}

const getSystemTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

const CommandMenu: React.FC<CommandMenuProps> = ({ writingPages }) => {
  const [isOpen, setIsOpen] = useAtom(commandState)
  const [theme, setThemeState] = useState<Theme>('light')
  const [isInputTabbable, setIsInputTabbable] = useState(false)
  const [page, setPage] = useState<Page>(null)
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState('Home')
  const shouldAutoFocusInput = useMediaQuery(KEYBOARD_ORIENTED_DEVICE_QUERY)

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
      { name: 'Projects', icon: <ProjectIcon />, cb: navigate('/projects') }
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
  const openWriting = () => {
    setSearch('')
    setSelectedItem('All writing')
    setPage('writing')
  }
  const goBack = () => {
    setSearch('')
    setSelectedItem('Home')
    setPage(null)
  }
  const handleOpenChange = (open: boolean) => {
    if (!open && page) {
      goBack()
      return
    }

    setIsOpen(open)
    if (!open) {
      setPage(null)
      setSearch('')
      setSelectedItem('Home')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      page &&
      (event.key === 'ArrowLeft' ||
        event.key === 'Escape' ||
        (event.key === 'Backspace' && !search))
    ) {
      event.preventDefault()
      goBack()
      return
    }

    const selectedItem = event.currentTarget.querySelector<HTMLElement>(
      '[cmdk-item][aria-selected="true"]'
    )
    if (
      !page &&
      event.key === 'ArrowRight' &&
      selectedItem?.dataset.page === 'writing'
    ) {
      event.preventDefault()
      openWriting()
    }
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        e.preventDefault()
        setIsOpen(open => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [setIsOpen])

  useEffect(() => {
    if (!isOpen) {
      setIsInputTabbable(false)
      return
    }

    if (shouldAutoFocusInput) return

    // cmdk does not forward Radix's onOpenAutoFocus prop. Exclude the input
    // from the initial focus pass, then restore normal tap and tab focus.
    const frame = window.requestAnimationFrame(() => setIsInputTabbable(true))
    return () => window.cancelAnimationFrame(frame)
  }, [isOpen, shouldAutoFocusInput])

  return (
    <Command.Dialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      onKeyDown={handleKeyDown}
      label="Command menu"
      value={selectedItem}
      onValueChange={setSelectedItem}
    >
      <div className="command-input">
        <Command.Input
          placeholder="Search"
          tabIndex={shouldAutoFocusInput || isInputTabbable ? 0 : -1}
          value={search}
          onValueChange={setSearch}
        />
        <button
          className="command-input__button"
          onClick={() => (page ? goBack() : handleOpenChange(false))}
        >
          <kbd className="command-input__kdb">esc</kbd>
        </button>
      </div>
      <Command.Separator />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        {!page && (
          <>
            <Command.Group heading="Page">
              {pages.map(page => (
                <CommandItem
                  key={page.name}
                  {...page}
                  onClick={handleItemClick}
                />
              ))}
              <Command.Item
                value="Writing"
                aria-label="Writing"
                data-page="writing"
                onSelect={openWriting}
                onClick={openWriting}
              >
                <WritingIcon /> Writing
                <span className="command-item__end">
                  <ChevronRightIcon />
                </span>
              </Command.Item>
            </Command.Group>
            {search && (
              <WritingItems
                writingPages={writingPages}
                onSelect={handleItemClick}
              />
            )}
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
          </>
        )}
        {page === 'writing' && (
          <>
            <Command.Group heading="Writing">
              <CommandItem
                name="All writing"
                icon={<WritingIcon />}
                cb={navigate('/writing')}
                onClick={handleItemClick}
              />
            </Command.Group>
            <WritingItems
              writingPages={writingPages}
              onSelect={handleItemClick}
            />
          </>
        )}
      </Command.List>
    </Command.Dialog>
  )
}

const WritingItems: React.FC<{
  writingPages: WritingPage[]
  onSelect: () => void
}> = ({ writingPages, onSelect }) => (
  <Command.Group heading="Articles">
    {writingPages.map(post => (
      <Command.Item
        key={post.slug}
        value={post.title}
        aria-label={post.title}
        keywords={[post.description]}
        onSelect={() => {
          navigate(`/writing/${post.slug}`)()
          onSelect()
        }}
      >
        <DocumentIcon /> {post.title}
      </Command.Item>
    ))}
  </Command.Group>
)

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const updateMatch = () => setMatches(mediaQuery.matches)

    updateMatch()
    mediaQuery.addEventListener('change', updateMatch)
    return () => mediaQuery.removeEventListener('change', updateMatch)
  }, [query])

  return matches
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
      aria-label={name}
    >
      {icon} {name}
    </Command.Item>
  )
}

export default CommandMenu
