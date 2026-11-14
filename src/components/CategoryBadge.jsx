import { getCategoryColor } from '../data/categoryColors'

function CategoryBadge({ category }) {
  const color = getCategoryColor(category)
  return (
    <span className="category-badge" style={{ borderColor: color, color }}>
      {category}
    </span>
  )
}

export default CategoryBadge