import toast from "react-hot-toast";
import { deleteList } from "../firebase/list";
import { Loader } from "../components/Loader";
import { getSharedTodos } from "../firebase/list";
import { useContext, useEffect, useState } from "react";
import { getUserTodos } from "../firebase/todo";
import { UserContext } from "../contexts/UserContext";
import { NoTodos } from "../components/NoTodos";
import { ListsHeader } from "../components/ListsHeader";
import { ListsList } from "../components/ListsList";

export const Lists = () => {
  const [sharedTodos, setSharedTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useContext(UserContext);

  function listTodos() {
    if (user?.uid) {
      setLoading(true);
      const userTodosPromise = getUserTodos(user.uid);
      const sharedTodosPromise = getSharedTodos(user.uid);

      Promise.all([userTodosPromise, sharedTodosPromise])
        .then(([userTodos, sharedTodosLists]) => {
          console.log(userTodos, sharedTodosLists);
          setSharedTodos(
            sharedTodosLists.flatMap((todoList) => todoList.todos)
          );
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load todos!");
          setLoading(false);
        });
    }
  }

  function delList() {
    setShowConfirmModal(true);
  }

  function confirmDeleteList() {
    deleteList(user.uid)
      .then(() => {
        toast.success("All todos deleted!");
        setSharedTodos([]);
      })
      .catch(() => {
        toast.error("Failed to delete todos!");
      });
    setShowConfirmModal(false);
  }

  useEffect(() => {
    listTodos();
  }, [user]);

  return (
    <section className="px-3">
      <ListsHeader tiltle="Shared Lists" delList={delList} />
      {loading ? (
        <Loader />
      ) : sharedTodos.length > 0 ? (
        <ListsList sharedTodos={sharedTodos} />
      ) : (
        <NoTodos title="No shared lists" />
      )}
      <ConfirmModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDeleteList}
        title="Delete All Todos"
        message="Are you sure you want to delete all todos?"
      />
    </section>
  );
};
