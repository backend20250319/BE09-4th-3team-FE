"use client";
import React, { useEffect, useState } from "react";
import "./page.css";
import { useRouter } from "next/navigation";

export default function MyReviewPage() {
  // 후기 데이터 상태
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
      router.replace("/users/login");
      return;
    }

    setLoading(true);
    setTimeout(() => {
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
