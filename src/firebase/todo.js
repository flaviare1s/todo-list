import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";

export const todosCol = collection(db, "todos");

export async function addTodo(data) {
  await addDoc(todosCol, data);
}

export async function getUserTodos(userId) {
  const filter = query(todosCol, where("userId", "==", userId));
  const snapshot = await getDocs(filter);
  const todos = [];

  snapshot.forEach((doc) => {
    todos.push({ ...doc.data(), id: doc.id });
  });
  return todos;
}

export function getUserTodosQuery(userId) {
  return query(todosCol, where("userId", "==", userId));
}

export async function updateTodoStatus(id, status, user) {
  try {
    const todoDoc = doc(todosCol, id);

    const todoSnapshot = await getDoc(todoDoc);
    if (!todoSnapshot.exists()) {
      throw new Error("Todo not found.");
    }

    const todoData = todoSnapshot.data();
    if (
      todoData.userId !== user.uid &&
      !todoData.sharedWith.some(
        (shared) => shared.uid === user.uid && shared.permission === "write"
      )
    ) {
      throw new Error("You do not have permission to update this todo.");
    }

    await updateDoc(todoDoc, {
      status,
      updatedBy: {
        name: user.displayName,
        email: user.email,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating todo:", error.message);
    throw error;
  }
}

export async function updateTodo(id, data, user) {
  try {
    const todoDoc = doc(todosCol, id);

    const todoSnapshot = await getDoc(todoDoc);
    if (!todoSnapshot.exists()) {
      throw new Error("Todo not found.");
    }

    const todoData = todoSnapshot.data();
    if (
      todoData.userId !== user.uid &&
      !todoData.sharedWith.some(
        (shared) => shared.uid === user.uid && shared.permission === "write"
      )
    ) {
      throw new Error("You do not have permission to update this todo.");
    }

    await updateDoc(todoDoc, {
      ...data,
      updatedBy: {
        name: user.displayName,
        email: user.email,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating todo:", error.message);
    throw error;
  }
}

export async function deleteTodo(id, user) {
  try {
    const todoDoc = doc(db, "todos", id);

    const hasPermission = await checkPermission(todoDoc, user);
    if (!hasPermission) {
      console.error("Permission denied for delete operation.");
      throw new Error("Permission denied.");
    }

    await deleteDoc(todoDoc);
  } catch (error) {
    console.error("Error in deleteTodo function:", error.message);
    throw error;
  }
}

async function checkPermission(todoDoc, user) {
  const docSnap = await getDoc(todoDoc);
  if (!docSnap.exists()) {
    throw new Error("Todo not found.");
  }

  const todoData = docSnap.data();
  return (
    todoData.userId === user.uid ||
    todoData.sharedWith.some(
      (shared) => shared.uid === user.uid && shared.permission === "write"
    )
  );
}
