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
    <aside className="w-64 p-6 sticky top-0 hidden md:block border-r border-border">
      <div className="flex flex-col gap-4 text-sm">
        <button onClick={() => scrollTo("welcome")} className="hover:text-blue-500 text-left">
          Welcome
        </button>
        <button onClick={() => scrollTo("what-is-neuro")} className="hover:text-blue-500 text-left">
          What is Neuro?
        </button>
        <button onClick={() => scrollTo("how-neuro-works")} className="hover:text-blue-500 text-left">
          How Neuro Works
        </button>
        <button onClick={() => scrollTo("features")} className="hover:text-blue-500 text-left">
          Features
        </button>
        <button onClick={() => scrollTo("faq")} className="hover:text-blue-500 text-left">
          FAQ
        </button>
      </div>
    </aside>
  );
}
