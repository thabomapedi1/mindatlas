import { useState } from 'react'
import { categories } from '../data/sampleData'

const emptyValues = {
  title: '',
  description: '',
  notes: '',
  category: categories[0],
  tagsText: '',
}

// "mind, Awareness, mind" -> ["mind", "awareness"]
function parseTags(text) {
  const tags = text
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
  return [...new Set(tags)]
}

function validate(values, existingTitles) {
  const errors = {}
  const title = values.title.trim()

  if (!title) {
    errors.title = 'Please enter a title.'
  } else if (title.length > 60) {
    errors.title = 'Keep the title under 60 characters.'
  } else if (existingTitles.includes(title.toLowerCase())) {
    errors.title = 'A concept with this title already exists.'
  }

  if (!values.description.trim()) {
    errors.description = 'Please add a short description.'
  } else if (values.description.trim().length > 200) {
    errors.description = 'Keep the description under 200 characters.'
  }

  return errors
}

function Field({ id, label, error, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function ConceptForm({
  initialValues = emptyValues,
  existingTitles = [],
  submitLabel = 'Save',
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault() // stops the browser reloading the page

    const foundErrors = validate(values, existingTitles)
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors)
      return
    }

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      notes: values.notes.trim(),
      category: values.category,
      tags: parseTags(values.tagsText),
    })
  }

  function fieldProps(name) {
    return {
      id: name,
      name,
      value: values[name],
      onChange: handleChange,
      'aria-invalid': Boolean(errors[name]),
      'aria-describedby': errors[name] ? `${name}-error` : undefined,
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field id="title" label="Title" error={errors.title}>
        <input type="text" autoFocus {...fieldProps('title')} />
      </Field>

      <Field id="description" label="Short description" error={errors.description}>
        <input type="text" {...fieldProps('description')} />
      </Field>

      <Field id="category" label="Category">
        <select {...fieldProps('category')}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </Field>

      <Field id="tagsText" label="Tags (separated by commas)">
        <input type="text" placeholder="mind, awareness" {...fieldProps('tagsText')} />
      </Field>

      <Field id="notes" label="Detailed notes (optional)">
        <textarea rows="4" {...fieldProps('notes')} />
      </Field>

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

export default ConceptForm