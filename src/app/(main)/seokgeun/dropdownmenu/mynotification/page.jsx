"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./page.css";

const TAB_LIST = [
  { key: "all", label: "전체" },
  { key: "activity", label: "활동" },
  { key: "project", label: "프로젝트" },
];

// 샘플 알림 데이터
const NOTIFICATIONS = [
  {
    id: 1,
    type: "badge",
    title: "🏅 [만나서 반가워요] 뱃지를 새로 받았어요!",
    desc: "내가 모은 뱃지 보러가기 👉",
    date: "1일 전",
    image: "/images/default_login_icon.png",
    tab: ["all", "activity"],
  },
];

// (1) 알림 목록 불러오기 (구조만)
async function fetchNotifications() {
  // TODO: 백엔드 연동 시 아래 fetch를 실제 API로 교체
  // const res = await fetch('/api/notifications', { headers: { Authorization: ... } });
  // return await res.json();
  return NOTIFICATIONS; // 임시 데이터
}

// (2) 알림 삭제하기 (구조만)
async function deleteNotification(id) {
  // TODO: 백엔드 연동 시 아래 fetch를 실제 API로 교체
  // await fetch(`/api/notifications/${id}`, { method: 'DELETE', headers: { Authorization: ... } });
  return true; // 성공했다고 가정
}

export default function MyNotification() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);

  // 마운트 시 알림 불러오기
  useEffect(() => {
    fetchNotifications().then(setNotifications);
  }, []);

  // 탭에 따라 필터링
  const filtered =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.tab.includes(activeTab));

  // 삭제 핸들러
  const handleDelete = async (id) => {
    const ok = await deleteNotification(id);
    if (ok) setNotifications((prev) => prev.filter((n) => n.id !== id));
    // 실패 시 에러 처리도 추가 가능
  };

  return (
    <div className="notification-outer-wrapper">
      <div className="notification-title">알림</div>
      <div className="notification-tabs">
        <ul className="notification-tabs-list">
          {TAB_LIST.map((tab) => (
            <li
              key={tab.key}
              className={activeTab === tab.key ? "active" : ""}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="notification-list-wrapper">
        {filtered.length === 0 ? (
          <div className="notification-empty">
            <div className="notification-empty-icon">🔔</div>
            <div className="notification-empty-text">알림 내역이 없습니다.</div>
          </div>
        ) : (
          filtered.map((n) => (
            <div className="notification-item" key={n.id}>
              <div className="notification-item-left">
                <Image
                  src={n.image}
                  width={48}
                  height={48}
                  alt="알림 아이콘"
                  className="notification-item-img"
                />
              </div>
              <div className="notification-item-content">
                <div className="notification-item-title">{n.title}</div>
                <div className="notification-item-desc">{n.desc}</div>
                <div className="notification-item-date">{n.date}</div>
              </div>
              <div className="notification-item-action">
                <button
                  className="notification-delete-btn"
                  onClick={() => handleDelete(n.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
