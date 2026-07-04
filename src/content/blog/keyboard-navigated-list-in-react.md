---
title: 'Keyboard Navigated List in React'
description: 'Keyboard-based list navigation in React'
date: '2023-08-07 16:43'
---

I recently worked on a project called Shelf, a reading tracking app. I wanted to add keyboard navigation support, which would allow users to navigate between pages, list items, open menus, and perform other actions.

My app has a list of books and a list of reading goals. I have decided to add a feature that allows users to select items in the list using the up and down arrows. They can then perform actions such as editing or deleting the selected item. Once the desired item is selected, the user can perform various actions on it, including editing or deleting it using the keyboard as well.

I decided to create a reusable component because I wanted to use this feature in multiple places in my app. I implemented it using the React Context API.

My project is written in TypeScript. So, let's first define the types for the context and the component.

```tsx
type NavigationListContextProps = {
  selectedIndex: number | undefined
}

type NavigationListProps = {
  listLen: number
  children: ReactNode
}
```

Create and export `NavigationListContext`. We don’t want to show active styles on the initial render, for example. That’s why we initialize `selectedIndex` as `undefined`.

```tsx
export const NavigationListContext = createContext<NavigationListContextProps>({
  selectedIndex: undefined
})
```

Let's work on our component next. The component receives two props: `children` and `listLen`. The `listLen` prop is needed to define the boundary off a list. To change the selected index, we need to define a function that will execute when the keydown event is fired. We are going to use the `useKeypress` hook from [react-use-keypress](https://github.com/jacobbuck/react-use-keypress). :

```tsx
export default function NavigationList({
  children,
  listLen
}: NavigationListProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>()
  const initialPress = useRef(false)

  useKeypress('ArrowDown', () => {
    if (!initialPress.current) {
      initialPress.current = true
      setSelectedIndex(0)
      return
    }
    if (selectedIndex! < listLen - 1) {
      setSelectedIndex(selectedIndex! + 1)
    }
  })

  useKeypress('ArrowUp', () => {
    if (selectedIndex! > 0) {
      setSelectedIndex(selectedIndex! - 1)
    }
  })

  return (
    <NavigationListContext.Provider
      value={{
        selectedIndex
      }}
    >
      {children}
    </NavigationListContext.Provider>
  )
}
```

Usage is pretty straightforward. The `List` component receives an array of books. We map through the array inside the `NavigationList` component and pass each book to the `ListItem` component.

```tsx
export default function List({ books }: ListProps) {
  return (
    <ul>
      <NavigationList listLen={books.length}>
        {books.map((book, i) => (
          <ListItem key={book.id} book={book} index={i} />
        ))}
      </NavigationList>
    </ul>
  )
}
```

In the `ListItem` component, we receive a `book` and an `index`. We obtain the selected index from the context and derive the new state `isSelected`. We can conditionally style the element by using the derived state.

```tsx
interface ListItemProps {
  book: BookData
  index: number
}

export default function ListItem({
  book,
  index,
}: ListViewItemProps) {
  const { selectedIndex } = useContext(NavigationListContext)
  const isSelected = index === selectedIndex

  return (
    <li
      className={`list-item ${isSelected ? "list-item-selected" : ""`} >
	    <p>{book.title}</p>
      <p>{book.author}</p>
    </li>
  )
}
```

You can use this component in various situations. For example, attach a keydown event to delete the item with the backspace key or use `⌘` + `E` to show an editing modal.
