import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "./config";
import toast from "react-hot-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function registerUser(name, email, password) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: name });

   await setDoc(doc(db, "users", user.uid), {
     uid: user.uid,
     name: name,
     email: user.email,
     createdAt: new Date().toISOString(),
     provider: "email",
   });
}
export async function loginGoogle() {
  const provider = new GoogleAuthProvider();
  const { user } = await signInWithPopup(auth, provider);

  const userDocRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userDocRef);

  if (!docSnap.exists()) {
    await setDoc(userDocRef, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      createdAt: new Date().toISOString(),
      provider: "google",
    });
  }
}

export async function loginUser(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  await signOut(auth);
}

export async function resetPassword(email) {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      toast.success(
        "Instructions to reset your password have been sent to your email!"
      );
    })
    .catch((error) => {
      toast.error(`Failed to send reset email: ${error.message}`);
    });
}
