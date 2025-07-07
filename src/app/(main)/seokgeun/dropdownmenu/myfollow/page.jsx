"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./page.css";

export default function CreatorsPage() {
  const router = useRouter();
  // 후원한 창작자 데이터 상태
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // TODO: 실제 API 연동 시 fetch/axios 등으로 데이터 받아오기
    setLoading(true);
    setTimeout(() => {
      // 임시: 빈 배열(창작자 없음)
      setCreators([]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="follows-container">
      <div className="sponsored-divider"></div>
      <h1 className="follows-title">팔로우</h1>
      <div className="follow-tab-group">
        <div className="follow-tab active">후원한 창작자 0</div>
        <div
          className="follow-tab"
          onClick={() => router.push("/seokgeun/myfollow/following")}
        >
          팔로잉 0
        </div>
        <div
          className="follow-tab"
          onClick={() => router.push("/seokgeun/myfollow/follows")}
        >
          팔로워 0
        </div>
      </div>
      {loading ? (
        <div style={{ padding: 40, textAlign: "center" }}>로딩 중...</div>
      ) : error ? (
        <div style={{ padding: 40, textAlign: "center", color: "red" }}>
          {error}
        </div>
      ) : creators.length === 0 ? (
        <div className="follow-empty-block">
          <div className="follow-empty-icon">{/* 아이콘은 필요시 추가 */}</div>
          <div className="follow-empty-text">
            아직 후원하신 창작자가 없습니다.
          </div>
          <button className="browse-btn">프로젝트 둘러보기</button>
        </div>
      ) : (
        <ul>
          {creators.map((creator) => (
            <li key={creator.id}>{creator.nickname}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
