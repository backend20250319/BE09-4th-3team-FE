"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import styles from "./ReviewAllPage.module.css";
import ReviewForm from "../myReviews/ReviewForm";

// 토큰에서 userId 추출 함수
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

export default function ReviewAllPage({ onBack, projectNo }) {
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("latest");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // 수정 모달 상태 및 선택된 리뷰
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // 삭제 모달 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 리뷰 작성/수정 폼 열림 상태 및 수정 모드 구분
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 프로젝트 정보 상태 추가
  const [selectedProject, setSelectedProject] = useState(null);

  const reviewsPerPage = 10;
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 상태 텍스트 매핑
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
    return statusTextMap[type]?.[value] || "정보 없음";
  };

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 토큰에서 userId 세팅
  useEffect(() => {
    const id = getUserIdFromAccessToken();
    setCurrentUserId(id);
  }, []);

  // 리뷰 목록 불러오기
  useEffect(() => {
    if (!projectNo) return;

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/project/${projectNo}?page=${page}&size=${reviewsPerPage}&sort=${sortBy}`,
          { headers: getAuthHeaders() }
        );
        setAllReviews(response.data.content);
        setTotalPages(response.data.totalPages); // totalPages 받아오기
      } catch (err) {
        setError("리뷰를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [projectNo, sortBy, page]);

  // 드롭다운 토글 (클릭한 리뷰만 열리고, 다른 건 닫힘)
  const toggleDropdown = (reviewId) => {
    setActiveDropdown(activeDropdown === reviewId ? null : reviewId);
  };

  // 수정 버튼 클릭: 수정 모드 열기, 선택 리뷰 및 프로젝트 세팅, 드롭다운 닫기

  const handleEditClick = (review) => {
    setSelectedReview(review);
    setSelectedProject({
      projectNo: review.projectNo,
      title: review.projectTitle,
      projectNo: review.projectNo,
      title: review.projectTitle,
      creatorName: review.creatorName,
      thumbnailUrl: review.projectThumbnailUrl,
    });
    setIsEditing(true);
    setIsReviewFormOpen(true);
    setActiveDropdown(null);
  };

  // 삭제 버튼 클릭: 삭제 모달 열기, 선택 리뷰 세팅, 드롭다운 닫기
  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setIsDeleteModalOpen(true);
    setActiveDropdown(null);
  };

  // 리뷰 작성 버튼 클릭: 작성 모드 열기, 프로젝트 세팅
  const handleWriteReviewClick = () => {
    setSelectedReview(null);
    setSelectedProject({ projectNo });
    setIsEditing(false);
    setIsReviewFormOpen(true);
  };

  // 수정/작성 폼 닫기
  const handleReviewFormClose = () => {
    setIsReviewFormOpen(false);
    setSelectedReview(null);
    setSelectedProject(null);
    setIsEditing(false);
  };

  // 수정/작성 폼 제출 처리
  const handleReviewSubmit = async (reviewData) => {
    try {
      if (isEditing && selectedReview) {
        // 수정 API 호출
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/${selectedReview?.reviewNo}`,
          reviewData,
          { headers: getAuthHeaders() }
        );
        // 리스트 업데이트
        setAllReviews((prev) =>
          prev.map((r) =>
            r.reviewNo === selectedReview?.reviewNo
              ? {
                  ...r,
                  ...response.data.after,
                  rewardStatus: Number(response.data.after?.rewardStatus),
                  planStatus: Number(response.data.after?.planStatus),
                  commStatus: Number(response.data.after?.commStatus),
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
        setAllReviews((prev) => [response.data, ...prev]);
      }
      handleReviewFormClose();
    } catch (err) {
      alert(
        isEditing ? "리뷰 수정에 실패했습니다." : "리뷰 작성에 실패했습니다."
      );
      console.error(err);
    }
  };

  // 삭제 모달 닫기
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedReview(null);
  };

  // 삭제 확인 버튼 클릭 시 API 호출 및 리스트 갱신
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/${selectedReview?.reviewNo}`,
        { headers: getAuthHeaders() }
      );
      setAllReviews((prev) =>
        prev.filter((r) => r.reviewNo !== selectedReview?.reviewNo)
      );
      closeDeleteModal();
    } catch (err) {
      alert("리뷰 삭제에 실패했습니다.");
      console.error(err);
    }
  };

  if (loading) return <div>전체 리뷰를 불러오는 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <button onClick={onBack} className={styles.backButton}>
            ← 돌아가기
          </button>
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

        <h2 className={styles.title}>전체 리뷰</h2>
        <p className={styles.subtitle}>총 {allReviews?.length ?? 0}개의 리뷰</p>
      </div>

      {/* 리뷰 목록 */}
      <div className={styles.reviewList}>
        {allReviews.length === 0 ? (
          <div className={styles.noReviews}>
            <div className={styles.iconCircle}>
              <svg viewBox="0 0 48 48" className={styles.icon}>
                <path d="M42.1181 14.5537C42.1557 14.5161 42.1544 14.454 42.1154 14.415L33.7715 6.07113C33.7325 6.03207 33.6704 6.03085 33.6329 6.06839L29.6905 10.0107C29.653 10.0483 29.6542 10.1103 29.6933 10.1494L38.0371 18.4933C38.0762 18.5323 38.1383 18.5335 38.1758 18.496L42.1181 14.5537Z" />
                <path d="M36.134 20.5378C36.1715 20.5003 36.1703 20.4382 36.1312 20.3992C36.0922 20.3601 27.7874 12.0553 27.7874 12.0553C27.7483 12.0163 27.6862 12.015 27.6487 12.0526C27.6111 12.0901 9.6289 30.0723 9.6289 30.0723C9.61462 30.0866 9.60538 30.1052 9.6025 30.1255L8.21584 39.856C8.20646 39.9218 8.2647 39.9801 8.33053 39.9707L18.061 38.584C18.0813 38.5811 18.0999 38.5719 18.1142 38.5576C18.1142 38.5576 36.0964 20.5754 36.134 20.5378Z" />
              </svg>
            </div>
            <p className={styles.text}>프로젝트 성공 후 후기를 기대해주세요!</p>
          </div>
        ) : (
          allReviews?.map((review) => (
            <div key={review?.reviewNo} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.authorInfo}>
                  <div className={styles.authorDetails}>
                    <div className={styles.authorName}>
                      <span>{review?.userNickname ?? "익명"}</span>
                    </div>
                    <div className={styles.reviewMeta}>
                      <span className={styles.reviewDate}>
                        {review?.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.moreMenu}>
                  {/* 본인 리뷰일 때만 드롭다운 버튼 노출 */}
                  {String(currentUserId)?.trim() ===
                    String(review?.userId)?.trim() && (
                    <>
                      <button
                        className={styles.moreButton}
                        onClick={() => toggleDropdown(review?.reviewNo)}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {activeDropdown === review?.reviewNo && (
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
                            zIndex: 1000,
                          }}
                        >
                          {[
                            {
                              key: "edit",
                              text: "수정",
                              onClick: () => handleEditClick(review),
                              style: {
                                padding: "8px 16px",
                                cursor: "pointer",
                                fontSize: "14px",
                                color: "#333",
                                borderBottom: "1px solid #eee",
                              },
                            },
                            {
                              key: "delete",
                              text: "삭제",
                              onClick: () => handleDeleteClick(review),
                              style: {
                                padding: "8px 16px",
                                cursor: "pointer",
                                fontSize: "14px",
                                color: "red",
                              },
                            },
                          ].map((item) => (
                            <li
                              key={item.key}
                              onClick={item.onClick}
                              style={item.style}
                            >
                              {item.text}
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className={styles.reviewContent}>
                {/* 상태 텍스트 태그 */}
                <div className={styles.statusTags}>
                  <span className={styles.statusTag}>
                    {getStatusText("rewardStatus", review?.rewardStatus)}
                  </span>
                  <span className={styles.statusTag}>
                    {getStatusText("planStatus", review?.planStatus)}
                  </span>
                  <span className={styles.statusTag}>
                    {getStatusText("commStatus", review?.commStatus)}
                  </span>
                </div>

                <p className={styles.reviewText}>{review?.content}</p>

                {/* 이미지 배열 처리 */}
                {review?.images?.length > 0 && (
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
          ))
        )}
      </div>

      {totalPages >= 1 && (
        <div className={styles.pagination}>
          {/* 이전 버튼: 첫 페이지가 아닐 때만 보임 */}
          {page > 0 && (
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
            >
              &lt;
            </button>
          )}

          {/* 페이지 번호 버튼 */}
          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num}
              className={`${styles.pageBtn} ${
                page === num ? styles.activePageBtn : ""
              }`}
              onClick={() => setPage(num)}
            >
              {num + 1}
            </button>
          ))}

          {/* 다음 버튼: 마지막 페이지가 아닐 때만 보임 */}
          {page < totalPages - 1 && (
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            >
              &gt;
            </button>
          )}
        </div>
      )}

      {/* 수정/작성 모달 */}
      {isReviewFormOpen && (selectedProject || selectedReview) && (
        <ReviewForm
          project={selectedProject || {}}
          review={isEditing ? selectedReview ?? {} : null}
          onClose={handleReviewFormClose}
          onSubmit={handleReviewSubmit}
          isEditing={isEditing}
        />
      )}

      {/* 삭제 확인 모달 */}
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
          onClick={closeDeleteModal}
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
