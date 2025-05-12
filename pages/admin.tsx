"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../route/AuthContext";
import { ProtectedRoute } from "../route/ProtectedRoute";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
// import { getDoc, doc } from "firebase/firestore";
// import { auth } from "../lib/firebase";
// import { User } from "firebase/auth";
import { Search, FileText, Download, CheckCircle2, XCircle, Loader2, Settings2, MessageCircle } from "lucide-react";

interface Feedback {
  id: string;
  content: string;
  positivity: boolean;
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
  const [tab, setTab] = useState<"feedback" | "tune">("feedback");
  // AI tuning state
  const [tunePrompt, setTunePrompt] = useState("");
  const [tuneStatus, setTuneStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [tuneMessage, setTuneMessage] = useState("");

  useEffect(() => {
    console.log("[AdminPage] userData:", userData);
    const fetchFeedbacks = async () => {
      try {
        const feedbacksRef = collection(db, "feedbacks");
        const querySnapshot = await getDocs(feedbacksRef);
        const feedbacksData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Coerce positivity to boolean
          let positivity: boolean;
          if (typeof data.positivity === "boolean") {
            positivity = data.positivity;
          } else if (data.positivity === "positive") {
            positivity = true;
          } else if (data.positivity === "negative") {
            positivity = false;
          } else {
            positivity = false; // fallback
          }
          return {
            id: doc.id,
            ...data,
            positivity,
          };
        }) as Feedback[];
        console.log("[AdminPage] fetched feedbacks:", feedbacksData);
        setFeedbacks(feedbacksData);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    // TEMP: Fetch feedbacks regardless of role for debugging
    fetchFeedbacks();
    // if (userData.role === "admin") {
    //   fetchFeedbacks();
    // }
  }, [userData]);

  // Filter and search logic
  const filteredFeedbacks = feedbacks.filter(fb => {
    const matchesSearch =
      fb.content.toLowerCase().includes(search.toLowerCase()) ||
      fb.userId.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "positive" && fb.positivity) ||
      (filter === "negative" && !fb.positivity);
    return matchesSearch && matchesFilter;
  });

  // Export feedback as CSV
  const handleExport = () => {
    const header = "User ID,Content,Positivity,Reviewed,Timestamp\n";
    const rows = filteredFeedbacks.map(fb =>
      [
        fb.userId,
        '"' + fb.content.replace(/"/g, '""') + '"',
        fb.positivity ? "Positive" : "Negative",
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

  // AI Model Tuning
  const handleTuneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTuneStatus("loading");
    setTuneMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/llm/tune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: tunePrompt })
      });
      if (!res.ok) throw new Error("Failed to tune model");
      setTuneStatus("success");
      setTuneMessage("AI model tuned successfully!");
    } catch (err) {
      setTuneStatus("error");
      setTuneMessage("Failed to tune AI model.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex flex-col min-h-screen w-screen bg-black text-white font-space-grotesk overflow-x-hidden">
        {/* Admin Title & Description */}
        <div className="w-full px-8 pt-10 pb-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-gray-400 max-w-2xl">Manage user feedback, tune the AI model's tone, and oversee your research assistant's experience. Use the tabs below to switch between feedback review and AI model tuning.</p>
        </div>
        {/* Tabs */}
        <div className="sticky top-0 z-20 bg-black border-b border-zinc-800 flex items-center gap-2 px-0 py-0 shadow-lg w-full">
          <div className="flex w-full">
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold transition-all duration-200 border-b-2 text-base
                ${tab === "feedback"
                  ? "bg-black text-white border-blue-600"
                  : "bg-black text-gray-400 border-transparent hover:bg-zinc-900/60 hover:text-white"}
              `}
              onClick={() => setTab("feedback")}
              style={{ borderRadius: 0 }}
            >
              <MessageCircle size={18} /> Feedback Review
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold transition-all duration-200 border-b-2 text-base
                ${tab === "tune"
                  ? "bg-black text-white border-green-600"
                  : "bg-black text-gray-400 border-transparent hover:bg-zinc-900/60 hover:text-white"}
              `}
              onClick={() => setTab("tune")}
              style={{ borderRadius: 0 }}
            >
              <Settings2 size={18} /> AI Model Tuning
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 w-full px-0 py-10">
          {tab === "feedback" && (
            <div className="w-full px-8">
              {/* Search/Filter Bar */}
              <div className="sticky top-20 z-10 flex flex-col md:flex-row md:items-center gap-4 mb-8 bg-zinc-900/70 rounded-xl p-4 shadow border border-zinc-800 w-full">
                <div className="flex items-center bg-zinc-900/60 rounded-lg px-3 py-2 w-full md:w-1/2">
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
                    className={`px-4 py-2 rounded-lg font-medium border border-white/10 bg-blue-900/80 text-white shadow-sm hover:bg-blue-800/80 hover:text-white hover:border-blue-400 hover:shadow-lg focus:ring-2 focus:ring-blue-900/40 transition-all ${filter === "all" ? "ring-2 ring-blue-900" : ""}`}
                    onClick={() => setFilter("all")}
                  >All</button>
                  <button
                    className={`px-4 py-2 rounded-lg font-medium border border-white/10 bg-green-900/80 text-white shadow-sm hover:bg-green-800/80 hover:text-white hover:border-green-400 hover:shadow-lg focus:ring-2 focus:ring-green-900/40 transition-all ${filter === "positive" ? "ring-2 ring-green-900" : ""}`}
                    onClick={() => setFilter("positive")}
                  >Positive</button>
                  <button
                    className={`px-4 py-2 rounded-lg font-medium border border-white/10 bg-red-900/80 text-white shadow-sm hover:bg-red-800/80 hover:text-white hover:border-red-400 hover:shadow-lg focus:ring-2 focus:ring-red-900/40 transition-all ${filter === "negative" ? "ring-2 ring-red-900" : ""}`}
                    onClick={() => setFilter("negative")}
                  >Negative</button>
                </div>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium border border-white/10 bg-blue-900/80 text-white shadow-sm hover:bg-blue-800/80 hover:text-white hover:border-blue-400 hover:shadow-lg focus:ring-2 focus:ring-blue-900/40 transition-all ml-auto"
                >
                  <Download size={18} /> Export CSV
                </button>
              </div>
              {/* Feedback Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {isLoading ? (
                  <div className="col-span-full flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-gray-400" size={40} />
                  </div>
                ) : filteredFeedbacks.length === 0 ? (
                  <p className="col-span-full text-gray-400 text-center py-8">No feedback found.</p>
                ) : (
                  filteredFeedbacks.map((fb) => (
                    <div
                      key={fb.id}
                      className="bg-zinc-900/80 rounded-2xl p-6 border border-zinc-800 hover:border-blue-500/40 transition-all duration-300 shadow-xl hover:shadow-2xl flex flex-col gap-3 w-full"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {fb.positivity ? (
                            <CheckCircle2 className="text-green-400" size={20} />
                          ) : (
                            <XCircle className="text-red-400" size={20} />
                          )}
                          <span className="text-sm font-medium text-gray-300">
                            {fb.positivity ? "Positive" : "Negative"}
                          </span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs ${fb.is_reviewed ? "bg-blue-500/20 text-blue-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                          {fb.is_reviewed ? "Reviewed" : "Pending"}
                        </span>
                      </div>
                      <p className="text-base text-white mb-2 line-clamp-6">{fb.content}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
                        <span>User ID: {fb.userId || <span className="italic text-zinc-500">unknown</span>}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {tab === "tune" && (
            <div className="w-full flex flex-col items-start px-8">
              <div className="w-full p-0 m-0 bg-black border-none shadow-none rounded-none flex flex-col gap-6">
                <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-2"><Settings2 size={22}/> AI Model Tuning</h2>
                <p className="text-gray-400 mb-4">Change the tone or behavior of the AI model by providing a new tuning prompt below. This will affect how the assistant responds to users.</p>
                <form onSubmit={handleTuneSubmit} className="flex flex-col gap-4 w-full">
                  <label className="text-gray-300 font-medium">Tuning Prompt</label>
                  <textarea
                    className="bg-zinc-900 text-white rounded-lg p-4 min-h-[120px] outline-none border border-zinc-800 focus:border-green-500 transition-all resize-vertical w-full"
                    placeholder="Enter prompt to tune the AI model's tone or behavior..."
                    value={tunePrompt}
                    onChange={e => setTunePrompt(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="bg-green-900/80 hover:bg-green-800/80 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-60 w-fit"
                    disabled={tuneStatus === "loading"}
                  >
                    {tuneStatus === "loading" ? "Tuning..." : "Tune AI Model"}
                  </button>
                  {tuneStatus === "success" && <div className="text-green-400 font-medium">{tuneMessage}</div>}
                  {tuneStatus === "error" && <div className="text-red-400 font-medium">{tuneMessage}</div>}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 