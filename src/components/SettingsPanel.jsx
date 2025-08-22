import React from 'react'

/**
 * SettingsPanel
 * - Replaces NodesPanel when a node is selected
 * - Currently supports TextNode settings (text content)
 */
export default function SettingsPanel({ selected, onChange, onClose }) {
  if (!selected) return null

  const handleChange = (e) => {
    onChange({
      ...selected,
      data: { ...selected.data, text: e.target.value },
    })
  }

  return (
    <aside className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Settings</h3>
        <button className="button ghost" onClick={onClose}>Close</button>
      </div>

      <div className="setting-group">
        <label className="label">Text</label>
        <textarea
          className="input"
          rows={6}
          placeholder="Type message here..."
          value={selected?.data?.text || ''}
          onChange={handleChange}
        />
      </div>
    </aside>
  )
}
