import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Modal from './Modal.jsx';

// Patvirtinimo langas prieš trinant
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onClose }) {
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} title={title} kicker="Final cut" onClose={onClose} size="sm">
      <p className="confirm__message">{message}</p>
      <div className="form-actions">
        <button type="button" className="btn" onClick={onClose}>Keep it</button>
        <button type="button" className="btn btn--danger" onClick={handleConfirm} disabled={busy}>
          <Trash2 aria-hidden="true" /> {busy ? 'Cutting…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
