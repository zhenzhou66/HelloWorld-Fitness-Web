import React from "react";
import PropTypes from "prop-types";
import { X, Trash } from "lucide-react";
import styles from "./ConfirmDelete.module.css"; // or another appropriate CSS module if you prefer

export default function ConfirmModal({
  show,
  onClose,
  onConfirm,
  message,
  confirmText,
  cancelText,
}) {
  if (!show) return null;
  
  return (
    <div className={styles.modalOverlayDeleteM}>
      <div className={styles.modalDeleteM} style={{ textAlign: "center" }}>

        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>
        <Trash className={styles.deleteIcon} size={40} />

        <p style={{ marginBottom: "30px" }}>{message}</p>

        <div className={styles.modalButtons}>
          <button className={styles.cancelDeleteButton} onClick={onClose}>
            {cancelText || "No, cancel"}
          </button>
          <button className={styles.confirmDeleteButton} onClick={onConfirm}>
            {confirmText || "Yes, I'm sure"}
          </button>
        </div>
        
      </div>
    </div>
  );
}

ConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};