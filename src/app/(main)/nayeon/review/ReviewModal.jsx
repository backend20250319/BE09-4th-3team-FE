"use client";

import { useState } from "react";
import ReviewForm from "./ReviewForm";
import styles from "./reviewModal.module.css";
import { X } from "lucide-react";

const ReviewModal = () => {
  const [showExitModal, setShowExitModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 후기 작성하기 버튼 클릭 -> 모달 열기
  const openModal = () => {
    setIsVisible(true);
  };

  // 닫기 버튼 클릭 -> 확인 모달 띄우기
  const handleClose = () => {
    console.log("handleClose 호출됨");
    setShowExitModal(true);
  };

  console.log("ProjectReviewModal 렌더링 - handleClose 함수:", handleClose);

  // 확인 모달 '나가기' 클릭 -> 작성 폼 포함 전체 닫기
  const handleExit = () => {
    setShowExitModal(false);
    setIsVisible(false);
  };

  // 확인 모달 '취소' 클릭 -> 확인 모달 닫기
  const handleCancel = () => {
    setShowExitModal(false);
  };

  if (!isVisible) {
    return (
      <button onClick={openModal} className={styles.openButton}>
        후기 작성하기
      </button>
    );
  }

  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2 className={styles.title}>프로젝트 후기 작성</h2>
            <button onClick={handleClose} className={styles.closeButton}>
              <X size={20} />
            </button>
          </div>

          <div className={styles.content}>
            {/* ReviewForm에도 onClose 전달하여 닫기 시 확인 모달 띄움 */}
            <ReviewForm onClose={handleClose} />
          </div>

          <div className={styles.footer}>
            <button className={styles.submitButton}>후기 등록</button>
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

export default ReviewModal;
