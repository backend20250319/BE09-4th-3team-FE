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
  const [notifications, setNotifications] = useState([]); // 알림 리스트
  const [page, setPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userNo = 8; // 실제로는 로그인한 유저 번호를 넣으세요

  useEffect(() => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("accessToken");
    let url = `http://localhost:8888/notifications?userNo=${userNo}&page=${page}&size=5`;
    if (currentTab !== "all") {
      url += `&type=${currentTab}`;
    }

    console.log("요청 URL:", url); // 디버깅용
    console.log("현재 탭:", currentTab); // 디버깅용

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("네트워크 응답에 문제가 있습니다.");
        return res.json();
      })
      .then((data) => {
        console.log("받은 데이터:", data); // 디버깅용
        setNotifications(data.content);
        setTotalPages(data.totalPages);
      })
      .catch((err) => {
        setError(err.message);
        setNotifications([]);
      })
      .finally(() => setLoading(false));
  }, [currentTab, page]);

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    setPage(0);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>알림</h1>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
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

      {/* 페이징 버튼 */}
      <div className={styles.pagination}>
        <button
          className={styles.pageNavButton}
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          aria-label="이전 페이지"
        >
          &#8592;
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`${styles.pageButton} ${
              page === i ? styles.activePage : ""
            }`}
            onClick={() => setPage(i)}
            aria-current={page === i ? "page" : undefined}
          >
            {i + 1}
          </button>
        ))}

        <button
          className={styles.pageNavButton}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page === totalPages - 1 || totalPages === 0}
          aria-label="다음 페이지"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}
