import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import CategoryBadge from '../components/CategoryBadge'
import ConceptPanel from '../components/ConceptPanel'
import { useKnowledge } from '../store/useKnowledge'
import { searchConcepts } from '../utils/searchConcepts'
import { formatDate } from '../utils/formatDate'
import '../styles/overview.css'
import '../styles/library.css'

const plural = (count) => (count === 1 ? 'concept' : 'concepts')

function LibraryPage() {
  const { concepts } = useKnowledge()
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const selectedConcept = concepts.find((c) => c.id === selectedId) ?? null

  // Derived data: recalculated from the store and the query, never stored.
  const results = useMemo(
    () => [...searchConcepts(concepts, query)].sort((a, b) => a.title.localeCompare(b.title)),
    [concepts, query],
  )

  const isSearching = query.trim() !== ''
  const countText = isSearching
    ? `${results.length} of ${concepts.length} ${plural(concepts.length)}`
    : `${concepts.length} ${plural(concepts.length)}`

  return (
    <section>
      <header className="page-header">
        <h1>Library</h1>
        <p className="muted">Browse and search everything you've saved. Select a card to see or edit it.</p>
      </header>

      <div className="library-layout">
        <div className="library-main">
          {concepts.length === 0 ? (
            <div className="empty-state">
              <p className="muted">
                Your library is empty. Create a concept from the Overview or the Knowledge Graph.
              </p>
            </div>
          ) : (
            <>
              <div className="search-field" role="search">
                <Search size={16} className="search-icon" aria-hidden="true" />
                <label htmlFor="library-search" className="visually-hidden">
                  Search concepts by name, description, category or tag
                </label>
                <input
                  id="library-search"
                  type="search"
                  placeholder="Search name, description, category or tag"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                {query !== '' && (
                  <button
                    type="button"
                    className="icon-button search-clear"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                )}
              </div>

              <p className="muted result-count" aria-live="polite">
                {countText}
              </p>

              {results.length === 0 ? (
                <div className="empty-state">
                  <p className="muted">No concepts match "{query.trim()}".</p>
                  <button type="button" className="btn btn-secondary" onClick={() => setQuery('')}>
                    Clear search
                  </button>
                </div>
              ) : (
                <ul className="concept-grid">
                  {results.map((concept) => {
                    const isSelected = concept.id === selectedId
                    return (
                      <li
                        key={concept.id}
                        className={isSelected ? 'concept-card selected' : 'concept-card'}
                      >
                        <h2>
                          <button
                            type="button"
                            className="card-title-button"
                            onClick={() => setSelectedId(concept.id)}
                            aria-current={isSelected ? 'true' : undefined}
                          >
                            {concept.title}
                          </button>
                        </h2>
                        <CategoryBadge category={concept.category} />
                        <p>{concept.description}</p>
                        {concept.tags.length > 0 && (
                          <ul className="tag-list">
                            {concept.tags.map((tag) => (
                              <li key={tag} className="tag">
                                {tag}
                              </li>
                            ))}
                          </ul>
                        )}
                        <span className="muted concept-card-date">
                          Updated {formatDate(concept.updatedAt)}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </>
          )}
        </div>

        {selectedConcept && (
          <ConceptPanel
            key={selectedConcept.id}
            concept={selectedConcept}
            onSelect={setSelectedId}
            onClose={() => setSelectedId(null)}
            onDeleted={() => setSelectedId(null)}
          />
        )}
      </div>
    </section>
  )
}

export default LibraryPage