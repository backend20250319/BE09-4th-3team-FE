"use client";
import React, { useState, useEffect } from "react";
import "./page.css";
import { useRouter } from "next/navigation";

export default function MyMessage() {
  const [unreadOnly, setUnreadOnly] = useState(true);
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
    <div className="message-outer-wrapper">
      <div className="message-title-row">
        <div className="message-title">메시지</div>
        <div className="message-filter">
          <label className="message-checkbox-label">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={() => setUnreadOnly((prev) => !prev)}
              className="message-checkbox"
            />
            <span>안 읽은 메시지</span>
          </label>
        </div>
      </div>
      <div className="message-empty-wrapper">
        <div className="message-empty-icon">💬</div>
        <div className="message-empty-text">새로운 메시지가 없습니다.</div>
      </div>
    </div>
  );
}
