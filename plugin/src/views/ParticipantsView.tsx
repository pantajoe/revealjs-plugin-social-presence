import { useMemo, useState } from 'react'
import { orderBy } from 'lodash'
import { LinkIcon } from '@heroicons/react/20/solid'
import SearchInput from '../components/generic/SearchInput'
import CopyButton from '../components/lecture/CopyButton'
import Participant from '../components/participants/Participant'
import { useLecture } from '~/hooks/use-lecture'
import { usePresence } from '~/hooks/use-presence'

export default function ParticipantsView() {
  const [{ lecture, participants }] = useLecture()
  const [, { follow }] = usePresence()
  const [search, setSearch] = useState('')

  const filteredParticipants = useMemo(
    () =>
      orderBy(
        participants.filter((participant) => {
          const name = participant.name.toLowerCase()
          const searchQuery = search.toLowerCase()
          return name.includes(searchQuery)
        }),
        ['isInstructor', 'name'],
        ['desc', 'asc'],
      ),
    [participants, search],
  )

  const lectureLink = useMemo(() => {
    const baseUrl = `${window.location.origin}${window.location.pathname.replace(/\/$/, '')}`
    return `${baseUrl}?lectureId=${lecture!.id}`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lecture?.id])

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full mb-2 flex-shrink-0">
        <CopyButton size="xxs" color="transparent" icon={LinkIcon} text={lectureLink}>
          Copy lecture link
        </CopyButton>
      </div>
      <div className="w-full mb-6 flex-shrink-0">
        <SearchInput onChange={setSearch} />
      </div>

      <div className="w-full overflow-y-auto flex-1 space-y-4">
        {filteredParticipants.map((participant) => (
          <Participant key={participant.id} participant={participant} onClick={() => follow(participant.id)} />
        ))}
      </div>
    </div>
  )
}
