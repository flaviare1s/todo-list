/* eslint-disable react/prop-types */
import { Modal, Button } from "react-bootstrap";

export const ShareListModal = ({
  title,
  show,
  onClose,
  shareEmail,
  setShareEmail,
  handleShareTodos
}) => {
  return (
    <Modal show={show} onHide={onClose} className="text-center">
      <Modal.Header closeButton>
        <Modal.Title className="text-dark">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-dark">
        <input
          type="email"
          value={shareEmail}
          onChange={(e) => setShareEmail(e.target.value)}
          placeholder="Enter email address"
          className="form-control"
        />
        <Button className="mt-2" variant="dark" onClick={handleShareTodos}>
          Share
        </Button>
      </Modal.Body>
    </Modal>
  );
};
