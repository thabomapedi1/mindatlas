// Keeps the concepts that match every word typed in the search box.
// Searches title, description, category and tags (not case-sensitive).
export function searchConcepts(concepts, query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return concepts

  return concepts.filter((concept) => {
    const text = [concept.title, concept.description, concept.category, ...concept.tags]
      .join(' ')
      .toLowerCase()
    return words.every((word) => text.includes(word))
  })
}