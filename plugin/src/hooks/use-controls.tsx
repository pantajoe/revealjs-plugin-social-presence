import {
  ChatBubbleBottomCenterTextIcon,
  InformationCircleIcon,
  PencilSquareIcon,
  UserCircleIcon,
  UserGroupIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import {
  ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextActiveIcon,
  InformationCircleIcon as InformationCircleActiveIcon,
  PencilSquareIcon as PencilSquareActiveIcon,
  UserCircleIcon as UserCircleActiveIcon,
  UserGroupIcon as UserGroupActiveIcon,
  UsersIcon as UsersActiveIcon,
  WrenchScrewdriverIcon as WrenchScrewdriverActiveIcon,
} from '@heroicons/react/20/solid'
import type { ComponentProps, PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useLocalStorageValue } from '@react-hookz/web'
import { usePluginConfig } from './use-plugin-config'

export type AppViewId = 'chat' | 'group' | 'annotation' | 'participants' | 'profile' | 'settings' | 'lecture-info'
export interface AppView {
  id: AppViewId
  name: string
  icon: (props: ComponentProps<'svg'>) => JSX.Element
  activeIcon: (props: ComponentProps<'svg'>) => JSX.Element
  enabled: () => boolean
}

export const AppViews: readonly AppView[] = [
  {
    id: 'chat',
    name: 'Chat',
    icon: ChatBubbleBottomCenterTextIcon,
    activeIcon: ChatBubbleBottomCenterTextActiveIcon,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    enabled: () => usePluginConfig().chat,
  },
  {
    id: 'group',
    name: 'Group',
    icon: UserGroupIcon,
    activeIcon: UserGroupActiveIcon,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    enabled: () => usePluginConfig().groups,
  },
  {
    id: 'annotation',
    name: 'Annotation',
    icon: PencilSquareIcon,
    activeIcon: PencilSquareActiveIcon,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    enabled: () => usePluginConfig().annotations,
  },
  {
    id: 'participants',
    name: 'Participants',
    icon: UsersIcon,
    activeIcon: UsersActiveIcon,
    enabled: () => true,
  },
  {
    id: 'profile',
    name: 'Profile',
    icon: UserCircleIcon,
    activeIcon: UserCircleActiveIcon,
    enabled: () => true,
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: WrenchScrewdriverIcon,
    activeIcon: WrenchScrewdriverActiveIcon,
    enabled: () => true,
  },
  {
    id: 'lecture-info',
    name: 'Lecture Info',
    icon: InformationCircleIcon,
    activeIcon: InformationCircleActiveIcon,
    enabled: () => true,
  },
] as const

interface ControlsContextState {
  view: AppView | null
  zenMode: boolean
  showCursors: boolean
  showOnlyGroupCursors: boolean
  showAnnotationHighlights: boolean
}

export type Setting = Exclude<keyof ControlsContextState, 'view'>

interface ControlsContextActions {
  switchView: (view: AppViewId | AppView | null, toggle?: boolean) => void
  toggle: (setting: Setting) => void
}

type ControlsContextValue = [ControlsContextState, ControlsContextActions]

const ControlsContext = createContext<ControlsContextValue | null>(null)

export const ControlsProvider = ({ children }: PropsWithChildren) => {
  const [view, setView] = useState<AppView | null>(null)
  const zenMode = useLocalStorageValue('zen_mode', {
    initializeWithValue: true,
    defaultValue: false,
    parse: (str) => str === 'true',
    stringify: (value) => (typeof value === 'boolean' ? value.toString() : null),
  })
  const zenModeValue = useMemo(() => zenMode.value, [zenMode.value])
  const showCursors = useLocalStorageValue('show_cursors', {
    initializeWithValue: true,
    defaultValue: true,
    parse: (str) => str === 'true',
    stringify: (value) => (typeof value === 'boolean' ? value.toString() : null),
  })
  const showCursorsValue = useMemo(() => showCursors.value, [showCursors.value])
  const showOnlyGroupCursors = useLocalStorageValue('show_group_cursors_only', {
    initializeWithValue: true,
    defaultValue: false,
    parse: (str) => str === 'true',
    stringify: (value) => (typeof value === 'boolean' ? value.toString() : null),
  })
  const showOnlyGroupCursorsValue = useMemo(() => showOnlyGroupCursors.value, [showOnlyGroupCursors.value])
  const showAnnotationHighlights = useLocalStorageValue('show_annotation_highlights', {
    initializeWithValue: true,
    defaultValue: true,
    parse: (str) => str === 'true',
    stringify: (value) => (typeof value === 'boolean' ? value.toString() : null),
  })
  const showAnnotationHighlightsValue = useMemo(() => showAnnotationHighlights.value, [showAnnotationHighlights.value])

  const switchView: ControlsContextActions['switchView'] = useCallback((viewOrId, toggle = true) => {
    const view = typeof viewOrId === 'string' ? AppViews.find((v) => v.id === viewOrId)! : viewOrId
    setView((prev) => (prev === view && toggle ? null : view))
  }, [])

  const toggle: ControlsContextActions['toggle'] = useCallback(
    (setting) => {
      switch (setting) {
        case 'zenMode':
          zenMode.set((prev) => !prev)
          break
        case 'showCursors':
          showCursors.set((prev) => !prev)
          break
        case 'showOnlyGroupCursors':
          showOnlyGroupCursors.set((prev) => !prev)
          break
        case 'showAnnotationHighlights':
          showAnnotationHighlights.set((prev) => !prev)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <ControlsContext.Provider
      value={[
        {
          view,
          zenMode: zenModeValue,
          showCursors: showCursorsValue,
          showOnlyGroupCursors: showOnlyGroupCursorsValue,
          showAnnotationHighlights: showAnnotationHighlightsValue,
        },
        { switchView, toggle },
      ]}
    >
      {children}
    </ControlsContext.Provider>
  )
}

export const useControls = () => {
  const controls = useContext(ControlsContext)
  if (!controls) {
    throw new Error('Controls context not found')
  }
  return controls
}
