import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut, onAuthStateChanged, browserPopupRedirectResolver, getAdditionalUserInfo } from "firebase/auth";
import { getFirestore, collection, addDoc, query, orderBy, getDocs, serverTimestamp } from "firebase/firestore";
import { is_userInDoc, createUser, getUserRole } from "../components/chat/utils/firebaseUtils";
import { useAuth } from "../route/AuthContext";

const firebaseConfig = {
  apiKey: "AIzaSyDx2JFQAYFfzSpGDlL4KjLhL_Ru5zY8KuY",
  authDomain: "aira-api.firebaseapp.com",
  databaseURL: "https://aira-api-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aira-api",
  storageBucket: "aira-api.firebasestorage.app",
  messagingSenderId: "1026132151304",
  appId: "1:1026132151304:web:0b8b75786fd018e8e7d5bd",
  measurementId: "G-09F4HM7SN8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    const userCreatedInDoc = await is_userInDoc()
    if (result.user && !userCreatedInDoc) {
      await createUser();
    }
  } catch (error) {
    console.error("Google Login failed:", error);
  }
};

const loginWithGitHub = async () => {
  try {
    await signInWithPopup(auth, githubProvider, browserPopupRedirectResolver);
  } catch (error) {
    console.error("GitHub Login failed:", error);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

// Function to store chat messages in Firestore
const saveMessage = async (userId: string, message: string) => {
  try {
    const chatRef = collection(db, `users/${userId}/chats`);
    await addDoc(chatRef, {
      message,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

// Function to fetch chat messages from Firestore
const getChatHistory = async (userId: string) => {
  try {
    const chatRef = collection(db, `users/${userId}/chats`);
    const q = query(chatRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      message: doc.data().message || "" // Ensure message is always a string
    }));
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
};


export { auth, db, loginWithGoogle, loginWithGitHub, logout, saveMessage, getChatHistory, onAuthStateChanged };