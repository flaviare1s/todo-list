import { getAuth } from "firebase/auth";
import { db } from "./config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { todosCol } from "./todo";

export async function shareTodoWithEmail(todoId, email, permission) {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  console.log("Current User:", currentUser);
  console.log("Sharing todo:", todoId, "with email:", email);

  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  if (!email || typeof email !== "string") {
    throw new Error("Invalid email address");
  }

  try {
    console.log("Email for query:", email);

    const usersQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );

    const userSnapshot = await getDocs(usersQuery);

    console.log(
      "User Snapshot:",
      userSnapshot.empty
        ? "No documents found"
        : userSnapshot.docs.map((doc) => doc.data())
    );

    if (!userSnapshot.empty) {
      const userToShareWith = userSnapshot.docs[0].data();
      const todoDoc = doc(todosCol, todoId);

      const todoSnapshot = await getDoc(todoDoc);

      if (todoSnapshot.exists()) {
        const todoData = todoSnapshot.data();

        if (todoData.userId !== currentUser.uid) {
          throw new Error("You do not have permission to share this todo");
        }

        const sharedWith = todoData.sharedWith || [];

        const userIndex = sharedWith.findIndex(
          (user) => user.uid === userToShareWith.uid
        );
        if (userIndex > -1) {
          sharedWith[userIndex].permission = permission;
        } else {
          sharedWith.push({ uid: userToShareWith.uid, permission });
        }

        await updateDoc(todoDoc, { sharedWith });
        return true;
      } else {
        throw new Error("Todo not found");
      }
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error sharing todo:", error.message);
    throw error;
  }
}
