// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqPVcbzlyXE4GPjznGBEpQHLCcfVR4zI4",
  authDomain: "reddit-clone-c9a4a.firebaseapp.com",
  projectId: "reddit-clone-c9a4a",
  storageBucket: "reddit-clone-c9a4a.appspot.com",
  messagingSenderId: "496852010626",
  appId: "1:496852010626:web:788b552157262f2aaad69b",
  measurementId: "G-E00EGE4QNE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

export async function loginUser() {}

export async function signupUser({ email, password }) {
  const userCreds = await createUserWithEmailAndPassword(auth, email, password);
  return userCreds;
}

export function useAuthUser() {}

export async function checkIfUsernameTaken() {}

export async function logOut() {}

export async function createUser() {}

export async function createPost() {}

export async function getDocuments() {}

export async function getPost() {}

export async function getPosts() {}

export async function getPostsByUsername() {}

export async function getPostsByCategory() {}

export async function deletePost() {}

export async function createComment() {}

export async function getCommentsByPostId() {}

export async function deleteComment() {}

export async function addView() {}

export async function getCommentCount() {}

export async function toggleVote() {}
