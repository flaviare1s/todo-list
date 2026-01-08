import { ButtonIcon } from "./ButtonIcon";

/* eslint-disable react/prop-types */
export const MyTodosItem = ({
  todo,
  isEditing,
  editTitle,
  setEditTitle,
  startEditing,
  confirmEdit,
  removeTodo,
  shareTodo,
  changeStatus,
  editInputRef,
  handleKeyDown,
}) => {
  return (
    <div className="p-3 border-b" key={todo.id}>
      <div className="flex justify-between">
        {isEditing === todo.id ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, todo.id) && confirmEdit(todo.id)}
            className="p-2 rounded focus:border-none-sm bg-inherit w-full"
            ref={editInputRef}
          />
        ) : (
          <p
            onClick={() => changeStatus(todo.id, todo.status)}
            className={`text-left cursor-pointer ${todo.status === "completed"
              ? "line-through text-very_light_gray"
              : ""
              }`}
          >
            {todo.title}
          </p>
        )}
        <div className="flex gap-2">
          {isEditing !== todo.id && (
            <ButtonIcon onClick={startEditing} todo={todo} title="edit" />
          )}
          <ButtonIcon onClick={shareTodo} todo={todo.id} title="share" />
          <ButtonIcon onClick={removeTodo} todo={todo.id} title="close" />
        </div>
      </div>
      <div className="flex justify-end">
        {todo.sharedWith.length > 0 && (
          <div className="flex gap-2 items-center justify-center mt-2">
            <small className="text-[hsl(210,14%,72%)]">Shared</small>
            {todo.sharedWith.map((user, index) => (
              <div key={index}>
                {user.permission === "read" ? (
                  <span className="h-2 w-2 rounded-full block shared-read"></span>
                ) : (
                  <span className="h-2 w-2 rounded-full block shared-write"></span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
