"use client";
import { useState } from "react";
import ReviewForm from "./ReviewForm";
import styles from "./page.module.css";

const Page = () => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("write");

  const projects = [
    {
      id: 1,
      image: "/placeholder.svg?height=120&width=120",
      title: "[구인] 네이버웹툰 <마루는 강쥐> 나랑 살 언니 찾습니다",
      subtitle: "고백자 SET(x1)",
      price: "24,000원",
      deliveryDate: "2025. 06. 24 신청 접수 완료",
      registrationDate: "결제완료일 2023. 06. 05",
      viewCount: "후원인수 6712611",
    },
  ];

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
            <p>2건의 프로젝트가 후원자님의 리뷰를 기다리고 있어요 📝</p>
          </div>
        </div>

        <div>
          {projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectContent}>
                <img
                  src={project.image}
                  alt={project.title}
                  className={styles.projectImage}
                />
                <div className={styles.projectInfo}>
                  <div className={styles.meta}>
                    <span>{project.registrationDate}</span>
                    <span>{project.viewCount}</span>
                  </div>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectSubtitle}>{project.subtitle}</p>
                  <div className={styles.priceInfo}>
                    <span className={styles.price}>{project.price}</span>
                    <span className={styles.delivery}>
                      {project.deliveryDate}
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

        {activeTab === "written" && (
          <div className={styles.emptyState}>
            <p>작성한 후기가 없습니다.</p>
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
