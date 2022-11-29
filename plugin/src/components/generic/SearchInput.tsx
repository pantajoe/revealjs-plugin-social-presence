import { useEffect, useRef, useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import Input from './Input'

export interface SearchInputProps {
  placeholder?: string
  className?: string
  onChange: (searchTerm: string) => void
}

export default function SearchInput({ onChange, placeholder = 'Search ...', className }: SearchInputProps) {
  const searchInput = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(query)
    }, 500)

    return () => clearTimeout(timeout)
  }, [query, onChange])

  const clearSearch = () => {
    setQuery('')
    searchInput.current?.focus()
  }

  return (
    <Input
      ref={searchInput}
      value={query}
      onChange={({ target }) => setQuery(target.value)}
      placeholder={placeholder}
      inputMode="search"
      autoComplete="off"
      icon={MagnifyingGlassIcon}
      iconPosition="leading"
      className={className}
      onKeyUp={({ key }) => key === 'Escape' && clearSearch()}
    />
  )
}
