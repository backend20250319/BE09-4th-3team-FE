"use client";
import React, { useEffect, useState } from "react";
import "./page.css";
import { useRouter } from "next/navigation";

const FILTERS = [
  "전체",
  "작성 중",
  "심사 중",
  "승인됨",
  "보완 요청됨",
  "반려됨",
  "공개예정",
  "진행 중",
  "종료",
];

export default function MyProjectPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("전체");
  const [showTooltip, setShowTooltip] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
      router.replace("/seokgeun/login");
      return;
    }
    // TODO: 실제 API 연동 시 fetch/axios 등으로 데이터 받아오기
    setLoading(true);
    setTimeout(() => {
      setProjects([]); // 임시: 프로젝트 없음
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="myproject-container">
      <div className="sponsored-divider"></div>
      <div className="myproject-header-row">
        <h1 className="myproject-title">내가 만든 프로젝트</h1>
      </div>
      <div className="myproject-toolbar-row">
        <div className="myproject-filter-group">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              className={`myproject-filter-btn${
                activeFilter === filter ? " active" : ""
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="myproject-guide-wrap">
          <span className="myproject-guide">프로젝트 코드란?</span>
          <span
            className="myproject-guide-icon"
            tabIndex={0}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            onClick={() => setShowTooltip((v) => !v)}
            aria-label="프로젝트 코드란? 안내"
          >
            ?
          </span>
          {showTooltip && (
            <div className="myproject-tooltip">
              프로젝트 코드는 각 프로젝트에 부여된 고유한 코드입니다. 기획전
              신청 혹은 문의 시 해당 코드가 사용됩니다.
            </div>
          )}
        </div>
      </div>
      {loading ? (
        <div style={{ padding: 40, textAlign: "center" }}>로딩 중...</div>
      ) : error ? (
        <div style={{ padding: 40, textAlign: "center", color: "red" }}>
          {error}
        </div>
      ) : projects.length === 0 ? (
        activeFilter === "전체" ? (
          <div className="myproject-empty-block">
            <div className="myproject-empty-icon">✏️</div>
            <div className="myproject-empty-text">
              작성한 프로젝트가 없습니다.
            </div>
            <button className="myproject-create-btn">프로젝트 올리기</button>
          </div>
        ) : (
          <div className="myproject-empty-block">
            <div className="myproject-empty-icon">✏️</div>
            <div className="myproject-empty-text">프로젝트가 없습니다.</div>
          </div>
        )
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
