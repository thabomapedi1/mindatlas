import { Lightbulb, Link2, Layers } from 'lucide-react'
import StatCard from '../components/StatCard'
import { useKnowledge } from '../store/useKnowledge'
import { formatDate } from '../utils/formatDate'
import '../styles/overview.css'

function Overview() {
  const { concepts, connections } = useKnowledge()

  // Copy the list first ([...concepts]) so sorting never changes the original.
  const recentConcepts = [...concepts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const categoryCount = new Set(concepts.map((c) => c.category)).size

  return (
    <section>
      <header className="page-header">
        <h1>Welcome back</h1>
        <p className="muted">Connect ideas. Discover knowledge. Expand your thinking.</p>
      </header>

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
    </section>
  )
}

export default Overview