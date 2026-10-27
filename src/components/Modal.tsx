import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  id: string;
  className?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, id, className = '', children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = previous; if (dialog.open) dialog.close(); };
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return <dialog ref={ref} className={`modal ${className}`} aria-labelledby={`${id}-title`} onCancel={onClose}
    onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); onClose(); } }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="modal-inner">
      <div className="modal-heading"><h2 id={`${id}-title`}>{title}</h2><button className="icon-button" onClick={onClose} aria-label={`Cerrar ${title.toLowerCase()}`}><X size={23} /></button></div>
      {children}
    </div>
  </dialog>;
}
