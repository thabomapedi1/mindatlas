import { useKnowledge } from './useKnowledge'
import { makeId } from '../utils/makeId'

// Shared logic for creating concepts, used by the Overview and the graph.
export function useConceptActions() {
  const { concepts, dispatch } = useKnowledge()

  // Takes the form values, saves the concept, and returns it.
  function createConcept(formValues) {
    const now = new Date().toISOString()
    const concept = {
      id: makeId(formValues.title, concepts.map((c) => c.id)),
      ...formValues,
      createdAt: now,
      updatedAt: now,
    }
    dispatch({ type: 'ADD_CONCEPT', concept })
    return concept
  }

  return { createConcept }
}