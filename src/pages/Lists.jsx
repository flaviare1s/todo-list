import toast from "react-hot-toast";
import { deleteList } from "../firebase/list";
import { Loader } from "../components/Loader";
import { getSharedTodos } from "../firebase/list";
import { useContext, useEffect, useState } from "react";
import { getUserTodos } from "../firebase/todo";
import { UserContext } from "../contexts/UserContext";

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
    const del = confirm("Are you sure you want to delete all todos?");
    if (del) {
      deleteList(user.uid)
        .then(() => {
          toast.success("All todos deleted!");
          setSharedTodos([]);
        })
        .catch(() => {
          toast.error("Failed to delete todos!");
        });
    }
  }

  useEffect(() => {
    listTodos();
  }, [user]);

  return (
    <section className="px-3">
      <div className="flex justify-between md:w-[40%] m-auto">
        <h2 className="text-2xl font-bold p-3 text-center mt-3 text-offwhite">
          Shared Lists
        </h2>
        <div className="flex flex-col justify-center items-center p-3">
          <button onClick={delList}>
            <div className="flex gap-2">
              <span className="text-offwhite hover:text-very_light_gray">Delete List</span>
              <span className="material-symbols-outlined hover:text-very_light_gray">
                close
              </span>
            </div>
          </button>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : sharedTodos.length > 0 ? (
        <div className="flex flex-col border-2 border-very_light_gray rounded mx-auto md:w-[40%]">
          {sharedTodos.map((todo) => (
            <div
              className="flex flex-col p-3 border-b border-very_light_gray"
              key={todo.id}
            >
              <p className="text-very_light_gray cursor-default">{todo.title}</p>
              <small className="text-very_light_gray text-right cursor-default">
                Shared by: {todo.sharedBy || "Unknown"}
              </small>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-very_light_gray cursor-pointer">
          <span className="material-symbols-outlined">receipt_long</span>
          <p>No shared lists</p>
        </div>
      )}
    </section>
  );
};
