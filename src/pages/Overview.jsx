import { useState } from 'react'
import { Lightbulb, Link2, Layers, Plus } from 'lucide-react'
import StatCard from '../components/StatCard'
import Modal from '../components/Modal'
import ConceptForm from '../components/ConceptForm'
import { useKnowledge } from '../store/useKnowledge'
import { formatDate } from '../utils/formatDate'
import { makeId } from '../utils/makeId'
import '../styles/overview.css'

function Overview() {
  const { concepts, connections, dispatch } = useKnowledge()
  const [isCreating, setIsCreating] = useState(false)

  const recentConcepts = [...concepts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const categoryCount = new Set(concepts.map((c) => c.category)).size

  function handleCreate(formValues) {
    const now = new Date().toISOString()
    dispatch({
      type: 'ADD_CONCEPT',
      concept: {
        id: makeId(formValues.title, concepts.map((c) => c.id)),
        ...formValues,
        createdAt: now,
        updatedAt: now,
      },
    })
    setIsCreating(false)
  }

  return (
    <section>
      <div className="page-header-row">
        <header className="page-header">
          <h1>Welcome back</h1>
          <p className="muted">Connect ideas. Discover knowledge. Expand your thinking.</p>
        </header>
        <button type="button" className="btn btn-primary" onClick={() => setIsCreating(true)}>
          <Plus size={16} aria-hidden="true" />
          New concept
        </button>
      </div>

      <div className="stat-grid">
        <StatCard icon={Lightbulb} label="Concepts" value={concepts.length} />
        <StatCard icon={Link2} label="Connections" value={connections.length} />
        <StatCard icon={Layers} label="Categories in use" value={categoryCount} />
      </div>

      <div className="panel">
        <h2>Recently created</h2>
        {recentConcepts.length === 0 ? (
          <p className="muted">No concepts yet. Create your first one to get started.</p>
        ) : (
          <ul className="recent-list">
            {recentConcepts.map((concept) => (
              <li key={concept.id} className="recent-item">
                <div>
                  <p className="recent-title">{concept.title}</p>
                  <p className="recent-meta">{concept.category}</p>
                </div>
                <span className="recent-date">{formatDate(concept.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isCreating && (
        <Modal title="New concept" onClose={() => setIsCreating(false)}>
          <ConceptForm
            existingTitles={concepts.map((c) => c.title.toLowerCase())}
            submitLabel="Create concept"
            onSubmit={handleCreate}
            onCancel={() => setIsCreating(false)}
          />
        </Modal>
      )}
    </section>
  )
}

export default Overview