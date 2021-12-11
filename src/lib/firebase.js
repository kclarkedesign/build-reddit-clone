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
  addDoc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  where,
  runTransaction,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore/lite";
import { useEffect } from "react";
import { get } from "react-hook-form";
import useStore from "store";
import shallow from "zustand/shallow";
import { getPostScore, getUpvotePercentage } from "./helpers";
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
export const getTimestamp = serverTimestamp;

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

export async function createPost(post) {
  const postsCol = collection(db, "posts");
  const { id } = await addDoc(postsCol, post);
  const postDoc = doc(db, "posts", id);
  const newPost = await getDoc(postDoc);
  return { id, ...newPost.data() };
}

export async function getDocuments(ref) {
  const snap = await getDocs(ref);
  const docs = snap.docs.map((doc) => ({
    id: doc.id,
    reference: doc.ref,
    ...doc.data(),
  }));
  return docs;
}

export async function getPost(postId) {
  const postRef = doc(db, "posts", postId);
  const postDoc = await getDoc(postRef);
  return postDoc.exists() ? { id: postDoc.id, ...postDoc.data() } : null;
}

export async function getPosts() {
  const col = collection(db, "posts");
  const q = query(col, orderBy("score", "desc"));
  const posts = await getDocuments(q);
  return posts;
}

export async function getPostsByUsername(username) {
  const col = collection(db, "posts");
  const q = query(col, where("author.username", "==", username));
  const posts = await getDocuments(q);
  return posts;
}

export async function getPostsByCategory(category) {
  const col = collection(db, "posts");
  const q = query(
    col,
    where("category", "==", category),
    orderBy("score", "desc")
  );
  const posts = await getDocuments(q);
  return posts;
}

export async function deletePost(postId) {
  const docRef = doc(db, "posts", postId);
  const deletedPost = await deleteDoc(docRef);
  return deletedPost;
}

export async function createComment(comment) {
  const col = collection(db, "posts", comment.postId, "comments");
  const newComment = await addDoc(col, comment);
  return newComment;
}

export async function getCommentsByPostId(postId) {
  const col = collection(db, "posts", postId, "comments");
  const q = query(col, orderBy("created", "desc"));
  const comments = await getDocuments(q);
  return comments;
}

export async function deleteComment({ postId, commentId }) {
  const docRef = doc(db, "posts", postId, "comments", commentId);
  const deletedDoc = await deleteDoc(docRef);
  return deletedDoc;
}

export async function addView(postId) {
  const postRef = doc(db, "posts", postId);
  await runTransaction(db, async (transaction) => {
    const postDoc = await transaction.get(postRef);
    if (postDoc.exists()) {
      const newViewCount = postDoc.data().views + 1;
      transaction.update(postRef, { views: newViewCount });
    }
  });
}

export async function getCommentCount(postId) {
  const col = collection(db, "posts", postId, "comments");
  const { size } = await getDocs(col);
  return size;
}

export async function toggleVote(vote) {
  const { postId, userId, value } = vote;
  const postRef = doc(db, "posts", postId);
  await runTransaction(db, async (transaction) => {
    const postDoc = await transaction.get(postRef);
    if (postDoc.exists()) {
      const votes = { ...postDoc.data().votes };
      const isUnvote = votes[userId] === value;
      if (isUnvote) {
        delete votes[userId];
      } else {
        votes[userId] = value;
      }
      const upvotePercentage = getUpvotePercentage(votes);
      const score = getPostScore(votes);
      transaction.update(postRef, { votes, score, upvotePercentage });
    }
  });
}
