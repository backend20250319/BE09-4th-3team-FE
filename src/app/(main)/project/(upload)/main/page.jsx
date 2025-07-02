"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const CkEditor = dynamic(() => import("./components/ckEditor"), {
  ssr: false, // 서버 사이드 렌더링 끄기
});

export default function Page() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`제목: ${title}\n내용: ${content}`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-6">
      <div>
        <label htmlFor="title" className="block mb-2 font-semibold">
          프로젝트 제목
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="프로젝트 제목을 입력하세요"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">프로젝트 내용</label>
        <CkEditor onChange={setContent} />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        제출하기
      </button>
    </form>
  );
}
