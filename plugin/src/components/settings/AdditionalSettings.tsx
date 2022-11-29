import Toggle from '../generic/Toggle'
import { useControls } from '~/hooks/use-controls'
import { useGroup } from '~/hooks/use-group'
import { usePluginConfig } from '~/hooks/use-plugin-config'

export default function AdditionalSettings() {
  const [{ zenMode, showCursors, showOnlyGroupCursors, showAnnotationHighlights }, { toggle }] = useControls()
  const [{ group }] = useGroup()
  const config = usePluginConfig()

  return (
    <div className="w-full divide-solid divide-y divide-gray-200 [&>*]:py-6">
      <Toggle
        value={zenMode}
        onChange={() => toggle('zenMode')}
        label="Zen Mode"
        description="Activate Zen-mode to remove all distractions, including annotation, notifications, and controls."
      />
      {config.cursors && (
        <>
          <Toggle
            disabled={zenMode || showOnlyGroupCursors}
            value={zenMode ? false : showOnlyGroupCursors ? true : showCursors}
            onChange={() => toggle('showCursors')}
            label="Show Cursors"
            description="Show the cursors of other participants on the slide you're currently on."
          />
          <Toggle
            disabled={zenMode || !group}
            value={zenMode ? false : showOnlyGroupCursors}
            onChange={() => toggle('showOnlyGroupCursors')}
            label="Show Group Cursors Only"
            description="Show the cursors of other participants in your group only."
          />
        </>
      )}
      {config.annotations && (
        <Toggle
          disabled={zenMode}
          value={zenMode ? false : showAnnotationHighlights}
          onChange={() => toggle('showAnnotationHighlights')}
          label="Show annotation highlights"
          description="Show the highlights of other participants' annotations on the slide you're currently on."
        />
      )}
    </div>
  )
}
