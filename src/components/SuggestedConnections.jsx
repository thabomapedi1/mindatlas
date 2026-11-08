import { useKnowledge } from '../store/useKnowledge'
import { suggestConnections } from '../utils/suggestConnections'
import { makeId } from '../utils/makeId'

function SuggestedConnections() {
  const { concepts, connections, dispatch } = useKnowledge()
  const suggestions = suggestConnections(concepts, connections)
  const titleOf = (id) => concepts.find((c) => c.id === id)?.title ?? id

  function handleConnect({ source, target }) {
    dispatch({
      type: 'ADD_CONNECTION',
      connection: {
        id: makeId(`${source}-${target}`, connections.map((c) => c.id)),
        source,
        target,
        label: 'related to',
      },
    })
  }

  return (
    <div className="panel">
      <h2>Suggested connections</h2>
      <p className="muted suggestion-intro">Based on shared tags and mutual connections.</p>

      {suggestions.length === 0 ? (
        <p className="muted">No suggestions right now. Add more concepts and tags to see ideas here.</p>
      ) : (
        <ul className="recent-list">
          {suggestions.map((suggestion) => (
            <li key={`${suggestion.source}-${suggestion.target}`} className="recent-item">
              <div>
                <p className="recent-title">
                  {titleOf(suggestion.source)} + {titleOf(suggestion.target)}
                </p>
                <p className="recent-meta">{suggestion.reasons.join(' · ')}</p>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleConnect(suggestion)}
                aria-label={`Connect ${titleOf(suggestion.source)} and ${titleOf(suggestion.target)}`}
              >
                Connect
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SuggestedConnections