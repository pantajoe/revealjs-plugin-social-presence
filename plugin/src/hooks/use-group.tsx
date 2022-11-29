import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLecture } from './use-lecture'
import { useClient } from './use-client'
import type { GroupFragment as Group, GroupQuery, GroupQueryVariables, UserFragment as User } from '~/graphql'
import {
  GroupDocument,
  useCreateGroupMutation,
  useGroupMemberJoinedSubscription,
  useGroupMemberLeftSubscription,
  useGroupMembersQuery,
  useGroupWasUpdatedSubscription,
  useJoinGroupMutation,
  useLeaveGroupMutation,
  useUpdateGroupMutation,
} from '~/graphql'

export interface GroupContextState {
  group: Group | null
  members: User[]
}

export interface GroupContextActions {
  createGroup: (name: string) => Promise<void>
  updateGroup: (name: string) => Promise<void>
  joinGroup: (groupToken: string) => Promise<Group | null>
  leaveGroup: () => void
}

export type GroupContextValue = [GroupContextState, GroupContextActions]

const GroupContext = createContext<GroupContextValue | null>(null)

export const GroupProvider = ({ children }: PropsWithChildren) => {
  const [{ lecture }] = useLecture()

  const [group, setGroup] = useState<Group | null>(null)
  useEffect(() => {
    if (!lecture) setGroup(null)
  }, [lecture])

  const { client } = useClient()
  useEffect(() => {
    client
      .query<GroupQuery, GroupQueryVariables>(GroupDocument, {})
      .toPromise()
      .then(({ data }) => {
        setGroup(data?.group ?? null)
      })
  }, [client])
  useGroupWasUpdatedSubscription({ pause: !group, variables: { id: group?.id as string } })

  const [membersQuery] = useGroupMembersQuery({ pause: !group, variables: { id: group?.id as string } })
  const members = useMemo(() => membersQuery.data?.groupMembers ?? [], [membersQuery])
  useGroupMemberJoinedSubscription({ pause: !group, variables: { id: group?.id as string } })
  useGroupMemberLeftSubscription({ pause: !group, variables: { id: group?.id as string } })

  const [, createGroupMutation] = useCreateGroupMutation()
  const createGroup: GroupContextActions['createGroup'] = useCallback(
    async (name: string) => {
      const { data } = await createGroupMutation({ name })
      if (data?.createGroup) {
        setGroup(data.createGroup)
      }
    },
    [createGroupMutation],
  )

  const [, updateGroupMutation] = useUpdateGroupMutation()
  const updateGroup: GroupContextActions['updateGroup'] = useCallback(
    async (name: string) => {
      const { data } = await updateGroupMutation({ id: group?.id as string, name })
      if (data?.updateGroup) {
        setGroup(data.updateGroup)
      }
    },
    [group, updateGroupMutation],
  )

  const [, joinGroupMutation] = useJoinGroupMutation()
  const joinGroup: GroupContextActions['joinGroup'] = useCallback(
    async (token: string) => {
      const { data } = await joinGroupMutation({ token })
      if (data?.joinGroup) {
        setGroup(data.joinGroup)
      }
      return data?.joinGroup ?? null
    },
    [joinGroupMutation],
  )

  const [, leaveGroupMutation] = useLeaveGroupMutation()
  const leaveGroup: GroupContextActions['leaveGroup'] = useCallback(async () => {
    await leaveGroupMutation({ id: group?.id as string })
    setGroup(null)
  }, [group, leaveGroupMutation])

  const value: GroupContextValue = useMemo(
    () => [
      { group, members },
      { createGroup, updateGroup, joinGroup, leaveGroup },
    ],
    [group, members, createGroup, updateGroup, joinGroup, leaveGroup],
  )

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
}

export const useGroup = () => {
  const context = useContext(GroupContext)
  if (!context) throw new Error('useGroup must be used within a GroupProvider')
  return context
}
