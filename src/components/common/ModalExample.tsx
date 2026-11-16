
import Modal from "./Modal/Modal";
import useModal from "../../hooks/useModal";

const ModalExample = () => {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div>
      <button type="button" onClick={openModal}>
        Open Modal
      </button>

      <Modal isOpen={isOpen} onClose={closeModal} size="medium">
        <Modal.Header>
          <h2>Ticket Details</h2>
        </Modal.Header>

        <Modal.Body>
          <p>This is a reusable compound modal.</p>
          <p>Header, Body and Footer are separate components.</p>
        </Modal.Body>

        <Modal.Footer>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>

          <button type="button" onClick={closeModal}>
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalExample;
