import { useKnowledge } from './useKnowledge'
import { makeId } from '../utils/makeId'

// Shared logic for creating, editing and deleting connections.
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

  function updateConnectionLabel(id, label) {
    dispatch({ type: 'UPDATE_CONNECTION', id, changes: { label } })
  }

  function deleteConnection(id) {
    dispatch({ type: 'DELETE_CONNECTION', id })
  }

  return { createConnection, updateConnectionLabel, deleteConnection }
}