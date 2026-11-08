// Builds a stable key for a pair, so A+B and B+A count as the same pair.
function pairKey(idA, idB) {
  return [idA, idB].sort().join('|')
}

export function suggestConnections(concepts, connections, limit = 3) {
  const alreadyLinked = new Set(connections.map((c) => pairKey(c.source, c.target)))

  // For each concept, the set of concepts it is directly connected to.
  const neighbours = {}
  concepts.forEach((c) => {
    neighbours[c.id] = new Set()
  })
  connections.forEach((c) => {
    neighbours[c.source]?.add(c.target)
    neighbours[c.target]?.add(c.source)
  })

  const titleById = Object.fromEntries(concepts.map((c) => [c.id, c.title]))
  const suggestions = []

  for (let i = 0; i < concepts.length; i += 1) {
    for (let j = i + 1; j < concepts.length; j += 1) {
      const a = concepts[i]
      const b = concepts[j]
      if (alreadyLinked.has(pairKey(a.id, b.id))) continue

      const sharedTags = a.tags.filter((tag) => b.tags.includes(tag))
      const sharedNeighbours = [...neighbours[a.id]].filter((id) => neighbours[b.id].has(id))
      const sameCategory = a.category === b.category

      const score = sharedTags.length * 2 + sharedNeighbours.length * 2 + (sameCategory ? 1 : 0)
      if (score < 2) continue

      const reasons = []
      if (sharedTags.length > 0) {
        reasons.push(`Both tagged ${sharedTags.map((t) => `"${t}"`).join(', ')}`)
      }
      if (sharedNeighbours.length > 0) {
        reasons.push(`Both linked to ${sharedNeighbours.map((id) => titleById[id]).join(' and ')}`)
      }
      if (sameCategory) {
        reasons.push(`Both in ${a.category}`)
      }

      suggestions.push({ source: a.id, target: b.id, score, reasons })
    }
  }

  return suggestions
    .sort(
      (x, y) =>
        y.score - x.score ||
        titleById[x.source].localeCompare(titleById[y.source]) ||
        titleById[x.target].localeCompare(titleById[y.target]),
    )
    .slice(0, limit)
}