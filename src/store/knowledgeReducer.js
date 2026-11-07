// A reducer is a pure function: (current state, action) => new state.
// It never changes the old state; it returns a fresh copy.
// Ids and dates are created by the caller, so this stays predictable.

export function knowledgeReducer(state, action) {
  switch (action.type) {
    case 'ADD_CONCEPT':
      return { ...state, concepts: [action.concept, ...state.concepts] }

    case 'UPDATE_CONCEPT':
      return {
        ...state,
        concepts: state.concepts.map((concept) =>
          concept.id === action.id ? { ...concept, ...action.changes } : concept,
        ),
      }

    case 'DELETE_CONCEPT':
      // Deleting a concept also removes every connection attached to it.
      return {
        ...state,
        concepts: state.concepts.filter((c) => c.id !== action.id),
        connections: state.connections.filter(
          (c) => c.source !== action.id && c.target !== action.id,
        ),
      }

    case 'ADD_CONNECTION':
      return { ...state, connections: [...state.connections, action.connection] }

    case 'DELETE_CONNECTION':
      return {
        ...state,
        connections: state.connections.filter((c) => c.id !== action.id),
      }

    default:
      return state
  }
}