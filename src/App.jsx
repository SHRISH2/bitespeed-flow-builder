import React, { useCallback, useMemo, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'

import NodesPanel from './components/NodesPanel.jsx'
import SettingsPanel from './components/SettingsPanel.jsx'
import TextNode from './nodes/TextNode.jsx'

/**
 * High-level design:
 * - Left panel: NodesPanel OR SettingsPanel (when a node is selected)
 * - Right: ReactFlow canvas
 * - Save button validates graph (no. of nodes whose source has no outgoing edge)
 */

const nodeTypes = { textNode: TextNode }

const NODE_REGISTRY = [
  {
    type: 'textNode',
    label: 'Text Message',
    description: 'Send a text message',
    initialData: { text: 'Hello there 👋' },
    width: 220,
    height: 100,
  },
]

function FlowCanvas() {
  const idRef = useRef(1)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [toast, setToast] = useState(null)

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId]
  )

  const showToast = (msg, type = 'error', timeout = 2000) => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), timeout)
  }

  const onConnect = useCallback(
    (params) => {
      // Enforce single outgoing edge per source handle
      const exists = edges.some(
        (e) => e.source === params.source && e.sourceHandle === params.sourceHandle
      )
      if (exists) {
        showToast('Only one connection allowed from this source.', 'error')
        return
      }
      setEdges((eds) => addEdge({ ...params, animated: true }, eds))
    },
    [edges]
  )

  const onSelectionChange = useCallback(({ nodes: sel }) => {
    setSelectedNodeId(sel?.[0]?.id || null)
  }, [])

  // DnD
  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()
      const raw = event.dataTransfer.getData('application/reactflow')
      if (!raw) return
      const spec = JSON.parse(raw)

      const bounds = event.currentTarget.getBoundingClientRect()
      const position = { x: event.clientX - bounds.left - 100, y: event.clientY - bounds.top - 40 }

      const id = String(idRef.current++)
      const newNode = {
        id,
        type: spec.type,
        position,
        data: spec.initialData || {},
      }
      setNodes((nds) => nds.concat(newNode))
    },
    [setNodes]
  )

  const onPaneClick = useCallback(() => setSelectedNodeId(null), [])

  // Update node from Settings Panel
  const applyNodeChange = useCallback(
    (updated) => {
      setNodes((nds) => nds.map((n) => (n.id === updated.id ? updated : n)))
    },
    [setNodes]
  )

  // Save validation
  const validate = useCallback(() => {
    if (nodes.length <= 1) return { ok: true, emptySourceCount: 0 }

    const nodeHasOutgoing = (nodeId) => edges.some((e) => e.source === nodeId)
    const nodesWithEmptySource = nodes.filter((n) => !nodeHasOutgoing(n.id))
    const count = nodesWithEmptySource.length
    const ok = !(nodes.length > 1 && count > 1)
    return { ok, emptySourceCount: count, nodesWithEmptySource }
  }, [nodes, edges])

  const onSave = useCallback(() => {
    const res = validate()
    if (!res.ok) {
      showToast('More than one node has an empty target (no outgoing edge).', 'error', 4000)
      return
    }
    // Serialize
    const payload = {
      nodes,
      edges,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem('bitespeed_flow', JSON.stringify(payload))
    showToast('Flow saved!', 'success')
  }, [nodes, edges, validate])

  const panel = selectedNode ? (
    <SettingsPanel
      selected={selectedNode}
      onChange={applyNodeChange}
      onClose={() => setSelectedNodeId(null)}
    />
  ) : (
    <NodesPanel registry={NODE_REGISTRY} />
  )

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="dot" />
          BiteSpeed • Chatbot Flow Builder
        </div>
        <div className="actions">
          <button className="button" onClick={onSave}>Save</button>
          <button className="button ghost" onClick={() => {
            setNodes([]); setEdges([]); setSelectedNodeId(null);
          }}>Reset</button>
        </div>
      </header>

      {panel}

      <div className="canvas" onDrop={onDrop} onDragOver={onDragOver}>
        {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}


        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneClick={onPaneClick}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <MiniMap pannable zoomable />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  )
}
