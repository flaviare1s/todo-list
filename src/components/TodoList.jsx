/* eslint-disable react/prop-types */
import { TodoItem } from './TodoItem';

export const TodoList = ({ todos, isEditing, editTitle, setEditTitle, startEditing, confirmEdit, showInfo, removeTodo, shareTodo, changeStatus, handleKeyDown }) => {
  return (
    <div className="flex flex-col border-2 border-text-muted rounded mx-auto sm:w-[60%] md:w-[50%] xl:w-[40%]">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isEditing={isEditing}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          startEditing={startEditing}
          confirmEdit={confirmEdit}
          showInfo={showInfo}
          removeTodo={removeTodo}
          shareTodo={shareTodo}
          changeStatus={changeStatus}
          handleKeyDown={handleKeyDown}
        />
      ))}
    </div>
  );
};
