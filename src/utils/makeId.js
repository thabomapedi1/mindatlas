// Builds an id from a title: "Free Will" -> "free-will".
// If that id is already taken, adds -2, -3 and so on.
export function makeId(title, existingIds) {
  const base =
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'concept'

  let id = base
  let counter = 2
  while (existingIds.includes(id)) {
    id = `${base}-${counter}`
    counter += 1
  }
  return id
}