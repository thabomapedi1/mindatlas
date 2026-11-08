import { useCallback, useMemo, useState } from 'react'
import { ReactFlow, Background, Controls, MiniMap, useNodesState } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import ConceptDetailPanel from '../components/ConceptDetailPanel'
import { useKnowledge } from '../store/useKnowledge'
import { conceptsToNodes, connectionsToEdges } from '../utils/graphMappers'
import '../styles/overview.css'
import '../styles/graph.css'

function GraphPage() {
  const { concepts, connections } = useKnowledge()

  const [nodes, setNodes, onNodesChange] = useNodesState(conceptsToNodes(concepts))
  const [selectedId, setSelectedId] = useState(null)
  const [flowInstance, setFlowInstance] = useState(null)

  const edges = useMemo(() => connectionsToEdges(connections), [connections])
  const selectedConcept = concepts.find((c) => c.id === selectedId) ?? null

  // Mouse: clicking a node opens its panel, clicking empty space closes it.
  const handleNodeClick = useCallback((_event, node) => setSelectedId(node.id), [])
  const handlePaneClick = useCallback(() => setSelectedId(null), [])

  // Keyboard: Tab + Enter selects a node without a click, so we also
  // listen to React Flow's selection event.
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

  return (
    <section className="graph-page">
      <header className="page-header">
        <h1>Knowledge Graph</h1>
        <p className="muted">Drag nodes to rearrange. Click a node for details.</p>
      </header>

      {concepts.length === 0 ? (
        <p className="muted">No concepts yet. Create one from the Overview to see it here.</p>
      ) : (
        <div className="graph-workspace">
          <div className="graph-canvas">
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
    </section>
  )
}

export default GraphPage