import { Trash2, X } from 'lucide-react'
import { getCategoryColor } from '../data/categoryColors'
import { formatDate } from '../utils/formatDate'

function CategoryBadge({ category }) {
  const color = getCategoryColor(category)
  return (
    <span className="category-badge" style={{ borderColor: color, color }}>
      {category}
    </span>
  )
}

function ConceptDetailPanel({
  concept,
  concepts,
  connections,
  onSelect,
  onClose,
  onDeleteConcept,
  onDeleteConnection,
}) {
  // Every connection touching this concept, with the concept on the other end.
  const relations = connections
    .filter((c) => c.source === concept.id || c.target === concept.id)
    .map((c) => {
      const outgoing = c.source === concept.id
      const other = concepts.find((x) => x.id === (outgoing ? c.target : c.source))
      return { id: c.id, label: c.label, outgoing, other }
    })
    .filter((relation) => relation.other)

  const relatedCategories = [...new Set(relations.map((r) => r.other.category))].filter(
    (category) => category !== concept.category,
  )

  return (
    <aside className="detail-panel" aria-label="Concept details">
      <div className="detail-header">
        <h2>{concept.title}</h2>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Close details">
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <CategoryBadge category={concept.category} />
      <p>{concept.description}</p>

      <h3>Notes</h3>
      <p>{concept.notes || <span className="muted">No notes yet.</span>}</p>

      {concept.tags.length > 0 && (
        <>
          <h3>Tags</h3>
          <ul className="tag-list">
            {concept.tags.map((tag) => (
              <li key={tag} className="tag">
                {tag}
              </li>
            ))}
          </ul>
        </>
      )}

      <h3>Connections ({relations.length})</h3>
      {relations.length === 0 ? (
        <p className="muted">No connections yet.</p>
      ) : (
        <ul className="relation-list">
          {relations.map((relation) => {
            const otherButton = (
              <button type="button" className="link-button" onClick={() => onSelect(relation.other.id)}>
                {relation.other.title}
              </button>
            )
            return (
              <li key={relation.id} className="relation-row">
                <span>
                  {relation.outgoing ? (
                    <>
                      {concept.title} <span className="relation-label">{relation.label}</span> {otherButton}
                    </>
                  ) : (
                    <>
                      {otherButton} <span className="relation-label">{relation.label}</span> {concept.title}
                    </>
                  )}
                </span>
                <button
                  type="button"
                  className="icon-button icon-button-danger"
                  onClick={() => onDeleteConnection(relation.id)}
                  aria-label={`Delete connection between ${concept.title} and ${relation.other.title}`}
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {relatedCategories.length > 0 && (
        <>
          <h3>Related categories</h3>
          <div className="tag-list">
            {relatedCategories.map((category) => (
              <CategoryBadge key={category} category={category} />
            ))}
          </div>
        </>
      )}

      <p className="detail-dates">
        Created {formatDate(concept.createdAt)} · Updated {formatDate(concept.updatedAt)}
      </p>

      <div className="detail-actions">
        <button type="button" className="btn btn-danger" onClick={onDeleteConcept}>
          <Trash2 size={16} aria-hidden="true" />
          Delete concept
        </button>
      </div>
    </aside>
  )
}

export default ConceptDetailPanel