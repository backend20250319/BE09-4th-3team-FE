"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
} from "lucide-react";
import styles from "./ReviewComponent.module.css";
import ReviewAllPage from "./ReviewAllPage";

export default function ReviewComponent({ projectNo }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("latest");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const fixedProjectNo = 2;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8888/reviews/project/${fixedProjectNo}?page=0&size=5&sort=${sortBy}`
        );
        setReviews(response.data.content);
        setLoading(false);
      } catch (err) {
        console.error("리뷰 불러오기 실패:", err);
        setError("리뷰를 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchReviews();
  }, [sortBy]);

  const toggleDropdown = (reviewId) => {
    setActiveDropdown(activeDropdown === reviewId ? null : reviewId);
  };

  const handleShowAllReviews = () => {
    setShowAllReviews(true);
  };

  const handleBackToSummary = () => {
    setShowAllReviews(false);
  };

  // 상태 텍스트 매핑 객체
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

  // 상태값 숫자 → 텍스트 변환 함수 (간단하게 하나로)
  const getStatusText = (type, value) => {
    return statusTextMap[type][value] || "정보 없음";
  };

  if (loading) return <div>리뷰를 불러오는 중...</div>;
  if (error) return <div>{error}</div>;
  if (showAllReviews) return <ReviewAllPage onBack={handleBackToSummary} />;

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>후원자 리뷰</h2>
          <p className={styles.subtitle}>총 {reviews.length}개의 리뷰</p>
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

      {/* 리뷰 목록 */}
      <div className={styles.reviewList}>
        {reviews.map((review) => (
          <div key={review.reviewNo} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <div className={styles.authorInfo}>
                {/* 아바타 이미지 영역 - 필요 없으면 주석 처리 */}
                {/*
                <div className={styles.avatar}>
                  <img
                    src={review.author?.avatar || "/placeholder.svg"}
                    alt="프로필"
                  />
                </div>
                */}
                <div className={styles.authorDetails}>
                  <span className={styles.authorName}>
                    {review.userNickname || "익명"}
                  </span>
                  <span className={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
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
              {/* 상태 텍스트 태그 */}
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
              {review.images?.length > 0 && (
                <div className={styles.imageContainer}>
                  {review.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`리뷰 이미지 ${i + 1}`}
                      className={styles.reviewImage}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className={styles.reviewActions}>
              <div className={styles.helpfulButtons}>
                <button className={styles.helpfulButton}>
                  <ThumbsUp size={16} />
                  <span>도움됨 {review.rewardStatus}</span>
                </button>
                <button className={styles.helpfulButton}>
                  <ThumbsDown size={16} />
                  <span>{review.unhelpful || 0}</span>
                </button>
              </div>
              <button className={styles.replyButton}>
                <MessageCircle size={16} />
                <span>답글</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.loadMoreContainer}>
        <button
          className={styles.loadMoreButton}
          onClick={handleShowAllReviews}
        >
          리뷰 전체보기
        </button>
      </div>
    </div>
  );
}
