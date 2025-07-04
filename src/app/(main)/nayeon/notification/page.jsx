"use client";
import React, { useState, useEffect } from "react";
import styles from "./notification.module.css";

const tabs = [
  { id: "all", label: "전체" },
  { id: "completed", label: "후원 완료" },
  { id: "success", label: "프로젝트 성공" },
  { id: "fail", label: "프로젝트 실패" },
];

// 캐시 객체 (컴포넌트 외부에 선언)
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5분

// 캐시 정리 함수
const cleanupCache = () => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
};

export default function NotificationPage() {
  const [currentTab, setCurrentTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const userNo = 8; // 임시 하드코딩

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.append("userNo", userNo);
    params.append("page", page);
    params.append("size", 5);
    if (currentTab !== "all") {
      params.append("type", currentTab);
    }
    return params.toString();
  };

  useEffect(() => {
    const cacheKey = `${currentTab}-${page}`;

    // 캐시 정리
    cleanupCache();

    // 캐시에 있으면 바로 사용 (즉시 로딩!)
    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      setNotifications(cachedData.content || []);
      setTotalPages(cachedData.totalPages || 0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true); // 로딩 시작
    const token = localStorage.getItem("accessToken");
    const url = `http://localhost:8888/notifications?${buildQueryParams()}`;

    fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // 캐시에 저장 (5분간 유효)
        cache.set(cacheKey, {
          ...data,
          timestamp: Date.now(),
        });

        setNotifications(data.content || []);
        setTotalPages(data.totalPages || 0);
        setIsLoading(false); // 로딩 완료
      })
      .catch(() => {
        setNotifications([]);
        setTotalPages(0);
        setIsLoading(false); // 로딩 완료
      });
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

      {/* 로딩 상태에 따라 클래스 조건부 적용 */}
      <div
        className={`${styles.notificationList} ${
          isLoading ? styles.loading : ""
        }`}
      >
        {notifications.map((item) => (
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

      {/* 페이징 - 페이지가 2페이지 이상일 때만 전체 페이징 표시 */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {/* 이전 화살표 - 첫 페이지가 아닐 때만 표시 */}
          {page > 0 && (
            <button
              className={styles.pageNavButton}
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            >
              &#8592;
            </button>
          )}

          {/* 페이지 번호들 */}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`${styles.pageButton} ${
                page === i ? styles.activePage : ""
              }`}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}

          {/* 다음 화살표 - 마지막 페이지가 아닐 때만 표시 */}
          {page < totalPages - 1 && (
            <button
              className={styles.pageNavButton}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            >
              &#8594;
            </button>
          )}
        </div>
      )}
    </div>
  );
}