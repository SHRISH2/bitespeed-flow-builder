import React from 'react'
import { Handle, Position } from 'reactflow'

/**
 * Custom Text Node
 * - Shows a title and the text content
 * - Has one Target (top) and one Source (bottom) handle
 * - Text is edited via Settings Panel (not inline)
 */
export default function TextNode({ data }) {
  return (
    <div className="text-node">
      <div className="title">Text Message</div>
      <div className="content">{data?.text || 'New message...'}</div>

      {/* Target can accept multiple incoming edges */}
      <Handle type="target" position={Position.Top} id="in" />

      {/* Source can have only one outgoing edge (enforced in onConnect) */}
      <Handle type="source" position={Position.Bottom} id="out" />
    </div>
  )
}
