
// Higher-Order Component to pass dynamic content
const CreateNewModal = (WrappedComponent) => {
  return function ModalContent({ modalType, ...props }) {
    let content = null;
    
    // Render content based on the modalType prop
    if (modalType === 'createNew') {
      content = (
        <div>
          <nav>
            <h1>New Link</h1>
            <button
            className = {styles.modalClose}
            onClick={props.onClose}>
                <img src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737653471/close_FILL0_wght400_GRAD0_opsz24_5_1_cunsre.png" alt="close" />
            </button>
          </nav>
          {/* Custom content for creating new item */}
          
        </div>
      );
    } else if (modalType === 'edit') {
      content = (
        <div>
          <p>This is an edit modal!</p>
          {/* Custom content for editing item */}
          <button onClick={props.onClose}>Close</button>
        </div>
      );
    }
    
    // Pass the content to the wrapped Modal component
    return <WrappedComponent {...props}>{content}</WrappedComponent>;
  };
};

export default CreateNewModal;
