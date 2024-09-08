/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useContext } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { Loader } from "../components/Loader";
import {
  addTodo,
  deleteTodo,
  updateTodo,
  updateTodoStatus,
} from "../firebase/todo";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { UserContext } from "../contexts/UserContext";
import { shareTodoWithEmail } from "../firebase/share";
import { Button, Modal } from "react-bootstrap";

const db = getFirestore();

export const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [sharedTodos, setSharedTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [todoToShare, setTodoToShare] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const editInputRef = useRef(null);
  const shareInputRef = useRef(null);
  const user = useContext(UserContext);

  useEffect(() => {
    if (!user) return;

    const todosRef = collection(db, "todos");

    const unsubscribe = onSnapshot(
      todosRef,
      (snapshot) => {
        const todos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredTodos = todos.filter((todo) => {
          const isOwner = todo.userId === user.uid;
          const isSharedWithUser = todo.sharedWith?.some(
            (shared) => shared.uid === user.uid
          );
          return isOwner || isSharedWithUser;
        });

        setSharedTodos(filteredTodos);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
    <section>
      <form
        className="flex flex-col justify-center items-center m-auto p-3"
        onSubmit={handleSubmit(createTodo)}
      >
        <h1 className="text-4xl font-bold p-3">TODO</h1>
        <input
          type="text"
          id="title"
          placeholder="Click here to create a new todo"
          className="p-3 rounded-sm bg-inherit w-full md:w-[40%] sm:w-[60%] placeholder:text-center placeholder:text-very_light_gray"
          {...register("title", { required: true })}
        />
      </form>
      <section className="px-3">
        <div className="w-full md:w-[40%] flex flex-col m-auto">
          <div className="flex justify-center">
            <h2 className="text-2xl font-bold p-3 text-center mt-3 mb-2">
              TODOS
            </h2>
          </div>
        </div>
        {sharedTodos.length > 0 ? (
          <div className="flex flex-col border-2 border-offwhite rounded mx-auto md:w-[40%] sm:w-[60%] sm:w-[60%]">
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
                        <button onClick={() => startEditing(todo)}>
                          <span className="material-symbols-outlined">
                            edit
                          </span>
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
                    <span className="text-very_light_gray text-xs mr-1">
                      Created by:
                    </span>
                    <span className="text-yellow text-xs">
                      {" "}
                      {todo.ownerName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center text-very_light_gray cursor-pointer">
            <span className="material-symbols-outlined">receipt_long</span>
            <p>No todos</p>
          </div>
        )}
      </section>

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
    </section>
  );
};
