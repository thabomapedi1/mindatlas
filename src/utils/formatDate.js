// Turns "2026-11-02T09:00:00.000Z" into "2 Nov 2026".
export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}