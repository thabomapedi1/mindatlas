// A connection is allowed only between two different concepts
// that are not already linked (in either direction).
export function canConnect(connections, sourceId, targetId) {
  if (!sourceId || !targetId) return false
  if (sourceId === targetId) return false

  return !connections.some(
    (c) =>
      (c.source === sourceId && c.target === targetId) ||
      (c.source === targetId && c.target === sourceId),
  )
}