// One restrained accent colour per category, used on the graph.
export const categoryColors = {
  Philosophy: '#8b8cf8',
  Psychology: '#5fb8a8',
  Neuroscience: '#e5886b',
  Science: '#d4b45c',
  Technology: '#5aa7e8',
  Epistemology: '#b98ae0',
}

export function getCategoryColor(category) {
  return categoryColors[category] ?? '#8b93a1'
}