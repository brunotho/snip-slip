import React from 'react';

function Modal({ children, onClose, isOpen = false, contentClassName = "modal-content-centered" }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop"
        onClick={onClose}
      />
      {/* Modal Content */}
      <div
        className={contentClassName}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </>
  );
}

export default Modal;