// Turns a saved concept into the values the ConceptForm fields expect.
export function conceptToFormValues(concept) {
  return {
    title: concept.title,
    description: concept.description,
    notes: concept.notes ?? '',
    category: concept.category,
    tagsText: concept.tags.join(', '),
  }
}