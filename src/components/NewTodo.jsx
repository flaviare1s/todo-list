/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { addTodo } from "../firebase/todo";
import toast from "react-hot-toast";
import { serverTimestamp } from "firebase/firestore";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export const NewTodo = ({ title, setTodos }) => {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm();
  const user = useContext(UserContext);

  const createTodo = (data, sharedWith = []) => {
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
  };

  return (
    <form
      className="flex flex-col justify-center items-center m-auto p-3"
      onSubmit={handleSubmit(createTodo)}
    >
      <h1
        onClick={handleSubmit(createTodo)}
        className="text-4xl font-bold p-3 text-primary-dark"
      >
        {title}
      </h1>
      <input
        type="text"
        id="title"
        placeholder="Click here to create a new todo"
        className="p-3 rounded-md bg-inherit w-full sm:w-[60%] md:w-[50%] xl:w-[40%] placeholder:text-center placeholder:text-text-muted border-2 !border-primary-dark"
        {...register("title", { required: true })}
      />
    </form>
  );
};
