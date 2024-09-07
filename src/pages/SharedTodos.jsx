import { useState, useEffect, useRef } from "react";
import { getSharedTodo } from "../firebase/share";
import { Loader } from "../components/Loader";
import { deleteTodo, updateTodo, updateTodoStatus } from "../firebase/todo";
import toast from "react-hot-toast";
import { serverTimestamp } from "firebase/firestore";

export const SharedTodos = () => {
  const [sharedTodos, setSharedTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const editInputRef = useRef(null);

  useEffect(() => {
    const fetchSharedTodos = async () => {
      try {
        const todos = await getSharedTodo();
        setSharedTodos(todos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedTodos();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        editInputRef.current &&
        !editInputRef.current.contains(event.target)
      ) {
        confirmEdit(isEditing);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, editTitle, originalTitle]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  function changeStatus(id, currentStatus) {
    const newStatus = currentStatus === "active" ? "completed" : "active";
    updateTodoStatus(id, newStatus)
      .then(() => {
        toast.success(`Todo marked as ${newStatus}!`);
        setSharedTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, status: newStatus } : todo
          )
        );
      })
      .catch(() => {
        toast.error("Failed to update todo!");
      });
  }

  function removeTodo(id) {
    const del = confirm("Are you sure you want to delete this todo?");
    if (del) {
      deleteTodo(id)
        .then(() => {
          toast.success("Todo deleted!");
          setSharedTodos((prevTodos) =>
            prevTodos.filter((todo) => todo.id !== id)
          );
        })
        .catch(() => {
          toast.error("Failed to delete todo!");
        });
    }
  }

  function startEditing(todo) {
    setIsEditing(todo.id);
    setOriginalTitle(todo.title);
    setEditTitle(todo.title);
  }

  function confirmEdit(id) {
    if (editTitle !== originalTitle) {
      updateTodo(id, {
        title: editTitle,
        updatedAt: serverTimestamp(),
      })
        .then(() => {
          toast.success("Todo updated!");
          setSharedTodos((prevTodos) =>
            prevTodos.map((todo) =>
              todo.id === id ? { ...todo, title: editTitle } : todo
            )
          );
        })
        .catch(() => {
          toast.error("Failed to update todo!");
        });
    }
    setIsEditing(null);
  }

  function handleKeyDown(e, id) {
    if (e.key === "Enter") {
      confirmEdit(id);
    }
  }

  return (
    <section className="px-3">
      <div className="w-full md:w-[40%] flex flex-col m-auto">
        <div className="flex justify-center">
          <h2 className="text-2xl font-bold p-3 text-center">Shared Todos</h2>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : sharedTodos.length > 0 ? (
        <div className="flex flex-col border-2 border-offwhite rounded mx-auto md:w-[40%]">
          {sharedTodos.map((todo) => (
            <div key={todo.id} className="p-3 border-b">
              <div>
                <div className="flex justify-between">
                  {isEditing === todo.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, todo.id)}
                      className="p-2 rounded focus:border-none-sm bg-inherit w-full"
                      ref={editInputRef}
                    />
                  ) : (
                    <p
                      onClick={() => changeStatus(todo.id, todo.status)}
                      className={`text-left cursor-pointer ${
                        todo.status === "completed"
                          ? "line-through text-gray-500"
                          : ""
                      }`}
                    >
                      {todo.title}
                    </p>
                  )}
                  <div className="flex gap-2">
                    {isEditing !== todo.id && (
                      <button onClick={() => startEditing(todo)}>
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    )}
                    <button onClick={() => removeTodo(todo.id)}>
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                </div>
                <small className="text-gray-500 flex justify-end">
                  Shared by: {todo.ownerName}
                </small>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-gray-500 cursor-pointer">
          <span className="material-symbols-outlined">receipt_long</span>
          <p>No todos</p>
        </div>
      )}
    </section>
  );
};
