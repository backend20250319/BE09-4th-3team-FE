"use client";
import React, { useEffect } from "react";
import "./page.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SponsoredProjects() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
      router.replace("/seokgeun/login");
      return;
    }
  }, []);

  return (
    <div className="sponsored-outer-wrapper">
      <div className="sponsored-divider"></div>
      <div className="sponsored-topbox">
        <div className="sponsored-topbox-left">
          <div className="sponsored-title">후원한 프로젝트</div>
          <div className="sponsored-guide">0건의 후원 내역이 있습니다.</div>
        </div>
        <div className="sponsored-topbox-right">
          <div className="sponsored-searchbox">
            <span className="sponsored-search-icon">🔍</span>
            <input
              className="sponsored-search-input"
              placeholder="프로젝트, 선물, 창작자를 검색하세요"
              type="text"
            />
          </div>
        </div>
      </div>
      <div
        className="sponsored-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <div
          className="sponsored-empty"
          style={{ fontSize: "20px", color: "#bbb", textAlign: "center" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎁</div>
          후원 내역이 없습니다.
        </div>
      </div>
    </div>
  );
}
