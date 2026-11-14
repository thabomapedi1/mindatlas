import { useCallback, useMemo, useRef, useState } from 'react'
import { ReactFlow, Background, Controls, MiniMap, useNodesState } from '@xyflow/react'
import { Plus } from 'lucide-react'
import '@xyflow/react/dist/style.css'
import ConceptDetailPanel from '../components/ConceptDetailPanel'
import ConceptForm from '../components/ConceptForm'
import ConfirmDialog from '../components/ConfirmDialog'
import ConnectionForm from '../components/ConnectionForm'
import Modal from '../components/Modal'
import { useKnowledge } from '../store/useKnowledge'
import { useConceptActions } from '../store/useConceptActions'
import { useConnectionActions } from '../store/useConnectionActions'
import { canConnect } from '../utils/connectionRules'
import { conceptsToNodes, conceptToNode, connectionsToEdges } from '../utils/graphMappers'
import '../styles/overview.css'
import '../styles/graph.css'

function GraphPage() {
  const { concepts, connections } = useKnowledge()
  const { createConcept, deleteConcept } = useConceptActions()
  const { createConnection, updateConnectionLabel, deleteConnection } = useConnectionActions()

  const [nodes, setNodes, onNodesChange] = useNodesState(conceptsToNodes(concepts))
  const [selectedId, setSelectedId] = useState(null)
  const [flowInstance, setFlowInstance] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [pendingConnection, setPendingConnection] = useState(null)
  const [pendingEdit, setPendingEdit] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const canvasRef = useRef(null)

  const edges = useMemo(() => connectionsToEdges(connections), [connections])
  const selectedConcept = concepts.find((c) => c.id === selectedId) ?? null
  const titleOf = (id) => concepts.find((c) => c.id === id)?.title ?? id

  const editingConnection = connections.find((c) => c.id === pendingEdit) ?? null
  const pendingDeleteConcept = concepts.find((c) => c.id === pendingDelete) ?? null
  const pendingDeleteLinks = pendingDeleteConcept
    ? connections.filter((c) => c.source === pendingDelete || c.target === pendingDelete).length
    : 0

  // Mouse: clicking a node opens its panel, clicking empty space closes it.
  const handleNodeClick = useCallback((_event, node) => setSelectedId(node.id), [])
  const handlePaneClick = useCallback(() => setSelectedId(null), [])

  // Keyboard: Tab to a node, then Enter or Space opens its panel.
  function handleCanvasKeyDown(event) {
    const isNode = event.target.classList?.contains('react-flow__node')
    if (isNode && (event.key === 'Enter' || event.key === ' ')) {
      setSelectedId(event.target.dataset.id)
    }
  }

  // Refuses self-connections and duplicates while you drag.
  const isValidConnection = useCallback(
    (connection) => canConnect(connections, connection.source, connection.target),
    [connections],
  )

  // A drag finished on a valid target: ask for a label before saving.
  const handleConnect = useCallback((connection) => {
    setPendingConnection({ source: connection.source, target: connection.target })
  }, [])

  // The panel's "Add connection" uses the same label pop-up as dragging.
  function handleAddFromPanel(targetId) {
    setPendingConnection({ source: selectedConcept.id, target: targetId })
  }

  function handleConfirmConnection(label) {
    createConnection(pendingConnection.source, pendingConnection.target, label)
    setPendingConnection(null)
  }

  function handleConfirmEdit(label) {
    updateConnectionLabel(pendingEdit, label)
    setPendingEdit(null)
  }

  // Removes the concept from the store AND the node from the graph's own list.
  function handleConfirmDelete() {
    deleteConcept(pendingDelete)
    setNodes((current) => current.filter((node) => node.id !== pendingDelete))
    setSelectedId(null)
    setPendingDelete(null)
  }

  // Selects one node (or none, when id is null) and zooms to it.
  function selectNode(id) {
    setSelectedId(id)
    setNodes((current) => current.map((node) => ({ ...node, selected: node.id === id })))
    if (id && flowInstance) {
      flowInstance.fitView({ nodes: [{ id }], duration: 400, maxZoom: 1.2 })
    }
  }

  // The centre of the part of the graph currently on screen, in graph coordinates.
  function getViewCentre() {
    if (!flowInstance || !canvasRef.current) return { x: 0, y: 0 }
    const rect = canvasRef.current.getBoundingClientRect()
    return flowInstance.screenToFlowPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
  }

  function handleCreate(formValues) {
    const concept = createConcept(formValues)
    const centre = getViewCentre()
    const offset = (nodes.length % 5) * 24
    const position = { x: centre.x - 60 + offset, y: centre.y - 20 + offset }

    setNodes((current) => [
      ...current.map((node) => ({ ...node, selected: false })),
      { ...conceptToNode(concept, position), selected: true },
    ])
    setSelectedId(concept.id)
    setIsCreating(false)
  }

  return (
    <section className="graph-page">
      <div className="page-header-row">
        <header className="page-header">
          <h1>Knowledge Graph</h1>
          <p className="muted">
            Click a node for details. To connect, drag from a node's bottom dot to another node's top dot,
            or use "Add connection" in the panel.
          </p>
        </header>
        <button type="button" className="btn btn-primary" onClick={() => setIsCreating(true)}>
          <Plus size={16} aria-hidden="true" />
          New concept
        </button>
      </div>

      {concepts.length === 0 ? (
        <p className="muted">No concepts yet. Use "New concept" to add your first one.</p>
      ) : (
        <div className="graph-workspace">
          <div className="graph-canvas" ref={canvasRef} onKeyDown={handleCanvasKeyDown}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onNodeClick={handleNodeClick}
              onPaneClick={handlePaneClick}
              onConnect={handleConnect}
              isValidConnection={isValidConnection}
              onInit={setFlowInstance}
              colorMode="dark"
              fitView
              minZoom={0.2}
              maxZoom={2}
              deleteKeyCode={null}
            >
              <Background gap={24} />
              <Controls showInteractive={false} />
              <MiniMap pannable zoomable nodeColor={(node) => node.data.color} />
            </ReactFlow>
          </div>

          {selectedConcept && (
            <ConceptDetailPanel
              key={selectedConcept.id}
              concept={selectedConcept}
              concepts={concepts}
              connections={connections}
              onSelect={selectNode}
              onClose={() => selectNode(null)}
              onDeleteConcept={() => setPendingDelete(selectedConcept.id)}
              onAddConnection={handleAddFromPanel}
              onEditConnection={setPendingEdit}
              onDeleteConnection={deleteConnection}
            />
          )}
        </div>
      )}

      {isCreating && (
        <Modal title="New concept" onClose={() => setIsCreating(false)}>
          <ConceptForm
            existingTitles={concepts.map((c) => c.title.toLowerCase())}
            submitLabel="Create concept"
            onSubmit={handleCreate}
            onCancel={() => setIsCreating(false)}
          />
        </Modal>
      )}

      {pendingConnection && (
        <Modal title="New connection" onClose={() => setPendingConnection(null)}>
          <ConnectionForm
            fromTitle={titleOf(pendingConnection.source)}
            toTitle={titleOf(pendingConnection.target)}
            onSubmit={handleConfirmConnection}
            onCancel={() => setPendingConnection(null)}
          />
        </Modal>
      )}

      {editingConnection && (
        <Modal title="Edit connection" onClose={() => setPendingEdit(null)}>
          <ConnectionForm
            fromTitle={titleOf(editingConnection.source)}
            toTitle={titleOf(editingConnection.target)}
            initialLabel={editingConnection.label}
            submitLabel="Save label"
            onSubmit={handleConfirmEdit}
            onCancel={() => setPendingEdit(null)}
          />
        </Modal>
      )}

      {pendingDeleteConcept && (
        <Modal title="Delete concept" onClose={() => setPendingDelete(null)}>
          <ConfirmDialog
            message={`Delete "${pendingDeleteConcept.title}"?${
              pendingDeleteLinks > 0
                ? ` This also removes ${pendingDeleteLinks} connection${pendingDeleteLinks === 1 ? '' : 's'}.`
                : ''
            } This cannot be undone.`}
            confirmLabel="Delete concept"
            onConfirm={handleConfirmDelete}
            onCancel={() => setPendingDelete(null)}
          />
        </Modal>
      )}
    </section>
  )
}

export default GraphPage