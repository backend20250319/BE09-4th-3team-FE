"use client";

import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!show) return null;

  return (
    <button
      onClick={handleScrollTop}
      className="fixed bottom-10 right-10 z-50 bg-[#f86453] text-white px-4 py-2 rounded-full shadow-lg hover:opacity-80 transition"
    >
      ↑ 맨 위로
    </button>
  );
}
