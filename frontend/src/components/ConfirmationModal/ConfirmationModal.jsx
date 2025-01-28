import styles from "./ConfirmationModal.module.css";
import { useUserContext } from "../../Contexts/UserContext";
const ConfirmationModal = (WrappedComponent) => {
  return function ModalContent({ modalType, ...props }) {
    const { setDeleteAccount } = useUserContext();
    let content = null;

    if (modalType === "deleteAccount") {
      content = (
        <>
          <div className={styles.content}>
            <h1>Are you sure you want to delete your account?</h1>
            <div className={styles.buttonContainer}>
              <button
                onClick={() => setDeleteAccount(false)}
                className={styles.No}
              >
                No
              </button>
              <button
                onClick={() => setDeleteAccount(true)}
                className={styles.Yes}
              >
                Yes
              </button>
            </div>
          </div>
        </>
      );
    } else if (modalType === "deleteUrl") {
      content = (
        <>
          <div className={styles.content}>
            <h1>Are you sure, you want to remove it?</h1>
            <div className={styles.buttonContainer}>
              <button>No</button>
              <button>Yes</button>
            </div>
          </div>
        </>
      );
    }

    return <WrappedComponent {...props}>{content}</WrappedComponent>;
  };
};

export default ConfirmationModal;
