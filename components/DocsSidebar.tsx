"use client";

import { useEffect } from "react";

export default function DocsSidebar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside className="w-64 p-6 sticky top-0 hidden md:block border-r border-border bg-white/5">
      <nav className="flex flex-col gap-4 text-sm">
        <button onClick={() => scrollTo("welcome")} className="hover:text-blue-500 text-left font-medium">Welcome</button>
        <button onClick={() => scrollTo("about")} className="hover:text-blue-500 text-left font-medium">About Neuro</button>
        <button onClick={() => scrollTo("how-it-works")} className="hover:text-blue-500 text-left font-medium">How It Works</button>
        <button onClick={() => scrollTo("features")} className="hover:text-blue-500 text-left font-medium">Features</button>
        <button onClick={() => scrollTo("faq")} className="hover:text-blue-500 text-left font-medium">FAQ</button>
        <button onClick={() => scrollTo("contact")} className="hover:text-blue-500 text-left font-medium">Contact</button>
      </nav>
    </aside>
  );
}
