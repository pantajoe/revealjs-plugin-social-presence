import { forwardRef, useMemo, useState } from 'react'
import { orderBy } from 'lodash'
import { KeyIcon } from '@heroicons/react/20/solid'
import SearchInput from '../generic/SearchInput'
import CopyButton from '../lecture/CopyButton'
import Participant from '../participants/Participant'
import { useGroup } from '~/hooks/use-group'
import { usePresence } from '~/hooks/use-presence'

export default forwardRef<HTMLDivElement, {}>(function GroupMembers(props, ref) {
  const [{ group, members }] = useGroup()
  const [, { follow }] = usePresence()
  const [search, setSearch] = useState('')

  const filteredMembers = useMemo(
    () =>
      orderBy(
        members.filter((member) => {
          const name = member.name.toLowerCase()
          const searchQuery = search.toLowerCase()
          return name.includes(searchQuery)
        }),
        ['isInstructor', 'name'],
        ['desc', 'asc'],
      ),
    [members, search],
  )

  return (
    <div ref={ref} className="w-full h-full flex flex-col">
      <div className="w-full mb-2 flex-shrink-0">
        <CopyButton size="xxs" color="transparent" icon={KeyIcon} text={group!.token}>
          Copy group token
        </CopyButton>
      </div>
      <div className="w-full mb-6 flex-shrink-0">
        <SearchInput onChange={setSearch} />
      </div>

      <div className="w-full overflow-y-auto flex-1 space-y-4">
        {filteredMembers.map((member) => (
          <Participant key={member.id} participant={member} onClick={() => follow(member.id)} noControls />
        ))}
      </div>
    </div>
  )
})
