import { Modal, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";

export const ShareModal = ({title, show, onClose, shareEmail, setShareEmail, selectedPermission, setSelectedPermission, handleShareTodo }) => {
  
  const { control, formState: { errors } } = useForm();
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
          // ref={shareInputRef}
        />
        <label htmlFor="permission" className="mt-2">
          Select Access Level:{" "}
        </label>
        <Controller
          name="permission"
          control={control}
          defaultValue=""
          rules={{ required: "Please choose a permission" }}
          render={({ field }) => (
            <select
              {...field}
              value={selectedPermission}
              onChange={(e) => setSelectedPermission(e.target.value)}
              className="form-control mt-2 select"
            >
              <option disabled value="">
                Please select a permission
              </option>
              <option value="write">Write</option>
              <option value="read">Read</option>
            </select>
          )}
        />
        {!selectedPermission && errors.permission && (
          <small className="text-red-500">{errors.permission.message}</small>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className="mt-2" variant="dark" onClick={handleShareTodo}>
          Share
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
