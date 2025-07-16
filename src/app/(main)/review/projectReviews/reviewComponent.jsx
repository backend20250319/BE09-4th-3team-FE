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
import ReviewForm from "../myReviews/ReviewForm";

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

export default function ReviewComponent({ projectNo }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("latest");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // 수정 모달 열림 상태, 선택된 리뷰 관리
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // 삭제 확인 모달 상태 관리
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 리뷰 작성/수정 폼 열림 상태
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  // 선택된 프로젝트 (리뷰 작성 시 필요)
  const [selectedProject, setSelectedProject] = useState(null);
  // 수정 모드 구분
  const [isEditing, setIsEditing] = useState(false);

  // 토큰이 있을 경우 요청 헤더에 넣기 위한 함수
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const id = getUserIdFromAccessToken();
    setCurrentUserId(id);
  }, []);

  const fetchReviews = async () => {
    if (!projectNo) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/project/${projectNo}?page=0&size=5&sort=${sortBy}`,
        { headers: getAuthHeaders() }
      );
      setReviews(response.data.content);
    } catch (err) {
      setError("리뷰를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [projectNo, sortBy]);

  if (showAllReviews)
    return (
      <ReviewAllPage
        projectNo={projectNo}
        onBack={() => {
          fetchReviews(); // 👈 리뷰 다시 가져오기
          setShowAllReviews(false); // 👈 페이지 닫기
        }}
      />
    );

  const toggleDropdown = (reviewId) => {
    setActiveDropdown(activeDropdown === reviewId ? null : reviewId);
  };

  const handleShowAllReviews = () => {
    setShowAllReviews(true);
  };

  const handleBackToSummary = () => {
    setShowAllReviews(false);
  };

  // 수정 클릭 시 리뷰 선택, 수정 모드 활성화, 폼 열기
  const handleEditClick = (review) => {
    setSelectedReview(review);
    setSelectedProject({
      projectNo: review.projectNo,
      title: review.projectTitle,
      thumbnailUrl: review.projectThumbnailUrl,
      creatorName: review.creatorName,
    });
    setIsEditing(true);
    setIsReviewFormOpen(true);
    setActiveDropdown(null);
  };

  // *** 추가된 함수: 리뷰 작성 버튼 클릭 시
  const handleWriteReviewClick = (project) => {
    setSelectedProject(project);
    setSelectedReview(null);
    setIsEditing(false);
    setIsReviewFormOpen(true);
  };

  // 추가된 함수: 리뷰 작성/수정 폼 닫기
  const handleReviewFormClose = () => {
    setIsReviewFormOpen(false);
    setSelectedReview(null);
    setSelectedProject(null);
    setIsEditing(false);
  };

  // 추가된 함수: 리뷰 작성/수정 폼 제출 핸들러
  const handleReviewSubmit = async (reviewData) => {
    try {
      if (isEditing && selectedReview) {
        // 수정 API 호출
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/${selectedReview.reviewNo}`,
          reviewData,
          { headers: getAuthHeaders() }
        );
        console.log("수정 응답 데이터:", response.data);
        setReviews((prev) =>
          prev.map((r) =>
            r.reviewNo === selectedReview.reviewNo
              ? {
                  ...r,
                  ...response.data.after,
                  rewardStatus: Number(response.data.after.rewardStatus),
                  planStatus: Number(response.data.after.planStatus),
                  commStatus: Number(response.data.after.commStatus),
                }
              : r
          )
        );
      } else {
        // 새 리뷰 작성 API 호출
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews`,
          reviewData,
          { headers: getAuthHeaders() }
        );
        console.log("새 리뷰 응답 데이터:", response.data);
        setReviews((prev) => [response.data, ...prev]);
      }
      handleReviewFormClose();
    } catch (err) {
      alert(
        isEditing ? "리뷰 수정에 실패했습니다." : "리뷰 작성에 실패했습니다."
      );
      console.error(err);
    }
  };

  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setIsDeleteModalOpen(true);
    setActiveDropdown(null);
  };

  // 삭제 확인 모달 닫기
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedReview(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:8888/reviews/${selectedReview.reviewNo}`,
        { headers: getAuthHeaders() }
      );

      // 삭제된 리뷰를 리스트에서 제거
      setReviews((prev) =>
        prev.filter((r) => r.reviewNo !== selectedReview.reviewNo)
      );

      closeDeleteModal();
    } catch (err) {
      alert("리뷰 삭제에 실패했습니다.");
      console.error(err);
    }
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
  if (showAllReviews)
    return <ReviewAllPage projectNo={projectNo} onBack={handleBackToSummary} />;

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
        {reviews.length === 0 ? (
          <div className={styles.noReviews}>리뷰가 없습니다.</div>
        ) : (
          reviews.map((review) => {
            return (
              <div key={review.reviewNo} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.authorInfo}>
                    {/* 아바타 이미지 영역 */}
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
                    {String(currentUserId).trim() ===
                      String(review.userId).trim() && (
                      <button
                        className={styles.moreButton}
                        onClick={() => toggleDropdown(review.reviewNo)}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    )}

                    {activeDropdown === review.reviewNo &&
                      String(currentUserId).trim() ===
                        String(review.userId).trim() && (
                        <ul
                          style={
                            {
                              /* 생략 */
                            }
                          }
                        >
                          {/* 수정, 삭제 메뉴 */}
                        </ul>
                      )}
                  </div>
                </div>

                <div className={styles.reviewContent}>
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
              </div>
            );
          })
        )}
      </div>

      {/* 수정 모달(수정/작성 폼) *** 💧 */}
      {isReviewFormOpen && (selectedProject || selectedReview) && (
        <ReviewForm
          project={selectedProject || {}}
          review={isEditing ? selectedReview || {} : null}
          onClose={handleReviewFormClose} // 💧
          onSubmit={handleReviewSubmit} // 💧
          isEditing={isEditing}
        />
      )}

      <div className={styles.loadMoreContainer}>
        <button
          className={styles.loadMoreButton}
          onClick={handleShowAllReviews}
        >
          리뷰 전체보기
        </button>
      </div>

      {isDeleteModalOpen && selectedReview && (
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
          onClick={closeDeleteModal} // 모달 바깥 클릭 시 닫기
        >
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              padding: 0,
              maxWidth: "400px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()} // 내부 클릭 시 모달 닫히지 않도록
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
                onClick={closeDeleteModal}
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
    </div>
  );
}
