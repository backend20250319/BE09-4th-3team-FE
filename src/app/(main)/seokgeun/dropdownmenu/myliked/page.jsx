"use client";
import React, { useEffect, useState } from "react";
import "./page.css";
import { useRouter } from "next/navigation";

export default function MyLikedPage() {
  // 관심 프로젝트 데이터 상태
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
      router.replace("/seokgeun/login");
      return;
    }
    // TODO: 실제 API 연동 시 fetch/axios 등으로 데이터 받아오기
    setLoading(true);
    setTimeout(() => {
      // 임시: 빈 배열(관심 프로젝트 없음)
      setProjects([]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="myliked-container">
      <div className="sponsored-divider"></div>
      <h1 className="myliked-title">관심 프로젝트</h1>
      {/* 탭/필터 등 추가 UI는 여기에 */}
      {loading ? (
        <div style={{ padding: 40, textAlign: "center" }}>로딩 중...</div>
      ) : error ? (
        <div style={{ padding: 40, textAlign: "center", color: "red" }}>
          {error}
        </div>
      ) : projects.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: "#bbb" }}>
          0개의 프로젝트가 있습니다.
        </div>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>{project.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
