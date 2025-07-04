import React from "react";
import "./page.css";
import Image from "next/image";

export default function SponsoredProjects() {
  return (
    <div className="sponsored-outer-wrapper">
      <div className="sponsored-topbox">
        <div className="sponsored-topbox-left">
          <Image
            src="/images/tumblbug_logo.png"
            alt="텀블벅 로고"
            width={120}
            height={32}
            className="sponsored-logo"
          />
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
