/* eslint-disable no-unused-vars */
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./config";
import { getAuth } from "firebase/auth";

export const listsCol = collection(db, "lists");

export async function shareTodosWithEmail(userId, todos, email) {
  const auth = getAuth();
  const usersQuery = query(
    collection(db, "users"),
    where("email", "==", email)
  );

  const userSnapshot = await getDocs(usersQuery);

  if (!userSnapshot.empty) {
    const userToShareWith = userSnapshot.docs[0].data();

    const sharedList = {
      ownerId: userId,
      sharedWith: userToShareWith.uid,
      todos: todos.map((todo) => ({
        title: todo.title,
        status: todo.status,
        userId: todo.userId,
        createdAt: todo.createdAt || new Date(),
      })),
      sharedAt: new Date(),
    };

    await addDoc(listsCol, sharedList);
    return true;
  } else {
    throw new Error("User not found");
  }
}

export async function getSharedTodos(userId) {
  const sharedTodosQuery = query(
    collection(db, "lists"),
    where("sharedWith", "==", userId)
  );

  const sharedTodosSnapshot = await getDocs(sharedTodosQuery);

  const sharedTodos = sharedTodosSnapshot.docs.map((doc) => doc.data());

  return sharedTodos;
}
