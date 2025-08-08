import React from 'react';

function Modal({ children, onClose, isOpen = false }) {
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
        className="modal-content-centered"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </>
  );
}

export default Modal;