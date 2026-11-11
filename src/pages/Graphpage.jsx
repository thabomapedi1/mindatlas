import { useCallback, useMemo, useRef, useState } from 'react'
import { ReactFlow, Background, Controls, MiniMap, useNodesState } from '@xyflow/react'
import { Plus } from 'lucide-react'
import '@xyflow/react/dist/style.css'
import ConceptDetailPanel from '../components/ConceptDetailPanel'
import ConceptForm from '../components/ConceptForm'
import Modal from '../components/Modal'
import { useKnowledge } from '../store/useKnowledge'
import { useConceptActions } from '../store/useConceptActions'
import { conceptsToNodes, conceptToNode, connectionsToEdges } from '../utils/graphMappers'
import '../styles/overview.css'
import '../styles/graph.css'

function GraphPage() {
  const { concepts, connections } = useKnowledge()
  const { createConcept } = useConceptActions()

  const [nodes, setNodes, onNodesChange] = useNodesState(conceptsToNodes(concepts))
  const [selectedId, setSelectedId] = useState(null)
  const [flowInstance, setFlowInstance] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const canvasRef = useRef(null)

  const edges = useMemo(() => connectionsToEdges(connections), [connections])
  const selectedConcept = concepts.find((c) => c.id === selectedId) ?? null

  // Mouse: clicking a node opens its panel, clicking empty space closes it.
  const handleNodeClick = useCallback((_event, node) => setSelectedId(node.id), [])
  const handlePaneClick = useCallback(() => setSelectedId(null), [])

  // Keyboard: Tab + Enter selects a node without a click.
  const handleSelectionChange = useCallback(({ nodes: selectedNodes }) => {
    if (selectedNodes.length > 0) setSelectedId(selectedNodes[0].id)
  }, [])

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
    const offset = (nodes.length % 5) * 24 // stops new nodes stacking exactly
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
          <p className="muted">Drag nodes to rearrange. Click a node for details.</p>
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
          <div className="graph-canvas" ref={canvasRef}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onNodeClick={handleNodeClick}
              onPaneClick={handlePaneClick}
              onSelectionChange={handleSelectionChange}
              onInit={setFlowInstance}
              colorMode="dark"
              fitView
              minZoom={0.2}
              maxZoom={2}
              nodesConnectable={false}
              deleteKeyCode={null}
            >
              <Background gap={24} />
              <Controls showInteractive={false} />
              <MiniMap pannable zoomable nodeColor={(node) => node.data.color} />
            </ReactFlow>
          </div>

          {selectedConcept && (
            <ConceptDetailPanel
              concept={selectedConcept}
              concepts={concepts}
              connections={connections}
              onSelect={selectNode}
              onClose={() => selectNode(null)}
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
    </section>
  )
}

export default GraphPage