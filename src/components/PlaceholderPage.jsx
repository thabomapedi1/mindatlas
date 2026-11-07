import { useKnowledge } from '../store/useKnowledge'

function PlaceholderPage({ title, description }) {
  const { concepts } = useKnowledge()

  return (
    <section>
      <h1>{title}</h1>
      <p className="muted">{description}</p>
      <p className="muted">{concepts.length} concepts loaded</p>
    </section>
  )
}

export default PlaceholderPage