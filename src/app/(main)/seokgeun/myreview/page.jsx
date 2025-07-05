"use client";
import React, { useEffect, useState } from "react";
import "./page.css";

export default function MyReviewPage() {
  // 후기 데이터 상태
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // TODO: 실제 API 연동 시 fetch/axios 등으로 데이터 받아오기
    // 예시: fetch('/api/myreview').then(...)
    setLoading(true);
    setTimeout(() => {
      // 임시: 빈 배열(후기 없음)
      setReviews([]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="myreview-container">
      <div className="sponsored-divider"></div>
      <h1 className="myreview-title">내 후기</h1>
      {loading ? (
        <div style={{ padding: 40, textAlign: "center" }}>로딩 중...</div>
      ) : error ? (
        <div style={{ padding: 40, textAlign: "center", color: "red" }}>
          {error}
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: "#bbb" }}>
          후기를 작성할 수 있는 프로젝트가 없습니다.
        </div>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>{review.content}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
