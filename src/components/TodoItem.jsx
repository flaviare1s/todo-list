/* eslint-disable no-undef */

import { ButtonIcon } from "./ButtonIcon";

/* eslint-disable react/prop-types */
export const TodoItem = ({
  todo,
  isEditing,
  editTitle,
  setEditTitle,
  startEditing,
  confirmEdit,
  showInfo,
  removeTodo,
  shareTodo,
  changeStatus,
  handleKeyDown,
}) => {
  return (
    <div className="p-3 border-b">
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between mb-[-15px] sm:mb-0">
          {isEditing === todo.id ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) =>
                handleKeyDown(e, todo.id) && confirmEdit(todo.id)
              }
              className="p-2 rounded focus:border-none-sm bg-inherit w-full"
            />
          ) : (
            <p
              onClick={() => changeStatus(todo.id, todo.status)}
              className={`text-left cursor-pointer ${
                todo.status === "completed"
                  ? "line-through text-very_light_gray"
                  : ""
              }`}
            >
              {todo.title}
            </p>
          )}
          <div className="flex gap-3 sm:gap-1 ml-3 justify-end mt-4 sm:mt-0">
            {isEditing !== todo.id && (
              <ButtonIcon onClick={startEditing} todo={todo} title="edit" />
            )}
            <ButtonIcon onClick={shareTodo} todo={todo.id} title="share" />
            <ButtonIcon onClick={showInfo} todo={todo} title="info" />
            <ButtonIcon onClick={removeTodo} todo={todo.id} title="close" />
          </div>
        </div>
        <div className="flex justify-end">
          {todo.sharedWith.map((shared) => (
            <span
              key={shared.uid}
              className={
                shared.permission === "write"
                  ? "h-2 w-2 bg-green rounded mb-[-10px] mr-[-10px]"
                  : "h-2 w-2 bg-yellow rounded mb-[-10px] mr-[-10px]"
              }
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};
