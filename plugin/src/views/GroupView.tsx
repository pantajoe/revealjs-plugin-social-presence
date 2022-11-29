import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment } from 'react'
import TabPill from '~/components/generic/TabPill'
import GroupChat from '~/components/group/GroupChat'
import GroupInfo from '~/components/group/GroupInfo'
import GroupMembers from '~/components/group/GroupMembers'
import GroupPlaceholder from '~/components/group/GroupPlaceholder'
import { useGroup } from '~/hooks/use-group'

export default function GroupView() {
  const [{ group }] = useGroup()

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {group ? (
        <Tab.Group>
          <Tab.List as="div" className="border-b-2 border-gray-200 shadow">
            <nav aria-label="Tabs" className="-mb-px flex flex-shrink-0">
              <Tab as={Fragment}>
                {({ selected }) => (
                  <TabPill active={selected} className="w-1/3">
                    Chat
                  </TabPill>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <TabPill active={selected} className="w-1/3">
                    Members
                  </TabPill>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <TabPill active={selected} className="w-1/3">
                    Group Info
                  </TabPill>
                )}
              </Tab>
            </nav>
          </Tab.List>

          <Tab.Panels as={Fragment}>
            {({ selectedIndex }) => (
              <div
                className={clsx(
                  'flex-grow w-full flex flex-col mt-1',
                  selectedIndex === 0 ? 'overflow-y-hidden' : 'overflow-y-auto px-6 py-4',
                )}
              >
                <Tab.Panel as={Fragment}>
                  <GroupChat />
                </Tab.Panel>
                <Tab.Panel as={Fragment}>
                  <GroupMembers />
                </Tab.Panel>
                <Tab.Panel as={Fragment}>
                  <GroupInfo />
                </Tab.Panel>
              </div>
            )}
          </Tab.Panels>
        </Tab.Group>
      ) : (
        <GroupPlaceholder />
      )}
    </div>
  )
}
