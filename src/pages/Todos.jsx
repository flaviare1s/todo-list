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
import { deleteList, getSharedTodos, shareTodosWithEmail } from "../firebase/list";
import { Modal, Button } from "react-bootstrap";
import { serverTimestamp } from "firebase/firestore";

export const Todos = () => {
  const { register, handleSubmit, reset } = useForm();
  const [todos, setTodos] = useState([]);
  const [sharedTodos, setSharedTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const editInputRef = useRef(null);

  function listTodos() {
    if (user?.uid) {
      setLoading(true);

      const userTodosPromise = getUserTodos(user.uid);
      const sharedTodosPromise = getSharedTodos(user.uid);

      Promise.all([userTodosPromise, sharedTodosPromise])
        .then(([userTodos, sharedTodos]) => {
          setTodos(userTodos);
          setSharedTodos(sharedTodos.flatMap(todoList => todoList.todos));
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load todos!");
          setLoading(false);
        });
    }
  }

  function createTodo(data, sharedWith = []) {
    const todoData = {
      ...data,
      status: "active",
      userId: user.uid,
      sharedWith: sharedWith.length > 0 ? sharedWith.map(user => ({
        uid: user.uid || '',
        permission: user.permission || 'read',
      })) : [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
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
      updateTodo(id, { 
        title: editTitle,
        updatedAt: serverTimestamp(),
      })
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
      deleteTodo(id)
        .then(() => {
          toast.success("Todo deleted!");
          listTodos();
        })
        .catch(() => {
          toast.error("Failed to delete todo!");
        });
    }
  }

  function delList() {
    const del = confirm("Are you sure you want to delete all todos?");
    if (del) {
      deleteList(user.uid)
        .then(() => {
          toast.success("All todos deleted!");
          listTodos();
        })
        .catch(() => {
          toast.error("Failed to delete todos!");
        });
    }
  }


  function openShareModal() {
    setShowModal(true);
  }

  function closeShareModal() {
    setShowModal(false);
    setShareEmail("");
  }

  async function handleShareTodos() {
    if (user?.uid) {
      try {
        const result = await shareTodosWithEmail(user.uid, todos, shareEmail);
        if (result) {
          toast.success("Todos shared with email!");
        }
        closeShareModal();
      } catch (error) {
        if (error.message === "User not found") {
          toast.error("E-mail not found!");
        } else {
          toast.error("Failed to share todos!");
        }
      }
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
        <div className="w-full md:w-[40%] flex flex-col m-auto">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold p-3 text-center">My Todos</h2>
            <button onClick={openShareModal} className="py-3 px-2 flex items-center justify-center gap-2">
              <span>Share List</span><span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
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
                    className={`text-left cursor-pointer ${todo.status === "completed" ? "line-through text-gray-500" : ""}`}
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
                  <button>
                    <span className="material-symbols-outlined">share</span>
                  </button>
                  <button onClick={() => removeTodo(todo.id)}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center text-gray-500 cursor-pointer" onClick={handleSubmit(createTodo)}>
            <span className="material-symbols-outlined">receipt_long</span>
            <p>No todos</p>
          </div>
        )}
      </section>

      <section className="px-3">
        <div className="flex justify-between md:w-[40%] m-auto">
          <h2 className="text-2xl font-bold p-3 text-center mt-3 text-gray-500">Shared Todos</h2>
          <div className="flex flex-col justify-center items-center p-3">
            <button onClick={delList}>
              <div className="flex gap-2">
                <span>Delete List</span>
                <span className="material-symbols-outlined hover:text-gray-500">close</span>
              </div>
            </button>
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : sharedTodos.length > 0 ? (
          <div className="flex flex-col border-2 border-gray-500 rounded mx-auto md:w-[40%]">
            {sharedTodos.map((todo) => (
              <div className="flex flex-col p-3 border-b border-gray-500" key={todo.id}>
                <p className="text-gray-500 cursor-default">{todo.title}</p>
                <small className="text-gray-500 text-right cursor-default">Shared by: {todo.sharedBy || "Unknown"}</small>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center text-gray-500 cursor-pointer" onClick={openShareModal}>
            <span className="material-symbols-outlined">receipt_long</span>
            <p>No shared todos</p>
          </div>
        )}
      </section>

      <Modal show={showModal} onHide={closeShareModal}>
        <Modal.Header closeButton>
          <Modal.Title className="text-dark">Share Todos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-3 p-2">
            <input
              type="email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              placeholder="Recipient email"
              className="p-2 rounded w-full text-dark"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeShareModal}>
            Close
          </Button>
          <Button variant="dark" onClick={handleShareTodos}>
            Share
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
