import { useKnowledge } from './useKnowledge'
import { makeId } from '../utils/makeId'

// Shared logic for creating and deleting concepts.
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

  // The reducer also removes every connection attached to this concept.
  function deleteConcept(id) {
    dispatch({ type: 'DELETE_CONCEPT', id })
  }

  return { createConcept, deleteConcept }
}