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

// JWT 토큰에서 userId 추출 함수
function getUserIdFromAccessToken() {
  const token = sessionStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload.sub || payload.userId || payload.id || null;
  } catch (e) {
    console.error("토큰 디코딩 실패:", e);
    return null;
  }
}

export default function NotificationPage() {
  const [currentTab, setCurrentTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMarkedAsRead, setHasMarkedAsRead] = useState(false);

  // userId 상태 추가 (초기값 null)
  const [userId, setUserId] = useState(null);

  // 컴포넌트 마운트 시 accessToken에서 userId 추출
  useEffect(() => {
    const id = getUserIdFromAccessToken();
    console.log("userId:", id);
    if (id) setUserId(id);
  }, []);

  // 쿼리 파라미터 빌드
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    params.append("page", page);
    params.append("size", 5);
    if (currentTab !== "all") {
      params.append("type", currentTab);
    }
    return params.toString();
  };

  // 모든 알림 읽음 처리
  const markAllAsRead = async () => {
    if (!userId) return;

    try {
      const token = sessionStorage.getItem("accessToken"); // 변경
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/mark-all-read?userId=${userId}`,
        {
          method: "PATCH",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (response.ok) {
        cache.clear();
        setHasMarkedAsRead(true);
        window.dispatchEvent(new Event("notificationRead"));
      } else {
        console.error("알림 읽음 처리 실패");
      }
    } catch (error) {
      console.error("알림 읽음 처리 중 오류 발생:", error);
    }
  };

  // 마운트 및 읽음 처리 후 호출
  useEffect(() => {
    if (!hasMarkedAsRead && userId) {
      markAllAsRead();
    }
  }, [hasMarkedAsRead, userId]);

  // 알림 목록 가져오기
  useEffect(() => {
    if (!userId) return;

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
    const token = sessionStorage.getItem("accessToken"); // 변경
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
  }, [currentTab, page, hasMarkedAsRead, userId]);

  const handleDelete = async (notificationNo) => {
    if (!userId) return;

    const token = sessionStorage.getItem("accessToken");
    const url = `http://localhost:8888/notifications/${notificationNo}/delete`;

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        alert("알림 삭제 실패");
        return;
      }

      // 캐시 및 상태 갱신
      cache.delete(`${currentTab}-${page}`);
      setNotifications((prev) =>
        prev.filter((n) => n.notificationNo !== notificationNo)
      );
    } catch (err) {
      console.error("삭제 중 오류 발생", err);
      alert("삭제 중 오류 발생");
    }
  };

  // UI 렌더링
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>알림</h1>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setCurrentTab(tab.id);
              setPage(0);
            }}
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
        } ${!isLoading && notifications.length === 0 ? styles.noBorder : ""}`}
      >
        {!isLoading && notifications.length === 0 ? (
          <p className={styles.emptyMessage}>도착한 알림이 없습니다.</p>
        ) : (
          notifications.map((item) => (
            <div key={item.notificationNo} className={styles.notificationItem}>
              <div className={styles.notificationContent}>
                <div className={styles.avatar}>
                  {item.projectThumbnailUrl ? (
                    <img
                      src={item.projectThumbnailUrl}
                      alt={`${item.projectName} 썸네일`}
                      className={styles.avatarImage}
                    />
                  ) : (
                    <img
                      src="/images/tumblbug_logo.png"
                      className={styles.avatarImage}
                    />
                  )}
                </div>
                <div className={styles.content}>
                  <div className={styles.header}>
                    <div className={styles.textContent}>
                      {/* 창작자 이름 */}
                      <div className={styles.creatorName}>
                        {item.creatorName}
                      </div>
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
          ))
        )}
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
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
            >
              &#8594;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
