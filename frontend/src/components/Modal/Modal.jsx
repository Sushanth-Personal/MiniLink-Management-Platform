import React from 'react';
import ReactDOM from 'react-dom';
import styles from './modal.module.css';

const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <img
              src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737653471/close_FILL0_wght400_GRAD0_opsz24_5_1_cunsre.png"
              alt="close"
            />
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
