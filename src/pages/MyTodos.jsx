import {
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
import { onSnapshot, serverTimestamp } from "firebase/firestore";
import { shareTodoWithEmail } from "../firebase/share";
import { shareTodosWithEmail } from "../firebase/list";
import { ShareModal } from "../components/ShareModal";
import { ShareListModal } from "../components/ShareListModal";
import { NewTodo } from "../components/NewTodo";
import { NoTodos } from "../components/NoTodos";
import { TodoList } from "../components/TodoList";

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
  const [selectedPermission, setSelectedPermission] = useState("");
  const editInputRef = useRef(null);
  const shareInputRef = useRef(null);
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
      const isInteractingWithSelect = event.target.closest("select") !== null;
      if (
        shareInputRef.current &&
        !shareInputRef.current.contains(event.target) &&
        !isInteractingWithSelect
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
      <NewTodo title="TODO" setTodos={setTodos} />
      <section className="px-3">
        <div className="w-full sm:w-[60%] md:w-[50%] xl:w-[40%] flex flex-col m-auto">
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
          <TodoList
            todos={todos}
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
        ) : (
          <NoTodos />
        )}
      </section>

      <ShareListModal
        title="Share List"
        show={showModal}
        onClose={closeShareModal}
        shareEmail={shareEmail}
        setShareEmail={setShareEmail}
        handleShareTodos={handleShareTodos}
      />

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
    </>
  );
};
