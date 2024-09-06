import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
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

export async function updateTodo(id, data) {
  const todoDoc = doc(todosCol, id);
  await updateDoc(todoDoc, data);
}

export async function updateTodoStatus(id, status) {
  const todoDoc = doc(todosCol, id);
  await updateDoc(todoDoc, {
    status,
  });
}

export async function deleteTodo(id) {
  const todoDoc = doc(todosCol, id);
  await deleteDoc(todoDoc);
}
