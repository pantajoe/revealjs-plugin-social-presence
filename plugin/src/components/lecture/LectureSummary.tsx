import { useLecture } from '~/hooks/use-lecture'

export default function LectureSummary() {
  const [{ lecture }] = useLecture()
  return (
    <div className="w-full">
      <h1 className="text-gray-700 text-xl font-bold mb-1 whitespace-pre-wrap">{lecture!.name}</h1>
      <p className="text-gray-500 text-base font-semibold truncate" title={lecture!.owner.name}>
        Instructor: {lecture!.owner.name}
      </p>
    </div>
  )
}
