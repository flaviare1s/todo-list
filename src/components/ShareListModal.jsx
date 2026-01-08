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
      <Modal.Header closeButton className="bg-[hsl(0,0%,12%)] text-[hsl(210,18%,96%)] border border-white/10">
        <Modal.Title className="text-[hsl(210,18%,96%)]">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-[hsl(0,0%,8%)] text-[hsl(210,18%,96%)] border border-white/10">
        <input
          type="email"
          value={shareEmail}
          onChange={(e) => setShareEmail(e.target.value)}
          placeholder="Enter email address"
          className="form-control bg-[hsl(0,0%,12%)] text-[hsl(210,18%,96%)] border-[hsl(210,14%,72%)] placeholder:text-[hsl(210,14%,72%)]"
        />
        <Button className="mt-2 bg-[hsl(180,100%,60%)] text-[hsl(0,0%,8%)] hover:text-[hsl(0,0%,8%)] border-0 hover:bg-[hsl(180,100%,80%)]" onClick={handleShareTodos}>
          Share
        </Button>
      </Modal.Body>
    </Modal>
  );
};
