import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { auth } from "./config";
import toast from "react-hot-toast";

export async function registerUser(name, email, password) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(user, { displayName: name })
}

export async function loginGoogle() {
  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)
}

export async function loginUser(email, password) {
  await signInWithEmailAndPassword(auth, email, password)
}

export async function logout() {
  await signOut(auth)
}

export async function resetarSenha(email) {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      toast.success('Instructions to reset your password have been sent to your email!')
    })
    .catch((error) => {
      toast.error(`Failed to send reset email: ${error.message}`);
    })
}
