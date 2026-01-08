/* eslint-disable react/prop-types */
import { Modal, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";

export const ShareModal = ({
  title,
  show,
  onClose,
  shareEmail,
  setShareEmail,
  selectedPermission,
  setSelectedPermission,
  handleShareTodo,
}) => {
  const {
    control,
    formState: { errors },
  } = useForm();
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
              className="form-control mt-2 select bg-[hsl(0,0%,12%)] text-[hsl(210,18%,96%)] border-[hsl(210,14%,72%)]"
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
      <Modal.Footer className="bg-[hsl(0,0%,12%)] border border-white/10">
        <Button className="mt-2 bg-[hsl(180,100%,60%)] text-[hsl(0,0%,8%)] hover:text-[hsl(0,0%,8%)] border-0 hover:bg-[hsl(180,100%,80%)]" onClick={handleShareTodo}>
          Share
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
