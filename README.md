# BiteSpeed Frontend Task – Chatbot Flow Builder

A minimal, extensible chatbot flow builder built with **React + Vite + React Flow**.

## ✨ Features
- **Text Node**: custom node with one source (bottom) and one target (top) handle
- **Nodes Panel**: drag **Text Message** to the canvas
- **Settings Panel**: appears when a node is selected, edit text content
- **Edges**: connect nodes; **only one outgoing edge** allowed per node's source handle (enforced)
- **Save**: validates per requirement — if there are **more than one nodes** and **more than one node has an empty target (no outgoing edge)**, shows an error. Otherwise, saves to `localStorage`.
- **Reset**: clears canvas

> Note: In this context, an "empty target handle" is interpreted as a node whose **source handle** has no outgoing edge — i.e., the node does not connect to any next node.

## 🧱 Tech Stack
- React 18
- Vite
- React Flow

## 🚀 Run locally
```bash
# 1) Install deps
npm i

# 2) Start dev server
npm run dev
```

## 🏗 Build
```bash
npm run build
npm run preview
```

## ☁️ Deploy
- **Vercel**: Import this repo → Framework preset: *Vite* → Build command: `npm run build` → Output: `dist`
- **Netlify**: Build command: `npm run build` → Publish directory: `dist`

Add the deployed URL to this README under a new `## Live` section.

## 📁 Project structure
```
bitespeed-flow-builder/
  index.html
  package.json
  vite.config.js
  src/
    App.jsx
    main.jsx
    styles.css
    components/
      NodesPanel.jsx
      SettingsPanel.jsx
    nodes/
      TextNode.jsx
```

## ✅ Implementation notes
- **Extensibility**: Add new node types by pushing to `NODE_REGISTRY` and creating a component, then register in `nodeTypes`.
- **Single Outgoing Edge**: Enforced in `onConnect` by checking existing edges from the same source+sourceHandle.
- **Validation Rule**: On Save, we count nodes that have **no outgoing edges**. If `nodes.length > 1` and this count is `> 1`, we show an error as per the screenshot in the prompt.
- **Persistence**: For demo, saving writes to `localStorage`.

## 🖊️ Comments
Inline comments are included in the source to explain the logic.
