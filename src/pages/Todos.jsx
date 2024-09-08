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
import { Controller, useForm } from "react-hook-form";
import { UserContext } from "../contexts/UserContext";
import { shareTodoWithEmail } from "../firebase/share";
import { Button, Modal } from "react-bootstrap";
import { getAuth } from "firebase/auth";

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
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedTodoInfo, setSelectedTodoInfo] = useState(null);
  const [todoInfo, setTodoInfo] = useState(null);
  const [selectedPermission, setSelectedPermission] = useState("");
  const [notifiedTodoIds, setNotifiedTodoIds] = useState(new Set());
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();
  const editInputRef = useRef(null);
  const shareInputRef = useRef(null);
  const user = useContext(UserContext);

  useEffect(() => {
    if (!user) return;

    const storedNotifiedTodoIds =
      JSON.parse(localStorage.getItem("notifiedTodoIds")) || [];
    const newNotifiedTodoIds = new Set(storedNotifiedTodoIds);

    const todosRef = collection(db, "todos");

    const unsubscribe = onSnapshot(
      todosRef,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const todo = change.doc.data();
          const todoId = change.doc.id;

          if (change.type === "added") {
            const isSharedWithUser = todo.sharedWith?.some(
              (shared) => shared.uid === user.uid
            );

            if (isSharedWithUser && !newNotifiedTodoIds.has(todoId)) {
              toast.success(`New task shared with you: ${todo.title}`);
              newNotifiedTodoIds.add(todoId);
            }
          } else if (change.type === "removed") {
            const wasNotified = newNotifiedTodoIds.has(todoId);

            if (wasNotified) {
              toast.error(`Task shared with you was removed: ${todo.title}`);
              newNotifiedTodoIds.delete(todoId);
            }
          } else if (change.type === "modified") {
            const isSharedWithUser = todo.sharedWith?.some(
              (shared) => shared.uid === user.uid
            );

            if (isSharedWithUser) {
              toast.success(`Task shared with you was updated: ${todo.title}`);
            }
          }
        });

        localStorage.setItem(
          "notifiedTodoIds",
          JSON.stringify([...newNotifiedTodoIds])
        );
        setNotifiedTodoIds([...newNotifiedTodoIds]);

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
    setSelectedPermission("");
    setShowShareModal(true);
  }

  async function handleShareTodo() {
    if (!shareEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!selectedPermission) {
      toast.error("Please select a permission.");
      return;
    }

    try {
      await shareTodoWithEmail(todoToShare, shareEmail, selectedPermission);
      toast.success("Todo shared successfully!");
      setShowShareModal(false);
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
    updateTodoStatus(id, newStatus, user)
      .then(() => {
        toast.success(`Todo marked as ${newStatus}!`);
      })
      .catch(() => {
        toast.error("You do not have permission to update this todo.");
      });
  }

  function removeTodo(id) {
    if (!user) {
      console.error("User is not defined.");
      return;
    }

    const del = confirm("Are you sure you want to delete this todo?");
    if (del) {
      deleteTodo(id, user)
        .then(() => {
          toast.success("Todo deleted!");
        })
        .catch((error) => {
          console.error("Error deleting todo:", error.message);
          toast.error("You do not have permission to delete this todo.");
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
      updateTodo(
        id,
        {
          title: editTitle,
          updatedAt: serverTimestamp(),
        },
        user
      )
        .then(() => {
          toast.success("Todo updated!");
        })
        .catch(() => {
          toast.error("You do not have permission to update this todo.");
        });
    }
    setIsEditing(null);
  }

  function handleKeyDown(e, id) {
    if (e.key === "Enter") {
      confirmEdit(id);
    }
  }

  function showInfo(todo) {
    setTodoInfo(todo);
    setShowInfoModal(true);
  }

  function handleInfoClick(todo) {
    setSelectedTodoInfo(todo);
    setShowInfoModal(true);
  }

  return (
    <section>
      <form
        className="flex flex-col justify-center items-center m-auto p-3"
        onSubmit={handleSubmit(createTodo)}
      >
        <h1
          onClick={handleSubmit(createTodo)}
          className="text-4xl font-bold p-3"
        >
          TODO
        </h1>
        <input
          type="text"
          id="title"
          placeholder="Click here to create a new todo"
          className="p-3 rounded-sm bg-inherit w-full sm:w-[60%] md:w-[50%] xl:w-[40%] placeholder:text-center placeholder:text-very_light_gray"
          {...register("title", { required: true })}
        />
      </form>
      <section className="px-3">
        <div className="w-full sm:w-[60%] md:w-[50%] xl:w-[40%]flex flex-col m-auto">
          <div className="flex justify-center">
            <h2 className="text-2xl font-bold p-3 text-center mt-3 mb-2">
              TODOS
            </h2>
          </div>
        </div>
        {sharedTodos.length > 0 ? (
          <div className="flex flex-col border-2 border-offwhite rounded mx-auto sm:w-[60%] md:w-[50%] xl:w-[40%]">
            {sharedTodos.map((todo) => (
              <div key={todo.id} className="p-3 border-b">
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-[-15px] sm:mb-0">
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
                    <div className="flex gap-3 sm:gap-1 ml-3 justify-end mt-4 sm:mt-0">
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
                      <button>
                        <span
                          onClick={() => showInfo(todo)}
                          className="material-symbols-outlined"
                        >
                          info
                        </span>
                      </button>
                      <button onClick={() => removeTodo(todo.id)}>
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    {user.uid !== todo.userId &&
                      todo.sharedWith.map((shared) => (
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
          <label htmlFor="permission" className="mt-2">
            Select Access Level:{" "}
          </label>
          <Controller
            name="permission"
            control={control}
            defaultValue=""
            rules={{ required: "Please choose a permission" }}
            render={({ field }) => (
              <select
                {...field}
                value={selectedPermission}
                onChange={(e) => setSelectedPermission(e.target.value)}
                className="form-control mt-2 select"
              >
                <option disabled value="">
                  Please select a permission
                </option>
                <option value="write">Write</option>
                <option value="read">Read</option>
              </select>
            )}
          />
          {!selectedPermission && errors.permission && (
            <small className="text-red-500">{errors.permission.message}</small>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="mt-2" variant="dark" onClick={handleShareTodo}>
            Share
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showInfoModal}
        onHide={() => setShowInfoModal(false)}
        className="text-center modalInfo"
      >
        <Modal.Header closeButton className="modalInfo-header">
          <Modal.Title className="text-dark modalInfo-title">Info</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-dark modalInfo-body">
          {todoInfo ? (
            <div key={todoInfo.id} className="text-left">
              <div className="mb-2">
                <span className="text-dark_gray mr-2 font-bold">
                  Created by:
                </span>
                <span className="text-offwhite font-bold text-lg">
                  {todoInfo.ownerName} - {todoInfo.ownerEmail}
                </span>
              </div>

              <div className="mb-2">
                <span className="text-dark_gray mr-2 font-bold">
                  Created At:
                </span>
                <span className="text-offwhite font-bold text-lg">
                  {todoInfo.createdAt
                    ? new Date(
                        todoInfo.createdAt.seconds * 1000
                      ).toLocaleString()
                    : "N/A"}
                </span>
              </div>
             
              {todoInfo.updatedBy && (
                <div className="mb-2">
                  <div className="mb-2">
                    <span className="text-dark_gray mr-2 font-bold">
                      Updated By:
                    </span>
                    <span className="text-offwhite font-bold text-lg">
                      {todoInfo.updatedBy.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-dark_gray mr-2 font-bold">
                      Updated At:
                    </span>
                    <span className="text-offwhite font-bold text-lg">
                      {todoInfo.updatedBy.timestamp
                        ? new Date(todoInfo.updatedBy.timestamp.seconds * 1000).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              )}

              <div className="mb-2">
                <span className="text-dark_gray mr-2 font-bold">Satus:</span>
                <span className="text-offwhite font-bold text-lg">
                  {todoInfo.status}
                </span>
              </div>

              {todoInfo.sharedWith &&
                todoInfo.sharedWith.map((shared) => (
                  <div key={shared.uid} className="mb-2">
                    <div>
                      <span className="text-dark_gray mr-2 font-bold">
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
                            ? "text-green font-bold"
                            : "text-yellow font-bold"
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
    </section>
  );
};
