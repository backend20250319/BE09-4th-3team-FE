"use client";

import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(start + maxVisiblePages, totalPages);

    if (end - start < maxVisiblePages && start > 0) {
      start = Math.max(0, end - maxVisiblePages);
    }

    for (let i = start; i < end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded border ${i === currentPage ? "bg-[#eb4b38] text-white" : "hover:bg-gray-100"} cursor-pointer`}
        >
          {i + 1}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="mt-6 flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 cursor-pointer"
      >
        이전
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage + 1 >= totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 cursor-pointer"
      >
        다음
      </button>
    </div>
  );
}
