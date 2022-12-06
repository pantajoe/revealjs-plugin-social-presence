import { useLocalStorageValue } from '@react-hookz/web'
import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useClient } from './use-client'
import { useAuth } from './use-auth'
import type { LectureFragment as Lecture, UserFragment as User } from '~/graphql'
import {
  useCreateLectureMutation,
  useDeleteLectureMutation,
  useJoinLectureMutation,
  useKickParticipantMutation,
  useLeaveLectureMutation,
  useLectureWasUpdatedSubscription,
  useParticipantJoinedSubscription,
  useParticipantLeftSubscription,
  useParticipantsQuery,
  useUpdateLectureMutation,
  useUserWasRemovedSubscription,
  useUserWasUpdatedSubscription,
} from '~/graphql'
import { parseJson } from '~/utils'

const RecentLecturesStorageKey = 'recent_lectures' as const

interface RecentLectureConfig {
  [pathname: string]: Lecture
}

export interface LectureContextActions {
  createLecture: (name: string) => Promise<void>
  updateLecture: (name: string) => Promise<void>
  deleteLecture: () => Promise<void>
  joinLecture: (lectureId: string) => Promise<Lecture | null>
  leaveLecture: () => void

  kickParticipant: (participantId: string) => Promise<void>
}

export interface LectureContextState {
  lecture: Lecture | null
  participants: User[]
}

export type LectureContextValue = [LectureContextState, LectureContextActions]

const LectureContext = createContext<LectureContextValue | null>(null)

export const LectureProvider = ({ children }: PropsWithChildren) => {
  const [{ isLoggedIn }] = useAuth()

  const recentLectures = useLocalStorageValue<RecentLectureConfig, RecentLectureConfig, true>(
    RecentLecturesStorageKey,
    {
      defaultValue: {} as RecentLectureConfig,
      initializeWithValue: true,
      parse: (str) => parseJson<RecentLectureConfig>(str, {}),
      stringify: JSON.stringify,
    },
  )
  const cacheLecture = useCallback((lecture: Lecture) => {
    recentLectures.set((prev) => ({
      ...prev,
      [window.location.pathname]: lecture,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const purgeLecture = useCallback(() => {
    recentLectures.set((prev) => {
      const copy = { ...prev }
      delete copy[window.location.pathname]
      return copy
    })
    if (window.location.search.includes('lectureId')) window.location.search = ''
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { resetClient } = useClient()

  const [lecture, setLecture] = useState<Lecture | null>(null)
  useLectureWasUpdatedSubscription({ pause: !lecture })

  const [, createLectureMutation] = useCreateLectureMutation()
  const createLecture: LectureContextActions['createLecture'] = useCallback(
    async (name) => {
      const url = window.location.origin + window.location.pathname
      const { data } = await createLectureMutation({ name, url })
      if (data?.createLecture) {
        setLecture(data.createLecture)
        resetClient({ lecture: data.createLecture.id })
        cacheLecture(data.createLecture)
      }
    },
    [cacheLecture, createLectureMutation, resetClient],
  )

  const [, updateLectureMutation] = useUpdateLectureMutation()
  const updateLecture: LectureContextActions['updateLecture'] = useCallback(
    async (name) => {
      const { data } = await updateLectureMutation({ name })
      if (data?.updateLecture) setLecture(data.updateLecture)
    },
    [updateLectureMutation],
  )

  const [, deleteLectureMutation] = useDeleteLectureMutation()
  const deleteLecture: LectureContextActions['deleteLecture'] = useCallback(async () => {
    await deleteLectureMutation({})
    setLecture(null)
    resetClient()
    purgeLecture()
  }, [deleteLectureMutation, purgeLecture, resetClient])

  const [, joinLectureMutation] = useJoinLectureMutation()
  const joinLecture: LectureContextActions['joinLecture'] = useCallback(
    async (lectureId) => {
      const url = window.location.origin + window.location.pathname
      resetClient({ lecture: lectureId })
      const { data } = await joinLectureMutation({ id: lectureId, url })
      if (data) {
        setLecture(data.joinLecture)
        cacheLecture(data.joinLecture)
        return data.joinLecture
      }
      return null
    },
    [cacheLecture, joinLectureMutation, resetClient],
  )

  const [, leaveLectureMutation] = useLeaveLectureMutation()
  const leaveLecture: LectureContextActions['leaveLecture'] = useCallback(async () => {
    await leaveLectureMutation({})
    resetClient()
    setLecture(null)
    purgeLecture()
  }, [leaveLectureMutation, resetClient, purgeLecture])

  useEffect(() => {
    if (isLoggedIn) {
      const lectureId =
        new URLSearchParams(window.location.search).get('lectureId') ||
        recentLectures.value?.[window.location.pathname]?.id
      if (lectureId) {
        joinLecture(lectureId).then((result) => {
          if (!result) {
            purgeLecture()
          }
        })
      }
    } else {
      setLecture(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  const [participantsQuery] = useParticipantsQuery({ pause: !lecture })
  const participants = useMemo(() => participantsQuery.data?.participants ?? [], [participantsQuery])
  useParticipantJoinedSubscription({ pause: !lecture })
  useParticipantLeftSubscription({ pause: !lecture })
  useUserWasUpdatedSubscription({ pause: !lecture })
  useUserWasRemovedSubscription({ pause: !lecture })
  const [, kickParticipantMutation] = useKickParticipantMutation()
  const kickParticipant: LectureContextActions['kickParticipant'] = useCallback(
    async (userId) => {
      await kickParticipantMutation({ userId })
    },
    [kickParticipantMutation],
  )

  const value: LectureContextValue = useMemo(
    () => [
      {
        lecture,
        participants,
      },
      {
        createLecture,
        updateLecture,
        deleteLecture,
        joinLecture,
        leaveLecture,
        kickParticipant,
      },
    ],
    [lecture, participants, createLecture, updateLecture, deleteLecture, joinLecture, leaveLecture, kickParticipant],
  )

  return <LectureContext.Provider value={value}>{children}</LectureContext.Provider>
}

export const useLecture = () => {
  const context = useContext(LectureContext)
  if (!context) {
    throw new Error('useLecture must be used within a LectureProvider')
  }
  return context
}
