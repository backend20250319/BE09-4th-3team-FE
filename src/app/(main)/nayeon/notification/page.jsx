"use client";

import React, { useState, useEffect } from "react";
import styles from "./notification.module.css";

const tabs = [
  { id: "all", label: "전체" },
  { id: "support", label: "후원 완료" },
  { id: "success", label: "프로젝트 성공" },
  { id: "fail", label: "프로젝트 실패" },
];

export default function NotificationPage() {
  const [currentTab, setCurrentTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("accessToken"); // 로그인 시 저장된 토큰 꺼냄

    // let url = "http://localhost:8888/notifications";
    // if (currentTab !== "all") {
    //   url += `?type=${currentTab}`;
    // }

    const userNo = 8;

    let url = `http://localhost:8888/notifications?userNo=${userNo}`;
    if (currentTab !== "all") {
      url += `&type=${currentTab}`;
    }

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`, // JWT 토큰 헤더에 포함
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("네트워크 응답에 문제가 있습니다.");
        }
        return res.json();
      })
      .then((data) => {
        setNotifications(data);
      })
      .catch((err) => {
        setError(err.message);
        setNotifications([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentTab]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>알림</h1>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`${styles.tabButton} ${
              currentTab === tab.id ? styles.activeTab : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.notificationList}>
        {loading && <p>로딩중...</p>}
        {error && <p style={{ color: "red" }}>에러: {error}</p>}
        {!loading && !error && notifications.length === 0 && (
          <p>표시할 알림이 없습니다.</p>
        )}

        {!loading &&
          !error &&
          notifications.map((item) => (
            <div key={item.notificationNo} className={styles.notificationItem}>
              <div className={styles.notificationContent}>
                <div className={styles.avatar}>
                  <span className={styles.avatarText}>kakao</span>
                </div>
                <div className={styles.content}>
                  <div className={styles.header}>
                    <div className={styles.textContent}>
                      <h3 className={styles.notificationTitle}>
                        {item.projectName}
                      </h3>
                      <p className={styles.notificationDescription}>
                        {item.message}
                      </p>
                      <div className={styles.notificationTime}>
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <button className={styles.deleteButton}>삭제</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
