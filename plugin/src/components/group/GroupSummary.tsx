import { useGroup } from '~/hooks/use-group'

export default function GroupSummary() {
  const [{ group, members }] = useGroup()
  return (
    <div className="w-full">
      <h1 className="text-gray-700 text-base font-bold mb-1 whitespace-pre-wrap">{group!.name}</h1>
      <p className="text-gray-500 text-sm">
        <span className="font-semibold">{members.length}</span>&nbsp;Member{members.length === 1 ? '' : 's'}
      </p>
    </div>
  )
}
