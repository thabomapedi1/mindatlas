import { useKnowledge } from './useKnowledge'
import { makeId } from '../utils/makeId'

// Shared logic for creating, editing and deleting concepts.
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

  // The id never changes, even if the title does, so connections stay valid.
  function updateConcept(id, formValues) {
    dispatch({
      type: 'UPDATE_CONCEPT',
      id,
      changes: { ...formValues, updatedAt: new Date().toISOString() },
    })
  }

  // The reducer also removes every connection attached to this concept.
  function deleteConcept(id) {
    dispatch({ type: 'DELETE_CONCEPT', id })
  }

  return { createConcept, updateConcept, deleteConcept }
}