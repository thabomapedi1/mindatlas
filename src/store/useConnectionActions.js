import { useKnowledge } from './useKnowledge'
import { makeId } from '../utils/makeId'

// Shared logic for creating connections, used by the graph and the Overview.
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

  return { createConnection }
}