// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore/lite";
import { useEffect } from "react";
import useStore from "store";
import shallow from "zustand/shallow";
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

export async function signupUser({ username, email, password }) {
  const userCreds = await createUserWithEmailAndPassword(auth, email, password);

  await createUser({
    user: userCreds.user,
    username,
  });
}

export async function createUser({ user, username }) {
  // add user so uid is document id
  const userDoc = doc(db, "users", user.uid);
  await setDoc(userDoc, {
    uid: user.uid,
    username,
    email: user.email,
  });
}

export async function checkIfUsernameTaken(username) {
  const col = collection(db, "users");
  const q = query(col, where("username", "==", username));
  const { empty } = await getDocs(q);

  return empty || "Username already taken";
}

export function useAuthUser() {
  const [setUser, resetUser] = useStore(
    (s) => [s.setUser, s.resetUser],
    shallow
  );

  useEffect(() => {
    async function getUser(user) {
      if (!user) {
        resetUser();
      } else {
        // get user by uid from firestore
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUser(userDoc.data());
        } else {
          resetUser();
        }
      }
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      getUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, [setUser, resetUser]);
}

export async function logOut() {
  return await signOut(auth);
}

export async function loginUser({ email, password }) {
  return await signInWithEmailAndPassword(auth, email, password);
}

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
