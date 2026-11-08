import { useMemo } from 'react'
import { ReactFlow, Background, Controls, MiniMap, useNodesState } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useKnowledge } from '../store/useKnowledge'
import { conceptsToNodes, connectionsToEdges } from '../utils/graphMappers'
import '../styles/overview.css'
import '../styles/graph.css'

function GraphPage() {
  const { concepts, connections } = useKnowledge()

  // useNodesState keeps the nodes in React state so dragging works.
  // It returns [nodes, setNodes, onNodesChange]; we don't need setNodes yet,
  // so the empty space between the commas skips it.
  const [nodes, , onNodesChange] = useNodesState(conceptsToNodes(concepts))

  // useMemo rebuilds the edges only when `connections` changes.
  const edges = useMemo(() => connectionsToEdges(connections), [connections])

  return (
    <section className="graph-page">
      <header className="page-header">
        <h1>Knowledge Graph</h1>
        <p className="muted">Drag nodes to rearrange. Scroll to zoom.</p>
      </header>

      {concepts.length === 0 ? (
        <p className="muted">No concepts yet. Create one from the Overview to see it here.</p>
      ) : (
        <div className="graph-canvas">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
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
      )}
    </section>
  )
}

export default GraphPage