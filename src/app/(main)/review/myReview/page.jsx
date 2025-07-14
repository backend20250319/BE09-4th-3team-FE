"use client";
import { useEffect, useState } from "react";
import ReviewForm from "./ReviewForm";
import styles from "./page.module.css";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";

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

// 평가 상태를 한글로 변환하는 함수 (숫자 1,2,3 기준)
function getRatingLabel(category, value) {
  const labels = {
    quality: {
      1: "아쉬워요",
      2: "보통이에요",
      3: "만족해요",
    },
    plan: {
      1: "계획 준수 아쉬워요",
      2: "계획 준수 보통이에요",
      3: "계획 준수 잘 지켰어요",
    },
    communication: {
      1: "소통 아쉬워요",
      2: "소통 보통이에요",
      3: "소통 친절했어요",
    },
  };

  const numValue = Number(value);
  if (!numValue || numValue < 1) return "";

  return labels[category]?.[numValue] || "";
}

// 날짜가 오늘인지 체크하는 함수
function isToday(dateStr) {
  const today = new Date();
  const date = new Date(dateStr);
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

const Page = () => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("write");
  const [projects, setProjects] = useState([]);
  const [writtenReviews, setWrittenReviews] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 추가된 부분: 삭제 성공 모달 상태
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);

  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // 토큰 헤더 설정 함수
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 프로젝트 목록 불러오기 (작성 가능 프로젝트)
  const fetchProjects = async () => {
    if (!userId) return;

    try {
      const writableRes = await axios.get(
        `http://localhost:8888/reviews/writable`,
        { headers: getAuthHeaders() }
      );

      setProjects(writableRes.data);
    } catch (err) {
      console.error("리뷰 작성 가능 프로젝트 불러오기 실패", err);
    }
  };

  // 작성한 후기 목록 불러오기
  const fetchWrittenReviews = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(
        `http://localhost:8888/reviews/written`,
        {
          headers: getAuthHeaders(),
        }
      );
      setWrittenReviews(response.data);
    } catch (err) {
      console.error("작성한 후기 불러오기 실패", err);
    }
  };

  useEffect(() => {
    const id = getUserIdFromAccessToken();
    if (id) setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchProjects();
    if (activeTab === "written") fetchWrittenReviews();
  }, [userId, activeTab]);

  // 후기 작성 또는 수정 제출 핸들러
  const handleReviewSubmit = async (reviewData) => {
    try {
      if (isEditing && selectedReview) {
        const response = await axios.put(
          `http://localhost:8888/reviews/${selectedReview.reviewNo}`,
          reviewData,
          { headers: getAuthHeaders() }
        );
        setWrittenReviews((prev) =>
          prev.map((r) =>
            r.reviewNo === selectedReview.reviewNo
              ? response.data.afterUpdate
              : r
          )
        );
      } else {
        const response = await axios.post(
          `http://localhost:8888/reviews`,
          reviewData,
          { headers: getAuthHeaders() }
        );
        setWrittenReviews((prev) => [response.data, ...prev]);
        setProjects((prev) =>
          prev.filter((p) => p.projectNo !== reviewData.projectNo)
        );
      }

      setIsReviewFormOpen(false);
      setSelectedProject(null);
      setSelectedReview(null);
      setIsEditing(false);
      setShowSuccessModal(true);
      setActiveTab("written");
    } catch (err) {
      console.error("후기 등록/수정 실패", err.response || err);
      alert("후기 등록/수정에 실패했습니다.");
    }
  };

  const handleWriteReviewClick = (project) => {
    setSelectedProject(project);
    setSelectedReview(null);
    setIsEditing(false);
    setIsReviewFormOpen(true);
  };

  const handleEditClick = (review) => {
    setSelectedReview(review);
    setSelectedProject({
      projectNo: review.projectNo,
      title: review.projectTitle,
    });
    setIsEditing(true);
    setIsReviewFormOpen(true);
    setActiveDropdown(null);
  };

  const handleReviewFormClose = () => {
    setIsReviewFormOpen(false);
    setSelectedProject(null);
    setSelectedReview(null);
    setIsEditing(false);
  };

  const toggleDropdown = (reviewNo) => {
    setActiveDropdown(activeDropdown === reviewNo ? null : reviewNo);
  };

  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setShowDeleteModal(true);
    setActiveDropdown(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:8888/reviews/${selectedReview.reviewNo}`,
        { headers: getAuthHeaders() }
      );

      setWrittenReviews((prev) =>
        prev.filter((r) => r.reviewNo !== selectedReview.reviewNo)
      );

      await fetchProjects();

      setShowDeleteModal(false);
      setSelectedReview(null);

      // 삭제 완료 모달 띄우기
      setShowDeleteSuccessModal(true);
    } catch (err) {
      console.error("후기 삭제 실패", err.response || err);
      alert("후기 삭제에 실패했습니다.");
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedReview(null);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  // 삭제 완료 모달 닫기 핸들러
  const handleDeleteSuccessModalClose = () => {
    setShowDeleteSuccessModal(false);
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
              {projects.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>후기를 작성할 수 있는 프로젝트가 없습니다.</p>
                </div>
              ) : (
                projects.map((project) => {
                  console.log("개별 project 데이터:", project);

                  return (
                    <div key={project.projectNo} className={styles.projectCard}>
                      <div className={styles.projectContent}>
                        {/* 프로젝트 썸네일 */}
                        <img
                          src={project.thumbnailUrl || "/placeholder.svg"}
                          alt={project.title}
                          className={styles.projectImage}
                        />
                        <div className={styles.projectInfo}>
                          <div className={styles.meta}>
                            {/* 후원 결제일 날짜 */}
                            <span>
                              {project.pledgedAt
                                ? `후원 결제일 ${project.pledgedAt.slice(
                                    0,
                                    10
                                  )}`
                                : "결제일 정보 없음"}
                            </span>
                          </div>
                          {/* 프로젝트 제목 */}
                          <h3 className={styles.projectTitle}>
                            {project.title}
                          </h3>
                          {/* 리워드 제목 */}
                          <p className={styles.projectSubtitle}>
                            {project.rewardSummary || "리워드 정보 없음"}
                          </p>
                          <div className={styles.priceInfo}>
                            {/* 가격은 숫자라 포맷팅이 필요할 수 있음 */}
                            <span className={styles.price}>
                              {project.totalAmount != null
                                ? `${project.totalAmount.toLocaleString()}원`
                                : "가격 정보 없음"}
                            </span>
                            <div className={styles.delivery}>
                              마감일 {project.deadLine}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleWriteReviewClick(project)}
                          className={styles.reviewButton}
                        >
                          후기 작성
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

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
                      <img
                        src={review.projectThumbnailUrl || "/placeholder.svg"}
                        alt="프로젝트 이미지"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
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
                                fontSize: "15px",
                                fontWeight: "700",
                                color: "#333",
                                marginBottom: "4px",
                              }}
                            >
                              {review.projectTitle}
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#999",
                                marginBottom: "4px",
                              }}
                            >
                              {review.createdAt.slice(0, 10)}{" "}
                              {isToday(review.createdAt) ? "(오늘 작성됨)" : ""}
                            </div>
                          </div>
                          <div style={{ position: "relative" }}>
                            <button
                              onClick={() => toggleDropdown(review.reviewNo)}
                              style={{
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                                margin: 0,
                              }}
                            >
                              <MoreHorizontal size={20} />
                            </button>
                            {activeDropdown === review.reviewNo && (
                              <ul
                                style={{
                                  position: "absolute",
                                  top: "24px",
                                  right: 0,
                                  background: "white",
                                  border: "1px solid #ddd",
                                  borderRadius: "4px",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                  padding: "8px 0",
                                  listStyle: "none",
                                  margin: 0,
                                  width: "120px",
                                  zIndex: 100,
                                }}
                              >
                                <li
                                  onClick={() => handleEditClick(review)}
                                  style={{
                                    padding: "8px 16px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    color: "#333",
                                    borderBottom: "1px solid #eee",
                                  }}
                                >
                                  수정
                                </li>
                                <li
                                  onClick={() => handleDeleteClick(review)}
                                  style={{
                                    padding: "8px 16px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    color: "red",
                                  }}
                                >
                                  삭제
                                </li>
                              </ul>
                            )}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#555",
                            whiteSpace: "pre-wrap",
                            marginBottom: "12px",
                          }}
                        >
                          {review.content}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            fontSize: "12px",
                            color: "#666",
                          }}
                        >
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
                              프로젝트{" "}
                              {getRatingLabel("quality", review.rewardStatus)}
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
                              {getRatingLabel("plan", review.planStatus)}
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
                              {getRatingLabel(
                                "communication",
                                review.commStatus
                              )}
                            </span>
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

      {isReviewFormOpen && (selectedProject || selectedReview) && (
        <ReviewForm
          project={selectedProject}
          review={isEditing ? selectedReview : null}
          onClose={handleReviewFormClose}
          onSubmit={handleReviewSubmit}
          isEditing={isEditing}
        />
      )}

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
          onClick={handleSuccessModalClose}
        >
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              padding: 0,
              maxWidth: "400px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
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
                  lineHeight: 1.5,
                  margin: "0 0 20px 0",
                  color: "#333",
                }}
              >
                후기 {isEditing ? "수정" : "등록"}이 완료되었습니다.
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
                  fontWeight: "700",
                  boxShadow: "0 2px 8px rgb(255 107 53 / 0.3)",
                  transition: "background-color 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f03e00")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ff6b35")
                }
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedReview && (
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
          onClick={handleDeleteCancel}
        >
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              padding: 0,
              maxWidth: "400px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
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
                  lineHeight: 1.5,
                  margin: "0 0 20px 0",
                  color: "#333",
                }}
              >
                해당 후기를 삭제하시겠습니까?
              </p>
              <button
                onClick={handleDeleteConfirm}
                style={{
                  backgroundColor: "#ff6b35",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "700",
                  boxShadow: "0 2px 8px rgb(255 107 53 / 0.3)",
                  marginRight: "8px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f03e00")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ff6b35")
                }
              >
                삭제
              </button>
              <button
                onClick={handleDeleteCancel}
                style={{
                  backgroundColor: "#ddd",
                  color: "#666",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "700",
                  boxShadow: "0 2px 8px rgb(0 0 0 / 0.1)",
                  transition: "background-color 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ccc")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ddd")
                }
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 추가된 삭제 성공 모달 */}
      {showDeleteSuccessModal && (
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
          onClick={handleDeleteSuccessModalClose}
        >
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              padding: 0,
              maxWidth: "400px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
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
                  lineHeight: 1.5,
                  margin: "0 0 20px 0",
                  color: "#333",
                }}
              >
                후기 삭제가 완료되었습니다.
                <br />
                다른 후원자들에게 더 나은 경험을 제공해요.
              </p>
              <button
                onClick={handleDeleteSuccessModalClose}
                style={{
                  backgroundColor: "#ff6b35",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "700",
                  boxShadow: "0 2px 8px rgb(255 107 53 / 0.3)",
                  transition: "background-color 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f03e00")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ff6b35")
                }
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
