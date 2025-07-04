"use client";

import React, { useState } from "react";
import ReviewForm from "./reviewForm";

const Page = () => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 예시 페이지 헤더 */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold">내 후기</h1>
      </div>

      {/* 예시 컨텐츠 */}
      <div className="p-4">
        <button
          onClick={() => setIsReviewFormOpen(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          후기 작성하기
        </button>
      </div>

      {/* 후기 작성 폼 */}
      {isReviewFormOpen && (
        <ReviewForm
          isOpen={isReviewFormOpen}
          onClose={() => setIsReviewFormOpen(false)}
        />
      )}
    </div>
  );
};

export default Page;
