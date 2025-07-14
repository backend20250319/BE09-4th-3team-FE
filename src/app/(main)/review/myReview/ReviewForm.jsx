"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import styles from "./reviewForm.module.css";

const satisfactionMap = {
  bad: 1,
  neutral: 2,
  good: 3,
};

const ReviewForm = ({ project, onClose, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [ratings, setRatings] = useState({
    quality: null,
    plan: null,
    communication: null,
  });
  const [reviewText, setReviewText] = useState("");
  const [images, setImages] = useState([]);

  // 닫기 버튼 클릭 시 모달 표시
  const handleCloseClick = () => setShowExitModal(true);

  // 모달에서 '나가기' 클릭 시
  const handleExit = () => {
    setShowExitModal(false);
    onClose();
  };

  // 모달에서 '취소' 클릭 시
  const handleCancel = () => setShowExitModal(false);

  // 평점 변경
  const handleRatingChange = (category, value) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  // 이미지 선택 시
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (images.length + selectedFiles.length > 10) {
      alert("최대 10개까지 업로드 가능합니다.");
      return;
    }

    setImages((prev) => [...prev, ...selectedFiles]);
  };

  // 이미지 삭제
  const handleImageRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 유효성 검사
  const isFormValid = () =>
    ratings.quality &&
    ratings.plan &&
    ratings.communication &&
    reviewText.length >= 20;

  // 제출 조건
  const handleSubmit = () => {
    if (!isFormValid()) {
      alert("모든 평점과 후기를 올바르게 작성해주세요.");
      return;
    }
    onSubmit({
      projectNo: project.projectNo,
      rewardStatus: satisfactionMap[ratings.quality],
      planStatus: satisfactionMap[ratings.plan],
      commStatus: satisfactionMap[ratings.communication],
      content: reviewText,
    });
  };

  const SmileyButton = ({ type, isSelected, onClick, label }) => {
    const getSmileyIcon = () => {
      if (type === "bad") {
        return (
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.0839844 18C0.0839844 8.10488 8.10555 0.083313 18.0007 0.083313C27.8958 0.083313 35.9173 8.10488 35.9173 18C35.9173 27.8951 27.8958 35.9166 18.0007 35.9166C8.10555 35.9166 0.0839844 27.8951 0.0839844 18ZM18.0007 2.58331C9.48626 2.58331 2.58398 9.48559 2.58398 18C2.58398 26.5144 9.48626 33.4166 18.0007 33.4166C26.515 33.4166 33.4173 26.5144 33.4173 18C33.4173 9.48559 26.515 2.58331 18.0007 2.58331ZM13.1676 16.6667C13.9961 16.6667 14.6676 15.7713 14.6676 14.6667C14.6676 13.5622 13.9961 12.6667 13.1676 12.6667C12.3392 12.6667 11.6676 13.5622 11.6676 14.6667C11.6676 15.7713 12.3392 16.6667 13.1676 16.6667ZM24.334 14.6667C24.334 15.7713 23.6624 16.6667 22.834 16.6667C22.0056 16.6667 21.334 15.7713 21.334 14.6667C21.334 13.5622 22.0056 12.6667 22.834 12.6667C23.6624 12.6667 24.334 13.5622 24.334 14.6667ZM23.0599 23.3992C22.5766 23.8922 21.7852 23.9 21.2922 23.4167L21.28 23.4047C20.8103 22.9441 19.9572 22.1074 18.0007 22.1074C16.0441 22.1074 15.191 22.9441 14.7213 23.4047L14.7091 23.4167C14.2161 23.9 13.4247 23.8922 12.9414 23.3992C12.4581 22.9062 12.4659 22.1148 12.9589 21.6315C13.6251 20.9783 15.0743 19.6074 18.0007 19.6074C20.927 19.6074 22.3762 20.9783 23.0424 21.6315C23.5354 22.1148 23.5432 22.9062 23.0599 23.3992Z"
              fill={isSelected ? "#FF6B6B" : "#D0D0D0"}
            />
          </svg>
        );
      } else if (type === "neutral") {
        return (
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.0839844 18C0.0839844 8.10488 8.10555 0.083313 18.0007 0.083313C27.8958 0.083313 35.9173 8.10488 35.9173 18C35.9173 27.8951 27.8958 35.9166 18.0007 35.9166C8.10555 35.9166 0.0839844 27.8951 0.0839844 18ZM18.0007 2.58331C9.48626 2.58331 2.58398 9.48559 2.58398 18C2.58398 26.5144 9.48626 33.4166 18.0007 33.4166C26.515 33.4166 33.4173 26.5144 33.4173 18C33.4173 9.48559 26.515 2.58331 18.0007 2.58331ZM13.1676 16.6667C13.9961 16.6667 14.6676 15.7713 14.6676 14.6667C14.6676 13.5622 13.9961 12.6667 13.1676 12.6667C12.3392 12.6667 11.6676 13.5622 11.6676 14.6667C11.6676 15.7713 12.3392 16.6667 13.1676 16.6667ZM24.334 14.6667C24.334 15.7713 23.6624 16.6667 22.834 16.6667C22.0056 16.6667 21.334 15.7713 21.334 14.6667C21.334 13.5622 22.0056 12.6667 22.834 12.6667C23.6624 12.6667 24.334 13.5622 24.334 14.6667ZM13.4173 20.5C12.727 20.5 12.1673 21.0596 12.1673 21.75C12.1673 22.4403 12.727 23 13.4173 23H22.584C23.2743 23 23.834 22.4403 23.834 21.75C23.834 21.0596 23.2743 20.5 22.584 20.5H13.4173Z"
              fill={isSelected ? "#FFA500" : "#D0D0D0"}
            />
          </svg>
        );
      } else {
        return (
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.1676 16.6667C13.9961 16.6667 14.6676 15.7713 14.6676 14.6667C14.6676 13.5622 13.9961 12.6667 13.1676 12.6667C12.3392 12.6667 11.6676 13.5622 11.6676 14.6667C11.6676 15.7713 12.3392 16.6667 13.1676 16.6667Z"
              fill={isSelected ? "#4CAF50" : "#D0D0D0"}
            />
            <path
              d="M24.334 14.6667C24.334 15.7713 23.6624 16.6667 22.834 16.6667C22.0056 16.6667 21.334 15.7713 21.334 14.6667C21.334 13.5622 22.0056 12.6667 22.834 12.6667C23.6624 12.6667 24.334 13.5622 24.334 14.6667Z"
              fill={isSelected ? "#4CAF50" : "#D0D0D0"}
            />
            <path
              d="M14.7091 20.1075C14.2161 19.6242 13.4247 19.632 12.9414 20.125C12.4581 20.6179 12.4659 21.4094 12.9589 21.8927C13.6251 22.5458 15.0743 23.9167 18.0007 23.9167C20.927 23.9167 22.3762 22.5458 23.0424 21.8927C23.5354 21.4094 23.5432 20.6179 23.0599 20.125C22.5766 19.632 21.7852 19.6242 21.2922 20.1075L21.28 20.1194C20.8103 20.5801 19.9572 21.4167 18.0007 21.4167C16.0441 21.4167 15.191 20.5801 14.7213 20.1194L14.7091 20.1075Z"
              fill={isSelected ? "#4CAF50" : "#D0D0D0"}
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.0007 0.083313C8.10555 0.083313 0.0839844 8.10488 0.0839844 18C0.0839844 27.8951 8.10555 35.9166 18.0007 35.9166C27.8958 35.9166 35.9173 27.8951 35.9173 18C35.9173 8.10488 27.8958 0.083313 18.0007 0.083313ZM2.58398 18C2.58398 9.48559 9.48626 2.58331 18.0007 2.58331C26.515 2.58331 33.4173 9.48559 33.4173 18C33.4173 26.5144 26.515 33.4166 18.0007 33.4166C9.48626 33.4166 2.58398 26.5144 2.58398 18Z"
              fill={isSelected ? "#4CAF50" : "#D0D0D0"}
            />
          </svg>
        );
      }
    };

    return (
      <div
        className={`${styles.smileyButton} ${
          isSelected ? styles.selected : ""
        }`}
        onClick={onClick}
      >
        <div className={styles.smileyIcon}>{getSmileyIcon()}</div>
        <div
          className={`${styles.smileyLabel} ${
            isSelected ? styles.labelSelected : ""
          }`}
        >
          {label}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.modal}>
          {/* Header */}
          <div className={styles.header}>
            <h2 className={styles.title}>후기 작성하기</h2>
            <button className={styles.closeButton} onClick={handleCloseClick}>
              <X size={20} />
            </button>
          </div>
          <div className={styles.content}>
            {/* Project Info */}
            <div className={styles.projectInfo}>
              <img
                src={project.thumbnailUrl || "/images"}
                alt={project.title || "Project Cover"}
                className={styles.projectImage}
              />
              <div>
                <div className={styles.projectCreator}>
                  {project.creatorName}
                </div>
                <div className={styles.projectTitle}>{project.title}</div>
              </div>
            </div>
            {/* Rating Questions */}
            <div className={styles.ratingsSection}>
              {/* Quality Rating */}
              <div className={styles.ratingQuestion}>
                <h3 className={styles.questionTitle}>
                  프로젝트 리워드 퀄리티가 좋았나요?
                </h3>
                <div className={styles.smileyContainer}>
                  <SmileyButton
                    type="bad"
                    isSelected={ratings.quality === "bad"}
                    onClick={() => handleRatingChange("quality", "bad")}
                    label="아쉬워요"
                  />
                  <SmileyButton
                    type="neutral"
                    isSelected={ratings.quality === "neutral"}
                    onClick={() => handleRatingChange("quality", "neutral")}
                    label="보통이에요"
                  />
                  <SmileyButton
                    type="good"
                    isSelected={ratings.quality === "good"}
                    onClick={() => handleRatingChange("quality", "good")}
                    label="만족해요"
                  />
                </div>
              </div>
              {/* Plan Rating */}
              <div className={styles.ratingQuestion}>
                <h3 className={styles.questionTitle}>
                  창작자는 프로젝트 계획을 잘 지켰나요?
                </h3>
                <div className={styles.smileyContainer}>
                  <SmileyButton
                    type="bad"
                    isSelected={ratings.plan === "bad"}
                    onClick={() => handleRatingChange("plan", "bad")}
                    label="아쉬워요"
                  />
                  <SmileyButton
                    type="neutral"
                    isSelected={ratings.plan === "neutral"}
                    onClick={() => handleRatingChange("plan", "neutral")}
                    label="보통이에요"
                  />
                  <SmileyButton
                    type="good"
                    isSelected={ratings.plan === "good"}
                    onClick={() => handleRatingChange("plan", "good")}
                    label="잘 지켰어요"
                  />
                </div>
              </div>
              {/* Communication Rating */}
              <div className={styles.ratingQuestion}>
                <h3 className={styles.questionTitle}>
                  창작자와 소통이 잘 되고 친절했나요?
                </h3>
                <div className={styles.smileyContainer}>
                  <SmileyButton
                    type="bad"
                    isSelected={ratings.communication === "bad"}
                    onClick={() => handleRatingChange("communication", "bad")}
                    label="아쉬워요"
                  />
                  <SmileyButton
                    type="neutral"
                    isSelected={ratings.communication === "neutral"}
                    onClick={() =>
                      handleRatingChange("communication", "neutral")
                    }
                    label="보통이에요"
                  />
                  <SmileyButton
                    type="good"
                    isSelected={ratings.communication === "good"}
                    onClick={() => handleRatingChange("communication", "good")}
                    label="친절했어요"
                  />
                </div>
              </div>
            </div>
            {/* Review Text */}
            <div className={styles.reviewTextSection}>
              <h3 className={`${styles.questionTitle} ${styles.leftAlign}`}>
                후원 후기를 남겨주세요
              </h3>
              <p className={styles.reviewDescription}>
                후원 후기는 창작자 뿐만 아니라 다른 후원자에게도 큰 도움이
                됩니다.
              </p>
              <div className={styles.textareaContainer}>
                <textarea
                  className={styles.textarea}
                  rows="4"
                  placeholder="창작자의 새로운 시도를 응원하는 따뜻한 후기는 창작자에게 큰 도움이 됩니다."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  maxLength={1000}
                />
                <div className={styles.textareaFooter}>
                  <span
                    className={`${styles.minLength} ${
                      reviewText.length < 20 ? styles.minLengthError : ""
                    }`}
                  >
                    최소 20자이상 입력해 주세요
                  </span>
                  <span className={styles.charCount}>
                    {reviewText.length}/1000
                  </span>
                </div>
              </div>
            </div>
            {/* Image Upload */}
            <div className={styles.imageUploadSection}>
              <label className={styles.uploadLabel}>
                <div className={styles.uploadArea}>
                  <Upload className={styles.uploadIcon} size={24} />
                  <div className={styles.uploadTitle}>
                    이미지 업로드 (선택) ({images.length}/10)
                  </div>
                  <div className={styles.uploadInfo}>
                    <p>· 최대 10개까지 업로드 가능</p>
                    <p>· 파일 형식: jpg 또는 png 또는 jpeg 또는 gif</p>
                  </div>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/jpg, image/gif"
                  className={styles.hiddenInput}
                  onChange={handleImageChange}
                />
              </label>
              {/* 이미지 미리보기 */}
              <div className={styles.imagePreviewContainer}>
                {images.map((img, idx) => (
                  <div key={idx} className={styles.imagePreview}>
                    <img
                      src={URL.createObjectURL(img) || "/placeholder.svg"}
                      alt={`upload-${idx}`}
                      className={styles.previewImg}
                    />
                    <button
                      className={styles.removeImageButton}
                      onClick={() => handleImageRemove(idx)}
                      type="button"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Guidelines */}
            <div className={styles.guidelines}>
              <h4 className={styles.guidelineTitle}>
                프로젝트 후기 작성 가이드라인
              </h4>
              <ul className={styles.guidelineList}>
                <li>
                  • 텀블벅은 창작자의 새로운 시도를 응원하고, 개선점이 있다면
                  솔직하게 피드백하는 후기 문화를 만들어가고자 합니다.
                </li>
                <li>
                  • 크라우드펀딩의 취지에 대한 이해를 바탕으로 건강하고 따뜻한
                  후기 문화를 만들어갈 수 있도록 도움 주시기를 부탁드립니다.
                </li>
              </ul>
              <h4 className={styles.guidelineTitle}>프로젝트 후기 정책 안내</h4>
              <p className={styles.policyText}>
                *텀블벅은 정보통신망법 44조에 의거하여, 사생활 침해 또는
                명예훼손 등 타인의 권리를 침해하는 행위는 정보통신 서비스
                제공자로서 유통하지 않도록 노력합니다. 운영 정책에 해당하지 않는
                게시물 또는 아래와 같은 경우 블라인드 조치가 이루어질 수
                있습니다.
              </p>
              <ul className={styles.policyList}>
                <li>
                  • 창작자를 포함한 특정 대상에 대한 위협, 모욕, 비방, 개인정보
                  침해의 요소가 포함된 후기
                </li>
                <li>• 욕설, 비속어, 스팸성으로 반복되는 문장이 포함된 후기</li>
                <li>
                  • 사실이 아닌 내용이나 프로젝트 후원 경험과 관계없는 내용 또는
                  사진이 포함된 후기
                </li>
                <li>
                  • 프로젝트에 대한 후기가 아닌 창작자에 대한 문의나 요청으로
                  구성된 후기
                </li>
                <li>• 이용자의 신고가 3건 이상 누적 발생한 후기</li>
              </ul>
            </div>
          </div>
          {/* Footer Button */}
          <div className={styles.footer}>
            <button
              type="button"
              className={`${styles.submitButton} ${
                isFormValid()
                  ? styles.submitButtonEnabled
                  : styles.submitButtonDisabled
              }`}
              disabled={!isFormValid() || isSubmitting}
              onClick={handleSubmit}
            >
              후기 작성 완료
            </button>
          </div>
        </div>
      </div>
      {/* 확인 모달 */}
      {showExitModal && (
        <div className={styles.overlay}>
          <div className={styles.exitModal}>
            <div className={styles.exitModalContent}>
              <p className={styles.exitModalText}>
                프로젝트 후기 작성을 취소하고 나가겠습니까?
              </p>
              <div className={styles.exitModalButtons}>
                <button
                  onClick={handleCancel}
                  className={`${styles.exitModalButton} ${styles.cancelButton}`}
                >
                  취소
                </button>
                <button
                  onClick={handleExit}
                  className={`${styles.exitModalButton} ${styles.exitButton}`}
                >
                  나가기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewForm;
