/* eslint-disable react/prop-types */
import { Modal } from "react-bootstrap";
import { Loader } from "./Loader";

export const InfoModal = ({ title, show, onClose, todoInfo }) => {
  return (
    <Modal show={show} onHide={onClose} className="text-center">
      <Modal.Header closeButton className="modalInfo-header border border-white/10 shadow-lg">
        <Modal.Title className="text-dark modalInfo-title">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalInfo-body border border-white/10 shadow-lg">
        {todoInfo ? (
          <div key={todoInfo.id} className="text-left">
            <div className="mb-2">
              <span className="text-cyan mr-2 font-bold">Created by:</span>
              <span className="text-offwhite font-bold text-lg">
                {todoInfo.ownerName} - {todoInfo.ownerEmail}
              </span>
            </div>

            <div className="mb-2">
              <span className="text-cyan mr-2 font-bold">Created At:</span>
              <span className="text-offwhite font-bold text-lg">
                {todoInfo.createdAt
                  ? new Date(todoInfo.createdAt.seconds * 1000).toLocaleString()
                  : "N/A"}
              </span>
            </div>

            {todoInfo.updatedBy && (
              <div className="mb-2">
                <div className="mb-2">
                  <span className="text-cyan mr-2 font-bold">
                    Updated By:
                  </span>
                  <span className="text-offwhite font-bold text-lg">
                    {todoInfo.updatedBy.name}
                  </span>
                </div>
                <div>
                  <span className="text-cyan mr-2 font-bold">
                    Updated At:
                  </span>
                  <span className="text-offwhite font-bold text-lg">
                    {todoInfo.updatedBy.timestamp
                      ? new Date(
                        todoInfo.updatedBy.timestamp.seconds * 1000
                      ).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            )}

            <div className="mb-2">
              <span className="text-cyan mr-2 font-bold">Satus:</span>
              <span className="text-offwhite font-bold text-lg">
                {todoInfo.status}
              </span>
            </div>

            {todoInfo.sharedWith &&
              todoInfo.sharedWith.map((shared) => (
                <div key={shared.uid} className="mb-2">
                  <div>
                    <span className="text-cyan mr-2 font-bold">
                      Shared With:{" "}
                    </span>
                    <span className="text-offwhite font-bold text-lg">
                      {shared.displayName} - {shared.email}
                    </span>
                  </div>
                  <div>
                    <span
                      className={
                        shared.permission === "write"
                          ? "text-cyan font-bold"
                          : "text-pink font-bold"
                      }
                    >
                      {shared.permission === "write" ? "Write" : "Read only"}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <Loader />
        )}
      </Modal.Body>
    </Modal>
  );
};
