/* eslint-disable react/prop-types */
import { Modal, Button } from "react-bootstrap";

export const ConfirmModal = ({ show, onClose, onConfirm, title, message }) => {
  return (
    <Modal show={show} onHide={onClose} className="text-center">
      <Modal.Header closeButton className="bg-[hsl(0,0%,10%)] text-[hsl(210,18%,96%)] border border-white/10">
        <Modal.Title className="text-[hsl(210,18%,96%)]">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-[hsl(0,0%,14%)] text-[hsl(210,18%,96%)] border border-white/10">
        {message}
      </Modal.Body>
      <Modal.Footer className="bg-[hsl(0,0%,10%)] border border-white/10">
        <Button
          className="bg-[hsl(210,14%,72%)] text-[hsl(0,0%,8%)] border-0 hover:bg-[hsl(210,14%,60%)]"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          className="bg-[hsl(0,100%,70%)] text-[hsl(0,0%,8%)] border-0 hover:bg-[hsl(0,100%,60%)]"
          onClick={onConfirm}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
