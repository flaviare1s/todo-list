import { useForm } from "react-hook-form";
import {
  addTodo,
  deleteTodo,
  getUserTodos,
  updateTodo,
  updateTodoStatus,
} from "../firebase/todo";
import toast from "react-hot-toast";
import { useEffect, useState, useRef, useContext } from "react";
import { Loader } from "../components/Loader";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export const Todos = () => {
  const { register, handleSubmit, reset } = useForm();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const editInputRef = useRef(null);

  function listTodos() {
    if (user?.uid) {
      setLoading(true);
      getUserTodos(user.uid)
        .then((res) => {
          setTodos(res);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load todos!");
          setLoading(false);
        });
    }
  }

  function createTodo(data) {
    const todoData = {
      ...data,
      status: "active",
      userId: user.uid,
    };

    setTodos((prevTodos) => [
      ...prevTodos,
      { ...todoData, id: Date.now().toString() },
    ]);

    addTodo(todoData)
      .then(() => {
        toast.success("Todo created!");
        listTodos();
      })
      .catch(() => {
        toast.error("Something went wrong!");
      });
    reset();
  }

  function changeStatus(id, currentStatus) {
    const newStatus = currentStatus === "active" ? "completed" : "active";
    updateTodoStatus(id, newStatus)
      .then(() => {
        toast.success(`Todo marked as ${newStatus}!`);
        listTodos();
      })
      .catch(() => {
        toast.error("Failed to update todo!");
      });
  }

  function startEditing(todo) {
    setIsEditing(todo.id);
    setOriginalTitle(todo.title);
    setEditTitle(todo.title);
  }

  function confirmEdit(id) {
    if (editTitle !== originalTitle) {
      updateTodo(id, { title: editTitle })
        .then(() => {
          toast.success("Todo updated!");
          listTodos();
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

  function removeTodo(id) {
    const del = confirm("Are you sure you want to delete this todo?");
    if (del) {
      deleteTodo(id).then(() => {
        toast.success("Todo deleted!");
        listTodos();
      });
    }
  }

  useEffect(() => {
    if (user?.uid) {
      listTodos();
    }
  }, [user]);

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

  if (user === null) {
    navigate("/login");
  }

  return (
    <>
      <form
        className="flex flex-col justify-center items-center m-auto p-3"
        onSubmit={handleSubmit(createTodo)}
      >
        <h1 className="text-4xl font-bold p-3">TODO</h1>
        <input
          type="text"
          id="title"
          placeholder="Click here to create a new todo"
          className="p-3 rounded-sm bg-inherit w-full md:w-[40%] placeholder:text-center"
          {...register("title", { required: true })}
        />
      </form>
      <section className="px-3">
        {loading ? (
          <Loader />
        ) : todos.length > 0 ? (
          <div className="flex flex-col border-2 border-offwhite rounded mx-auto md:w-[40%]">
            {todos.map((todo) => (
              <div className="flex justify-between p-3 border-b" key={todo.id}>
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
                      todo.status === "completed" ? "line-through" : ""
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
            ))}
          </div>
        ) : (
          ""
        )}
      </section>
    </>
  );
};
