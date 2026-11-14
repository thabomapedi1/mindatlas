// Content for a Modal that asks "are you sure?".
function ConfirmDialog({ message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <div>
      <p className="confirm-message">{message}</p>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} autoFocus>
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}

export default ConfirmDialog