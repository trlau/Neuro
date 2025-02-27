import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDx2JFQAYFfzSpGDlL4KjLhL_Ru5zY8KuY",
  authDomain: "aira-api.firebaseapp.com",
  databaseURL: "https://aira-api-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aira-api",
  storageBucket: "aira-api.firebasestorage.app",
  messagingSenderId: "1026132151304",
  appId: "1:1026132151304:web:0b8b75786fd018e8e7d5bd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const loginWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Google Login failed:", error);
  }
};

const loginWithGitHub = async () => {
  try {
    await signInWithPopup(auth, githubProvider);
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

export { auth, loginWithGoogle, loginWithGitHub, logout };
