"use client";
import React, { useState } from "react";
import "./page.css";

export default function MyMessage() {
  const [unreadOnly, setUnreadOnly] = useState(true);
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
