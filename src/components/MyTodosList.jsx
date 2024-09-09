/* eslint-disable react/prop-types */
import { MyTodosItem } from './MyTodosItem';

export const MyTodosList = ({ todos, isEditing, editTitle, setEditTitle, startEditing, confirmEdit, removeTodo, shareTodo, changeStatus, editInputRef, handleKeyDown }) => {
  return (
    <div className="flex flex-col border-2 border-offwhite rounded mx-auto sm:w-[60%] md:w-[50%] xl:w-[40%]">
      {todos.map((todo) => (
        <MyTodosItem
          key={todo.id}
          todo={todo}
          isEditing={isEditing}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          startEditing={startEditing}
          confirmEdit={confirmEdit}
          removeTodo={removeTodo}
          shareTodo={shareTodo}
          changeStatus={changeStatus}
          editInputRef={editInputRef}
          handleKeyDown={handleKeyDown}
        />
      ))}
    </div>
  );
};
