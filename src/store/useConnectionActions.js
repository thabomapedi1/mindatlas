import { useKnowledge } from './useKnowledge'
import { makeId } from '../utils/makeId'

// Shared logic for creating and deleting connections.
export function useConnectionActions() {
  const { connections, dispatch } = useKnowledge()

  function createConnection(source, target, label = 'related to') {
    dispatch({
      type: 'ADD_CONNECTION',
      connection: {
        id: makeId(`${source}-${target}`, connections.map((c) => c.id)),
        source,
        target,
        label,
      },
    })
  }

  function deleteConnection(id) {
    dispatch({ type: 'DELETE_CONNECTION', id })
  }

  return { createConnection, deleteConnection }
}