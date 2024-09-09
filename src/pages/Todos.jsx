/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useContext } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { Loader } from "../components/Loader";
import { deleteTodo, updateTodo, updateTodoStatus } from "../firebase/todo";
import toast from "react-hot-toast";
import { UserContext } from "../contexts/UserContext";
import { shareTodoWithEmail } from "../firebase/share";
import { ShareModal } from "../components/ShareModal";
import { InfoModal } from "../components/InfoModal";
import { NewTodo } from "../components/NewTodo";
import { TodoHeader } from "../components/TodoHeader";
import { TodoList } from "../components/TodoList";
import { NoTodos } from "../components/NoTodos";

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
              toast.success(`Task shared with you was removed: ${todo.title}`);
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
      <NewTodo title="TODO" setTodos={setTodos} />
      <TodoHeader title="TODOS" />
      {sharedTodos.length > 0 ? (
        <TodoList
          todos={sharedTodos}
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
      ) : (
        <NoTodos />
      )}
      <ShareModal
        title="Share Todo"
        show={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareEmail={shareEmail}
        setShareEmail={setShareEmail}
        selectedPermission={selectedPermission}
        setSelectedPermission={setSelectedPermission}
        handleShareTodo={handleShareTodo}
      />
      <InfoModal
        title="Info"
        show={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        todoInfo={todoInfo}
      />
    </section>
  );
};
