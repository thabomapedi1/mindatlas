import { getCategoryColor } from '../data/categoryColors'

// One concept -> one React Flow node, at the given position.
export function conceptToNode(concept, position) {
  const color = getCategoryColor(concept.category)

  return {
    id: concept.id,
    position,
    data: { label: concept.title, color },
    style: {
      background: '#14171c',
      color: '#e6e8ec',
      border: `1px solid ${color}`,
      borderRadius: 8,
      padding: '8px 12px',
      fontSize: 13,
    },
  }
}

// All concepts -> nodes, placed evenly around a circle.
// Sorting by category first keeps related concepts next to each other.
export function conceptsToNodes(concepts) {
  const ordered = [...concepts].sort(
    (a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title),
  )
  const radius = Math.max(260, ordered.length * 30)

  return ordered.map((concept, index) => {
    const angle = (2 * Math.PI * index) / ordered.length
    return conceptToNode(concept, {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    })
  })
}

// Connections -> React Flow edges.
export function connectionsToEdges(connections) {
  return connections.map((connection) => ({
    id: connection.id,
    source: connection.source,
    target: connection.target,
    label: connection.label,
    style: { stroke: '#3a4252' },
    labelStyle: { fill: '#8b93a1', fontSize: 11 },
    labelBgStyle: { fill: '#0f1115' },
    labelBgPadding: [6, 3],
  }))
}