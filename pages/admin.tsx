"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../route/AuthContext";
import { ProtectedRoute } from "../route/ProtectedRoute";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
// import { getDoc, doc } from "firebase/firestore";
// import { auth } from "../lib/firebase";
// import { User } from "firebase/auth";
import { Search, FileText, Download, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface Feedback {
  id: string;
  content: string;
  positivity: string;
  is_reviewed: boolean;
  timestamp: { toDate: () => Date };
  userId: string;
}

export default function AdminPage() {
  const userData = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "positive" | "negative">("all");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const feedbacksRef = collection(db, "feedbacks");
        const q = query(feedbacksRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const feedbacksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Feedback[];
        setFeedbacks(feedbacksData);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (userData.role === "admin") {
      fetchFeedbacks();
    }
  }, [userData]);

  // Filter and search logic
  const filteredFeedbacks = feedbacks.filter(fb => {
    const matchesSearch =
      fb.content.toLowerCase().includes(search.toLowerCase()) ||
      fb.userId.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "positive" && fb.positivity === "positive") ||
      (filter === "negative" && fb.positivity === "negative");
    return matchesSearch && matchesFilter;
  });

  // Export feedback as CSV
  const handleExport = () => {
    const header = "User ID,Content,Positivity,Reviewed,Timestamp\n";
    const rows = filteredFeedbacks.map(fb =>
      [
        fb.userId,
        '"' + fb.content.replace(/"/g, '""') + '"',
        fb.positivity,
        fb.is_reviewed ? "Reviewed" : "Pending",
        fb.timestamp?.toDate ? fb.timestamp.toDate().toLocaleString() : ""
      ].join(",")
    );
    const csv = header + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "feedback_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex flex-col h-full w-full bg-black text-white font-space-grotesk relative min-h-screen">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent z-0" />
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full max-w-5xl mx-auto py-12 px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Admin Dashboard</h1>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Download size={18} /> Export CSV
            </button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex items-center bg-zinc-900/50 rounded-lg px-3 py-2 w-full md:w-1/2">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search feedback or user ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-blue-600 text-white" : "bg-zinc-800 text-gray-300"}`}
                onClick={() => setFilter("all")}
              >All</button>
              <button
                className={`px-4 py-2 rounded-lg ${filter === "positive" ? "bg-green-600 text-white" : "bg-zinc-800 text-gray-300"}`}
                onClick={() => setFilter("positive")}
              >Positive</button>
              <button
                className={`px-4 py-2 rounded-lg ${filter === "negative" ? "bg-red-600 text-white" : "bg-zinc-800 text-gray-300"}`}
                onClick={() => setFilter("negative")}
              >Negative</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-gray-400" size={40} />
              </div>
            ) : filteredFeedbacks.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No feedback found.</p>
            ) : (
              <div className="grid gap-6">
                {filteredFeedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="bg-zinc-900/60 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {fb.positivity === "positive" ? (
                          <CheckCircle2 className="text-green-400" size={20} />
                        ) : (
                          <XCircle className="text-red-400" size={20} />
                        )}
                        <span className="text-sm font-medium text-gray-300">
                          {fb.positivity === "positive" ? "Positive" : "Negative"}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${fb.is_reviewed ? "bg-blue-500/20 text-blue-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                        {fb.is_reviewed ? "Reviewed" : "Pending"}
                      </span>
                    </div>
                    <p className="text-lg text-white mb-3">{fb.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>User ID: {fb.userId}</span>
                      <span>{fb.timestamp?.toDate ? fb.timestamp.toDate().toLocaleString() : ""}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 