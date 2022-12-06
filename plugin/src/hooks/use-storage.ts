import { useLocalStorageValue } from '@react-hookz/web'
import { useEffect, useRef } from 'react'
import { parseJson } from '~/utils'

export type Setter<T> = (value: T | ((val: T) => T)) => void

export const useBooleanStorage = (key: string, defaultValue: boolean): [boolean, Setter<boolean>] => {
  const store = useLocalStorageValue(key, {
    initializeWithValue: true,
    defaultValue,
    parse: (str) => parseJson(str),
    stringify: (value) => JSON.stringify(value),
  })

  const ready = useRef<boolean>(false)
  useEffect(() => {
    if (ready.current) return

    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, defaultValue.toString())
      store.fetch()
    }

    ready.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, key])

  return [store.value, store.set]
}
