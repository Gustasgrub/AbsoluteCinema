import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/*
 * Modalinis langas su "klaketės" (clapperboard) antrašte.
 * Uždaromas: Esc klavišu, paspaudus už lango ribų arba X mygtuku.
 */
export default function Modal({ open, title, kicker = 'Scene', onClose, children, size = 'md' }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Visada turime naujausią onClose funkciją, bet efektas žemiau nepasileidžia iš naujo kiekvieno render metu
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const onKeyDown = (event) => event.key === 'Escape' && onCloseRef.current();

    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('no-scroll');
    // Fokusas į pirmą formos lauką – patogu klaviatūrai
    dialogRef.current?.querySelector('input:not([type="hidden"]), textarea, select')?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('no-scroll');
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div ref={dialogRef} className={`modal modal--${size}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="clapper" aria-hidden="true">
          <span className="clapper__stick" />
          <span className="clapper__base" />
        </div>
        <div className="modal__head">
          <div>
            <p className="eyebrow">{kicker}</p>
            <h2 id="modal-title" className="modal__title">{title}</h2>
          </div>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
