/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import {
  addTodo,
  deleteTodo,
  getUserTodos,
  getUserTodosQuery,
  updateTodo,
  updateTodoStatus,
} from "../firebase/todo";
import toast from "react-hot-toast";
import { useEffect, useState, useRef, useContext } from "react";
import { Loader } from "../components/Loader";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { onSnapshot, serverTimestamp } from "firebase/firestore";
import { shareTodoWithEmail } from "../firebase/share";
import { shareTodosWithEmail } from "../firebase/list";

export const MyTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [todoToShare, setTodoToShare] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const editInputRef = useRef(null);
  const shareInputRef = useRef(null);
  const { register, handleSubmit, reset } = useForm();
  const user = useContext(UserContext);
  const navigate = useNavigate();

  function listTodos() {
    if (user?.uid) {
      setLoading(true);
      getUserTodos(user.uid)
        .then((userTodos) => {
          setTodos(userTodos);
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
      ownerEmail: user.email,
      ownerName: user.displayName,
      sharedWith:
        sharedWith.length > 0
          ? sharedWith.map((user) => ({
              uid: user.uid || "",
              permission: user.permission || "read",
              email: user.email || "",
              displayName: user.displayName || "",
            }))
          : [],
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
      e.preventDefault();
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
      const todosQuery = getUserTodosQuery(user.uid);
      const unsubscribe = onSnapshot(
        todosQuery,
        (snapshot) => {
          const userTodos = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTodos(userTodos);
          setLoading(false);
        },
        (error) => {
          toast.error("Failed to load todos!", error);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    }
  }, [user]);

  function shareTodo(todoId) {
    setTodoToShare(todoId);
    setShareEmail("");
    setShowShareModal(true);
  }

  async function handleShareTodo() {
    if (!shareEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      await shareTodoWithEmail(todoToShare, shareEmail, "write");
      toast.success("Todo shared successfully!");
    } catch (error) {
      toast.error(`Failed to share todo: ${error.message}`);
    }

    setShowShareModal(false);
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
      if (
        shareInputRef.current &&
        !shareInputRef.current.contains(event.target)
      ) {
        setShowShareModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, editTitle, originalTitle, shareEmail]);

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
          className="p-3 rounded-sm bg-inherit w-full md:w-[40%] placeholder:text-center placeholder:text-very_light_gray"
          {...register("title", { required: true })}
        />
      </form>

      <section className="px-3">
        <div className="w-full md:w-[40%] flex flex-col m-auto">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold p-3 text-center">My Todos</h2>
            <button
              onClick={openShareModal}
              className="py-3 px-2 flex items-center justify-center gap-2"
            >
              <span>Share List</span>
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : todos.length > 0 ? (
          <div className="flex flex-col border-2 border-offwhite rounded mx-auto md:w-[40%]">
            {todos.map((todo) => (
              <div className="p-3 border-b" key={todo.id}>
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
                          ? "line-through text-very_light_gray"
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
                    <button onClick={() => shareTodo(todo.id)}>
                      <span className="material-symbols-outlined">share</span>
                    </button>
                    <button onClick={() => removeTodo(todo.id)}>
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  {todo.sharedWith.length > 0 && (
                    <div className="flex gap-2 items-center justify-center mt-2">
                      <small className="text-light">Shared</small>
                      <span className="h-2 w-2 bg-green rounded-full block"></span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col justify-center items-center text-very_light_gray cursor-pointer"
            onClick={handleSubmit(createTodo)}
          >
            <span className="material-symbols-outlined">receipt_long</span>
            <p>No todos</p>
          </div>
        )}
      </section>

      <Modal show={showModal} onHide={closeShareModal} className="text-center">
        <Modal.Header closeButton>
          <Modal.Title className="text-dark">Share Todos</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-dark">
          <input
            type="email"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            placeholder="Enter email address"
            className="form-control"
          />
          <Button className="mt-2" variant="dark" onClick={handleShareTodos}>
            Share
          </Button>
        </Modal.Body>
      </Modal>

      <Modal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        className="text-center"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-dark">Share Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-dark">
          <input
            type="email"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            placeholder="Enter email address"
            className="form-control"
            ref={shareInputRef}
          />
          <Button className="mt-2" variant="dark" onClick={handleShareTodo}>
            Share
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};
