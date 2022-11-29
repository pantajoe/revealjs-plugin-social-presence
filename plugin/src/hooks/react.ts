import { useCallback, useLayoutEffect, useRef } from 'react'
import { usePrevious, useSyncedRef } from '@react-hookz/web'

type AnyFunction = (...args: any[]) => any

export function useEvent<T extends AnyFunction>(callback?: T) {
  const ref = useRef<AnyFunction | undefined>(() => {
    throw new Error('Cannot call an event handler while rendering.')
  })
  useLayoutEffect(() => {
    ref.current = callback
  })
  return useCallback<AnyFunction>((...args) => ref.current?.apply(null, args), []) as T
}

export function usePreviousRef<T>(value: T) {
  const previous = usePrevious(value)
  const previousRef = useSyncedRef(previous)

  return previousRef
}
