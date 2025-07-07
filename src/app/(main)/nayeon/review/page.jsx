"use client";

import { useEffect, useState } from "react";
import ReviewForm from "./ReviewForm";
import styles from "./page.module.css";
import axios from "axios"; // ✅ axios 사용

const Page = () => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("write");
  const [projects, setProjects] = useState([]);
  const [writtenReviews, setWrittenReviews] = useState([]);
  const userNo = 8; // 임시 하드코딩

  // ✅ 후기 작성 가능한 프로젝트 불러오기
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8888/reviews/writable?userNo=${userNo}`
        );
        setProjects(response.data);
      } catch (err) {
        console.error("리뷰 작성 가능 프로젝트 불러오기 실패", err);
      }
    };

    fetchProjects();
  }, []);

  // ✅ 작성한 후기 불러오기
  useEffect(() => {
    const fetchWrittenReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8888/reviews/written?userNo=${userNo}`
        );
        setWrittenReviews(response.data);
      } catch (err) {
        console.error("작성한 후기 불러오기 실패", err);
      }
    };

    if (activeTab === "written") {
      fetchWrittenReviews();
    }
  }, [activeTab]);

  return (
    <div>
      <div className={styles.container}>
        <h1 className={styles.title}>내 후기</h1>

        <div className={styles.tabs}>
          <button
            onClick={() => setActiveTab("write")}
            className={`${styles.tabButton} ${
              activeTab === "write" ? styles.activeTab : ""
            }`}
          >
            후기 작성
          </button>
          <button
            onClick={() => setActiveTab("written")}
            className={`${styles.tabButton} ${
              activeTab === "written" ? styles.activeTab : ""
            }`}
          >
            작성한 후기
          </button>
        </div>

        {/* 후기 작성 탭 */}
        {activeTab === "write" && (
          <>
            <div className={styles.alert}>
              <svg
                className={styles.alertIcon}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className={styles.alertText}>
                <p>
                  {projects.length}건의 프로젝트가 후원자님의 리뷰를 기다리고
                  있어요 📝
                </p>
              </div>
            </div>

            <div>
              {projects.map((project) => (
                <div key={project.projectNo} className={styles.projectCard}>
                  <div className={styles.projectContent}>
                    <img
                      src={project.thumbnailUrl || "/placeholder.svg"}
                      alt={project.title}
                      className={styles.projectImage}
                    />
                    <div className={styles.projectInfo}>
                      <div className={styles.meta}>
                        <span>{project.endDate}</span>
                      </div>
                      <h3 className={styles.projectTitle}>{project.title}</h3>
                      <p className={styles.projectSubtitle}>
                        {project.rewardName}
                      </p>
                      <div className={styles.priceInfo}>
                        <span className={styles.price}>
                          {project.priceText}
                        </span>
                        <span className={styles.delivery}>
                          마감일: {project.endDate}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsReviewFormOpen(true)}
                      className={styles.reviewButton}
                    >
                      후기 작성
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 작성한 후기 탭 */}
        {activeTab === "written" && (
          <div>
            {writtenReviews.length === 0 ? (
              <div className={styles.emptyState}>
                <p>작성한 후기가 없습니다.</p>
              </div>
            ) : (
              <div>
                {writtenReviews.map((review) => (
                  <div key={review.reviewNo} className={styles.reviewCard}>
                    <div className={styles.reviewContent}>
                      <div className={styles.reviewHeader}>
                        <h3 className={styles.reviewTitle}>
                          {review.projectTitle}
                        </h3>
                        <span className={styles.reviewDate}>
                          {new Date(review.createdDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`${styles.star} ${
                              i < review.rating
                                ? styles.filledStar
                                : styles.emptyStar
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className={styles.reviewText}>{review.content}</p>
                      <div className={styles.reviewActions}>
                        <button className={styles.editButton}>후기 수정</button>
                        <button className={styles.deleteButton}>
                          후기 삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isReviewFormOpen && (
        <ReviewForm
          isOpen={isReviewFormOpen}
          onClose={() => setIsReviewFormOpen(false)}
        />
      )}
    </div>
  );
};

export default Page;
