"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { collection, query, orderBy, getDocs, doc, updateDoc, where, getDoc, setDoc } from "firebase/firestore";
import { Dialog } from "../components/motion/Modal";
import { AnimatePresence } from "motion/react";

interface Feedback {
  id: string;
  userId: string;
  content: string;
  positivity: boolean;
  is_reviewed: boolean;
  timestamp: any;
}

interface User {
  id: string;
  userId: string;
  role: string;
  timestamp: any;
  email?: string;
}

export default function AdminPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) {
        window.location.href = "/";
        return;
      }

      // First check if user exists in users collection
      const userQuery = query(collection(db, "users"), where("userId", "==", user.uid));
      const userSnapshot = await getDocs(userQuery);
      
      if (userSnapshot.empty) {
        // If user doesn't exist, create them as admin
        await setDoc(doc(db, "users", user.uid), {
          userId: user.uid,
          email: user.email,
          role: "admin", // Make everyone admin by default
          timestamp: new Date()
        });
      }
    };

    checkAdmin();
    loadFeedbacks();
    loadUsers();
  }, []);

  const loadFeedbacks = async () => {
    const feedbacksQuery = query(
      collection(db, "feedbacks"),
      orderBy("timestamp", "desc")
    );
    const snapshot = await getDocs(feedbacksQuery);
    const feedbacksData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Feedback[];
    setFeedbacks(feedbacksData);
  };

  const loadUsers = async () => {
    const usersQuery = query(
      collection(db, "users"),
      orderBy("timestamp", "desc")
    );
    const snapshot = await getDocs(usersQuery);
    const usersData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];
    setUsers(usersData);
  };

  const handleReviewFeedback = async (feedbackId: string) => {
    await updateDoc(doc(db, "feedbacks", feedbackId), {
      is_reviewed: true
    });
    loadFeedbacks();
  };

  const handleViewFeedback = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setIsDialogOpen(true);
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    await updateDoc(doc(db, "users", userId), {
      role: newRole
    });
    loadUsers();
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Admin Dashboard</h1>

        {/* Feedback Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-white">User Feedback</h2>
          <div className="grid gap-4">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-zinc-900/50 p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 mb-2">User ID: {feedback.userId}</p>
                    <p className="mb-4 text-white">{feedback.content}</p>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        feedback.positivity ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {feedback.positivity ? "Positive" : "Negative"}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        feedback.is_reviewed ? "bg-blue-500/20 text-blue-400" : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {feedback.is_reviewed ? "Reviewed" : "Pending"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewFeedback(feedback)}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:shadow-lg"
                    >
                      View Details
                    </button>
                    {!feedback.is_reviewed && (
                      <button
                        onClick={() => handleReviewFeedback(feedback.id)}
                        className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all duration-300 hover:shadow-lg"
                      >
                        Mark as Reviewed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Users Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">Users</h2>
          <div className="grid gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-zinc-900/50 p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 mb-2">User ID: {user.userId}</p>
                    <p className="text-gray-400">Role: {user.role}</p>
                    {user.email && <p className="text-gray-400">Email: {user.email}</p>}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400">
                      {new Date(user.timestamp?.toDate()).toLocaleDateString()}
                    </span>
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                      className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-1 hover:border-white/20 transition-all duration-300"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Feedback Detail Dialog */}
      <AnimatePresence>
        {isDialogOpen && selectedFeedback && (
          <Dialog
            close={() => setIsDialogOpen(false)}
            confirmCallback={() => {
              if (!selectedFeedback.is_reviewed) {
                handleReviewFeedback(selectedFeedback.id);
              }
              setIsDialogOpen(false);
            }}
          >
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Feedback Details</h3>
              <p className="text-gray-400">User ID: {selectedFeedback.userId}</p>
              <p className="text-gray-400">Content:</p>
              <p className="bg-zinc-800 p-4 rounded-lg text-white">{selectedFeedback.content}</p>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  selectedFeedback.positivity ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}>
                  {selectedFeedback.positivity ? "Positive" : "Negative"}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  selectedFeedback.is_reviewed ? "bg-blue-500/20 text-blue-400" : "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {selectedFeedback.is_reviewed ? "Reviewed" : "Pending"}
                </span>
              </div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
} 