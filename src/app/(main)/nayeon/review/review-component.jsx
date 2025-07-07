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
            <option value="helpful">도움순</option>
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
                <div className={styles.avatar}>
                  <img
                    src={review.author?.avatar || "/placeholder.svg"}
                    alt="프로필"
                  />
                </div>
                <div className={styles.authorDetails}>
                  <span className={styles.authorName}>
                    {review.author?.name}
                  </span>
                  <span className={styles.reviewDate}>{review.date}</span>
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
              {/* 태그 */}
              {review.tags?.length > 0 && (
                <div className={styles.tagContainer}>
                  {review.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
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
                  <span>도움됨 {review.helpful}</span>
                </button>
                <button className={styles.helpfulButton}>
                  <ThumbsDown size={16} />
                  <span>{review.unhelpful}</span>
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
