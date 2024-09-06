import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import {db} from './config'

export const todosCol = collection(db, 'todos')

export async function addTodo(data) {
  await addDoc(todosCol, data)
}

export async function getTodos() {
  const snapshot = await getDocs(todosCol)
  const todos = []

  snapshot.forEach(doc => {
    todos.push({...doc.data(), id: doc.id})
  })
  return todos
}

export async function updateTodo(id, data) {
  const todoDoc = doc(todosCol, id)
  await updateDoc(todoDoc, data)
}

export async function updateTodoStatus(id, status) {
  const todoDoc = doc(todosCol, id)
  await updateDoc(todoDoc, {
    status
  })
}

export async function deleteTodo(id) {
  const todoDoc = doc(todosCol, id);
  await deleteDoc(todoDoc);
}
