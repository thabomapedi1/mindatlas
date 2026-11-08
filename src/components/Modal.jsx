import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

// Uses the browser's built-in <dialog> element. It gives us for free:
// Esc to close, keyboard focus kept inside, and a dimmed background.
function Modal({ title, onClose, children }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClose={onClose}
      aria-labelledby="modal-title"
    >
      <div className="modal-header">
        <h2 id="modal-title">{title}</h2>
        <button
          type="button"
          className="icon-button"
          onClick={() => dialogRef.current.close()}
          aria-label="Close"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      {children}
    </dialog>
  )
}

export default Modal