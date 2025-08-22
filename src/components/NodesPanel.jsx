import React from 'react'

/**
 * NodesPanel
 * - Extensible: accepts an array of available node types
 * - Drag a node to canvas to create it
 */
export default function NodesPanel({ registry = [] }) {
  const onDragStart = (evt, item) => {
    evt.dataTransfer.setData('application/reactflow', JSON.stringify(item))
    evt.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="panel">
      <h3>Nodes</h3>
      {registry.map((n) => (
        <div
          key={n.type}
          className="node-item"
          draggable
          onDragStart={(e) => onDragStart(e, n)}
          title={n.description}
        >
          <strong>{n.label}</strong>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>{n.description}</div>
        </div>
      ))}
      <div style={{ marginTop: 16, fontSize: 12, color: '#7e8aa0' }}>
        Tip: Drag a node onto the canvas
      </div>
    </aside>
  )
}
