"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./ReviewAllPage.module.css";

export default function ReviewAllPage({ onBack, projectNo }) {
  const [allReviews, setAllReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("latest");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const reviewsPerPage = 10;

  // ✅ 상태 텍스트 매핑
  const statusTextMap = {
    rewardStatus: {
      5: "프로젝트 만족해요",
      3: "프로젝트 보통이에요",
      1: "프로젝트 아쉬워요",
    },
    planStatus: {
      5: "계획 준수 잘 지켰어요",
      3: "계획 준수 무난했어요",
      1: "계획 준수 아쉽게 지켰어요",
    },
    commStatus: {
      5: "소통이 친절했어요",
      3: "소통이 보통이에요",
      1: "소통이 아쉬웠어요",
    },
  };

  const getStatusText = (type, value) => {
    return statusTextMap[type][value] || "정보 없음";
  };

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    if (!projectNo) return;

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:8888/reviews/project/${projectNo}?page=${
            currentPage - 1
          }&size=${reviewsPerPage}&sort=${sortBy}`,
          { headers: getAuthHeaders() }
        );
        setAllReviews(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } catch (err) {
        console.error("전체 리뷰 불러오기 실패:", err);
        setError("리뷰를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [projectNo, currentPage, sortBy]);

  const toggleDropdown = (reviewId) => {
    setActiveDropdown(activeDropdown === reviewId ? null : reviewId);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className={styles.pageButton}
        >
          <ChevronLeft size={16} />
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${styles.pageButton} ${
            currentPage === i ? styles.activePage : ""
          }`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className={styles.pageButton}
        >
          <ChevronRight size={16} />
        </button>
      );
    }

    return pages;
  };

  if (loading) return <div>전체 리뷰를 불러오는 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={onBack} className={styles.backButton}>
            ← 돌아가기
          </button>
          <h2 className={styles.title}>전체 리뷰</h2>
          <p className={styles.subtitle}>총 {totalElements}개의 리뷰</p>
        </div>
        <div className={styles.sortContainer}>
          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">최신순</option>
            <option value="satisfaction">만족도순</option>
          </select>
        </div>
      </div>

      <div className={styles.pageInfo}>
        <span>
          {currentPage} / {totalPages} 페이지
        </span>
        <span>
          ({(currentPage - 1) * reviewsPerPage + 1}-
          {Math.min(currentPage * reviewsPerPage, totalElements)}개 표시)
        </span>
      </div>

      {/* 리뷰 목록 */}
      <div className={styles.reviewList}>
        {allReviews.length === 0 ? (
          <div>리뷰가 없습니다.</div>
        ) : (
          allReviews.map((review) => (
            <div key={review.reviewNo} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.authorInfo}>
                  <div className={styles.authorDetails}>
                    <div className={styles.authorName}>
                      <span>{review.userNickname || "익명"}</span>
                    </div>
                    <div className={styles.reviewMeta}>
                      <span className={styles.reviewDate}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.moreMenu}>
                  <button
                    className={styles.moreButton}
                    onClick={() => toggleDropdown(review.reviewNo)}
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {activeDropdown === review.reviewNo && (
                    <div className={styles.dropdown}>
                      <button className={styles.dropdownItem}>신고하기</button>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.reviewContent}>
                {/* ✅ 상태 텍스트 태그 추가 */}
                <div className={styles.statusTags}>
                  <span className={styles.statusTag}>
                    {getStatusText("rewardStatus", review.rewardStatus)}
                  </span>
                  <span className={styles.statusTag}>
                    {getStatusText("planStatus", review.planStatus)}
                  </span>
                  <span className={styles.statusTag}>
                    {getStatusText("commStatus", review.commStatus)}
                  </span>
                </div>

                <p className={styles.reviewText}>{review.content}</p>

                {review.imageUrl && (
                  <div className={styles.imageContainer}>
                    <img
                      src={review.imageUrl || "/placeholder.svg"}
                      alt="리뷰 이미지"
                      className={styles.reviewImage}
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      <div className={styles.pagination}>{renderPagination()}</div>
    </div>
  );
}
