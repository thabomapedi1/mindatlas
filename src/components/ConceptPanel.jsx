import { useState } from 'react'
import ConceptDetailPanel from './ConceptDetailPanel'
import ConceptForm from './ConceptForm'
import ConfirmDialog from './ConfirmDialog'
import ConnectionForm from './ConnectionForm'
import Modal from './Modal'
import { useKnowledge } from '../store/useKnowledge'
import { useConceptActions } from '../store/useConceptActions'
import { useConnectionActions } from '../store/useConnectionActions'
import { conceptToFormValues } from '../utils/conceptFormValues'

// The detail panel plus every pop-up it can open (edit, delete, connection label).
// Used by both the Knowledge Graph and the Library, so the logic lives once.
function ConceptPanel({ concept, onSelect, onClose, onEdited, onDeleted }) {
  const { concepts, connections } = useKnowledge()
  const { updateConcept, deleteConcept } = useConceptActions()
  const { createConnection, updateConnectionLabel, deleteConnection } = useConnectionActions()

  // Only one pop-up is open at a time. Examples:
  // { type: 'edit' }, { type: 'add-connection', target: 'memory' }
  const [dialog, setDialog] = useState(null)
  const closeDialog = () => setDialog(null)

  const titleOf = (id) => concepts.find((c) => c.id === id)?.title ?? id
  const linkCount = connections.filter(
    (c) => c.source === concept.id || c.target === concept.id,
  ).length
  const editingConnection =
    dialog?.type === 'edit-connection' ? connections.find((c) => c.id === dialog.id) : null

  function handleSaveConcept(formValues) {
    updateConcept(concept.id, formValues)
    onEdited?.({ ...concept, ...formValues })
    closeDialog()
  }

  function handleConfirmDelete() {
    deleteConcept(concept.id)
    onDeleted?.(concept.id)
    closeDialog()
  }

  function handleAddConnection(label) {
    createConnection(concept.id, dialog.target, label)
    closeDialog()
  }

  function handleSaveConnectionLabel(label) {
    updateConnectionLabel(dialog.id, label)
    closeDialog()
  }

  return (
    <>
      <ConceptDetailPanel
        concept={concept}
        concepts={concepts}
        connections={connections}
        onSelect={onSelect}
        onClose={onClose}
        onEditConcept={() => setDialog({ type: 'edit' })}
        onDeleteConcept={() => setDialog({ type: 'delete' })}
        onAddConnection={(targetId) => setDialog({ type: 'add-connection', target: targetId })}
        onEditConnection={(id) => setDialog({ type: 'edit-connection', id })}
        onDeleteConnection={deleteConnection}
      />

      {dialog?.type === 'edit' && (
        <Modal title="Edit concept" onClose={closeDialog}>
          <ConceptForm
            initialValues={conceptToFormValues(concept)}
            existingTitles={concepts
              .filter((c) => c.id !== concept.id)
              .map((c) => c.title.toLowerCase())}
            submitLabel="Save changes"
            onSubmit={handleSaveConcept}
            onCancel={closeDialog}
          />
        </Modal>
      )}

      {dialog?.type === 'delete' && (
        <Modal title="Delete concept" onClose={closeDialog}>
          <ConfirmDialog
            message={`Delete "${concept.title}"?${
              linkCount > 0
                ? ` This also removes ${linkCount} connection${linkCount === 1 ? '' : 's'}.`
                : ''
            } This cannot be undone.`}
            confirmLabel="Delete concept"
            onConfirm={handleConfirmDelete}
            onCancel={closeDialog}
          />
        </Modal>
      )}

      {dialog?.type === 'add-connection' && (
        <Modal title="New connection" onClose={closeDialog}>
          <ConnectionForm
            fromTitle={concept.title}
            toTitle={titleOf(dialog.target)}
            onSubmit={handleAddConnection}
            onCancel={closeDialog}
          />
        </Modal>
      )}

      {editingConnection && (
        <Modal title="Edit connection" onClose={closeDialog}>
          <ConnectionForm
            fromTitle={titleOf(editingConnection.source)}
            toTitle={titleOf(editingConnection.target)}
            initialLabel={editingConnection.label}
            submitLabel="Save label"
            onSubmit={handleSaveConnectionLabel}
            onCancel={closeDialog}
          />
        </Modal>
      )}
    </>
  )
}

export default ConceptPanel