import React from 'react';
import ReactDOM from 'react-dom';
import styles from './modal.module.css';

const Modal = ({ show, onClose, title, children, headerStyle, closeButtonStyle,windowStyle}) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}
      style={windowStyle}>
        <div 
        className={styles.modalHeader}
        style = {headerStyle}
        >
          <h2>{title}</h2>
          <button onClick={onClose} 
          style={closeButtonStyle}
          className={styles.closeButton}>
            X
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
