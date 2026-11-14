import { useState } from 'react'

function ConnectionForm({
  fromTitle,
  toTitle,
  initialLabel = 'related to',
  submitLabel = 'Create connection',
  onSubmit,
  onCancel,
}) {
  const [label, setLabel] = useState(initialLabel)
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = label.trim()

    if (!trimmed) {
      setError('Please describe the relationship.')
      return
    }
    if (trimmed.length > 40) {
      setError('Keep it under 40 characters.')
      return
    }
    onSubmit(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="connection-summary">
        <strong>{fromTitle}</strong> → <strong>{toTitle}</strong>
      </p>

      <div className="field">
        <label htmlFor="connection-label">How are they related?</label>
        <input
          id="connection-label"
          type="text"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          autoFocus
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'connection-label-error' : undefined}
        />
        {error && (
          <p id="connection-label-error" className="field-error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

export default ConnectionForm