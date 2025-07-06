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
  const [isLoading, setIsLoading] = useState(true);
  const [hasMarkedAsRead, setHasMarkedAsRead] = useState(false);
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

  // 모든 알림을 읽음 처리하는 함수
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:8888/notifications/mark-all-read?userNo=${userNo}`,
        {
          method: "PATCH",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (response.ok) {
        // 캐시 무효화
        cache.clear();
        setHasMarkedAsRead(true);

        // 부모 컴포넌트에 알림 카운트 업데이트 알림
        window.dispatchEvent(new Event("notificationRead"));
      } else {
        console.error("알림 읽음 처리 실패");
      }
    } catch (error) {
      console.error("알림 읽음 처리 중 오류 발생:", error);
    }
  };

  // 페이지 로드 시 읽음 처리
  useEffect(() => {
    if (!hasMarkedAsRead) {
      markAllAsRead();
    }
  }, [hasMarkedAsRead]);

  useEffect(() => {
    const cacheKey = `${currentTab}-${page}`;

    cleanupCache();

    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      setNotifications(cachedData.content || []);
      setTotalPages(cachedData.totalPages || 0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem("accessToken");
    const url = `http://localhost:8888/notifications?${buildQueryParams()}`;

    fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        cache.set(cacheKey, {
          ...data,
          timestamp: Date.now(),
        });
        setNotifications(data.content || []);
        setTotalPages(data.totalPages || 0);
        setIsLoading(false);
      })
      .catch(() => {
        setNotifications([]);
        setTotalPages(0);
        setIsLoading(false);
      });
  }, [currentTab, page, hasMarkedAsRead]);

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    setPage(0);
  };

  const handleDelete = async (notificationNo) => {
    const token = localStorage.getItem("accessToken");
    const url = `http://localhost:8888/notifications/${notificationNo}?userNo=${userNo}`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) {
        alert("알림 삭제 실패");
        return;
      }

      // 캐시 무효화
      cache.delete(`${currentTab}-${page}`);

      setNotifications((prev) => {
        const newNotifications = prev.filter(
          (n) => n.notificationNo !== notificationNo
        );

        // 현재 페이지 알림 개수가 5 미만이고 다음 페이지가 있으면
        if (newNotifications.length < 5 && page < totalPages - 1) {
          const nextPageKey = `${currentTab}-${page + 1}`;
          const nextPageData = cache.get(nextPageKey);

          if (nextPageData && nextPageData.content.length > 0) {
            // 다음 페이지 첫 알림을 현재 페이지로 당기기
            const [firstOfNext, ...restNext] = nextPageData.content;

            // 다음 페이지 데이터에서 첫 알림 제거 후 갱신
            cache.set(nextPageKey, {
              ...nextPageData,
              content: restNext,
              totalPages: nextPageData.totalPages,
              timestamp: Date.now(),
            });

            // 현재 페이지 알림에 추가
            return [...newNotifications, firstOfNext];
          }
        }

        return newNotifications;
      });
    } catch (err) {
      console.error("삭제 중 오류 발생", err);
      alert("삭제 중 오류 발생");
    }
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
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(item.notificationNo)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 0 && (
        <div className={styles.pagination}>
          {totalPages > 1 && page > 0 && (
            <button
              className={styles.pageNavButton}
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            >
              &#8592;
            </button>
          )}
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
          {totalPages > 1 && page < totalPages - 1 && (
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
