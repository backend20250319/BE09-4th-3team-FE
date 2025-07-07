"use client";
import { useEffect, useState } from "react";
import ReviewForm from "./ReviewForm";
import styles from "./page.module.css";
import axios from "axios"; // ✅ axios 사용
import { MoreHorizontal } from "lucide-react";

const Page = () => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("write");
  const [projects, setProjects] = useState([]);
  const [writtenReviews, setWrittenReviews] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
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

  // 후기 작성 완료 처리
  const handleReviewSubmit = (newReview) => {
    setIsReviewFormOpen(false);
    setShowSuccessModal(true);
    // 작성한 후기 목록에 새 후기 추가
    setWrittenReviews((prev) => [newReview, ...prev]);
  };

  // 성공 모달 닫기
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setActiveTab("written"); // 작성한 후기 탭으로 이동
  };

  // 더보기 메뉴 토글
  const toggleDropdown = (reviewNo) => {
    setActiveDropdown(activeDropdown === reviewNo ? null : reviewNo);
  };

  // 후기 삭제 확인 모달 열기
  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setShowDeleteModal(true);
    setActiveDropdown(null);
  };

  // 후기 삭제 실행
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:8888/reviews/${selectedReview.reviewNo}`
      );
      setWrittenReviews((prev) =>
        prev.filter((review) => review.reviewNo !== selectedReview.reviewNo)
      );
      setShowDeleteModal(false);
      setSelectedReview(null);
    } catch (err) {
      console.error("후기 삭제 실패", err);
    }
  };

  // 후기 삭제 취소
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedReview(null);
  };

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
                <div
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    marginBottom: "16px",
                    fontWeight: "500",
                  }}
                >
                  {writtenReviews.length}개의 후기
                </div>
                {writtenReviews.map((review) => (
                  <div
                    key={review.reviewNo}
                    style={{
                      background: "white",
                      border: "1px solid #f0f0f0",
                      borderRadius: "8px",
                      padding: "20px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      {/* 프로젝트 이미지 */}
                      <img
                        src="/placeholder.svg?height=60&width=60"
                        alt="프로젝트 이미지"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />

                      {/* 후기 내용 */}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "8px",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: "14px",
                                color: "#666",
                                marginBottom: "4px",
                              }}
                            >
                              네이버웹툰
                            </div>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#333",
                                lineHeight: "1.4",
                              }}
                            >
                              {review.projectTitle}
                            </div>
                          </div>

                          {/* 더보기 메뉴 */}
                          <div style={{ position: "relative" }}>
                            <button
                              onClick={() => toggleDropdown(review.reviewNo)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px",
                                borderRadius: "4px",
                                color: "#999",
                              }}
                            >
                              <MoreHorizontal size={16} />
                            </button>
                            {activeDropdown === review.reviewNo && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "100%",
                                  right: "0",
                                  background: "white",
                                  border: "1px solid #e0e0e0",
                                  borderRadius: "8px",
                                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                  zIndex: 10,
                                  minWidth: "80px",
                                }}
                              >
                                <button
                                  onClick={() => console.log("수정 클릭")}
                                  style={{
                                    display: "block",
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "none",
                                    background: "none",
                                    textAlign: "left",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    color: "#333",
                                  }}
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(review)}
                                  style={{
                                    display: "block",
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "none",
                                    background: "none",
                                    textAlign: "left",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    color: "#333",
                                  }}
                                >
                                  삭제
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 평가 태그들 */}
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            marginBottom: "12px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              background: "#f8f9fa",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              border: "1px solid #e9ecef",
                            }}
                          >
                            프로젝트 만족해요
                          </span>
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              background: "#f8f9fa",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              border: "1px solid #e9ecef",
                            }}
                          >
                            계획 준수 잘 지켰어요
                          </span>
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              background: "#f8f9fa",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              border: "1px solid #e9ecef",
                            }}
                          >
                            소통 친절했어요
                          </span>
                        </div>

                        {/* 후기 텍스트 */}
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#333",
                            lineHeight: "1.5",
                            marginBottom: "12px",
                          }}
                        >
                          {review.content}
                        </div>

                        {/* 하단 정보 */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#999",
                            }}
                          >
                            {new Date(
                              review.createdDate
                            ).toLocaleDateString() ===
                            new Date().toLocaleDateString()
                              ? "1초 전"
                              : new Date(
                                  review.createdDate
                                ).toLocaleDateString()}
                          </span>

                          {/* 좋아요/싫어요 버튼 */}
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                            }}
                          >
                            <button
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px",
                                color: "#999",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              👍
                            </button>
                            <button
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px",
                                color: "#999",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              👎
                            </button>
                          </div>
                        </div>
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
          onSubmit={handleReviewSubmit}
        />
      )}

      {/* 후기 등록 완료 모달 */}
      {showSuccessModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "0",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <div
              style={{
                padding: "24px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "1.5",
                  margin: "0 0 20px 0",
                  color: "#333",
                }}
              >
                후기 등록이 완료되었습니다.
                <br />
                다른 후원자들에게 힘이 되는 후기가 될 거에요.
              </p>
              <button
                onClick={handleSuccessModalClose}
                style={{
                  backgroundColor: "#ff6b35",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  minWidth: "80px",
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 후기 삭제 확인 모달 */}
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "0",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <div
              style={{
                padding: "24px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "1.5",
                  margin: "0 0 20px 0",
                  color: "#333",
                }}
              >
                작성한 후기를 삭제하시겠습니까?
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={handleDeleteCancel}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    minWidth: "80px",
                    border: "none",
                    backgroundColor: "#f5f5f5",
                    color: "#333",
                  }}
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    minWidth: "80px",
                    border: "none",
                    backgroundColor: "#ff6b35",
                    color: "white",
                  }}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
