"use client";

import Header from "@/components/header/Header";
import Image from "next/image";
import React, { useState, useEffect } from "react"; // 개선점: useEffect 추가
import styles from "./login.module.css";
import api from "../api/axios"; // API 인스턴스 사용

export default function LoginPage() {
  // 폼 상태 관리 - 사용자 입력값 저장
  const [form, setForm] = useState({
    userId: "",
    password: "",
  });

  // 로딩 상태 관리 - 중복 제출 방지
  const [loading, setLoading] = useState(false);

  // 에러 메시지 상태 관리
  const [errorMsg, setErrorMsg] = useState("");

  // 개선점: URL 파라미터에서 리다이렉트 경로 가져오기
  const [redirectPath, setRedirectPath] = useState("http://localhost:3000");

  // 모달 상태 추가
  const [modalMsg, setModalMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalReload, setModalReload] = useState(false); // 새로고침 여부

  // 컴포넌트 마운트 시 URL 파라미터 확인
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get("redirect");
      if (redirect) {
        setRedirectPath(redirect);
      }
    }
  }, []);

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value })); // 이전 상태를 유지하면서 특정 필드만 업데이트
    setErrorMsg(""); // 입력 시 에러 메시지 초기화 (사용자 경험 개선)
  };

  // 개선점: 엔터키로 로그인 가능하게 개선
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit(e);
    }
  };

  // 로그인 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    // 입력값 유효성 검사 추가
    if (!form.userId.trim()) {
      setModalMsg("아이디를 입력해 주세요.");
      setShowModal(true);
      return;
    }
    if (!form.password.trim()) {
      setModalMsg("비밀번호를 입력해 주세요.");
      setShowModal(true);
      return;
    }

    setLoading(true); // 로딩 상태 활성화
    setErrorMsg(""); // 에러 메시지 초기화

    try {
      // API 서버에 로그인 요청
      const response = await api.post("/api/register/login", {
        userId: form.userId,
        password: form.password,
      });

      // 응답에서 토큰 추출 및 저장
      if (response.data && response.data.accessToken) {
        sessionStorage.setItem("accessToken", response.data.accessToken);
      }
      if (response.data && response.data.refreshToken) {
        sessionStorage.setItem("refreshToken", response.data.refreshToken);
      }

      // 로그인 성공 시 사용자에게 피드백 제공
      console.log("로그인 성공:", response.data);

      // 리다이렉트 경로로 이동
      window.location.href = redirectPath;
    } catch (err) {
      console.log("에러 상세:", err.response); // 디버깅용
      console.log("에러 상태:", err.response?.status); // 상태 코드 확인
      console.log("에러 메시지:", err.message); // 에러 메시지 확인
      console.log("전체 에러 객체:", err); // 전체 에러 객체 확인

      // 로그인 실패 시 토큰 삭제
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");

      if (err.response?.status === 403) {
        setModalMsg(
          "이미 회원탈퇴 처리된 계정입니다.\n이용 문의: choseokgeun@gmail.com"
        );
        setShowModal(true);
        setModalReload(true); // 새로고침 O
      } else if (err.response?.status === 401) {
        setModalMsg(
          "등록되지 않은 아이디이거나 아이디 또는 비밀번호를 잘못 입력했습니다. 새로고침 후 다시 이용해 주세요."
        );
        setShowModal(true);
        setModalReload(true); // 새로고침 O
      } else {
        setModalMsg(
          "등록되지 않은 아이디이거나 아이디 또는 비밀번호를 잘못 입력했습니다. 새로고침 후 다시 이용해 주세요."
        );
        setShowModal(true);
        setModalReload(true); // 기타 에러만 새로고침
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* 좌측 로그인 박스 */}
      <div className={styles.leftPanel}>
        {/* 🔥 좌측 상단 로고 고정 */}
        <div className={styles.logoContainer}></div>

        <div className={styles.loginBox}>
          {/* 로그인 설명 텍스트 */}
          <div className={styles.description}>
            간편하게 로그인하고 <br />
            <b>세상에 하나뿐인</b>
            <br />
            <b>특별한 프로젝트를 발견해보세요</b>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit}>
            {/* 아이디 입력 필드 */}
            <input
              name="userId"
              value={form.userId}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              placeholder="아이디"
              className={styles.input}
              disabled={loading} // 로딩 중 입력 방지
              autoComplete="username"
            />

            {/* 비밀번호 입력 필드 */}
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              placeholder="비밀번호"
              className={styles.input}
              disabled={loading} // 로딩 중 입력 방지
              autoComplete="current-password"
            />
            {/* 로그인 버튼 */}
            <button
              type="submit"
              className={styles.kakaoButton}
              disabled={loading} // 로딩 중 버튼 비활성화
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* 회원가입 링크 */}
          <div className={styles.signup}>
            아직 펀디 계정이 없으신가요?{" "}
            <a
              href="/seokgeun/register"
              style={{ textDecoration: "underline", color: "#007bff" }}
            >
              회원가입
            </a>
          </div>
        </div>
      </div>

      {/* 우측 배경 이미지 */}
      <div
        className={styles.rightPanel}
        style={{
          backgroundImage: 'url("/login_register/login_register_image_2.jpg")',
        }}
      />

      {/* 모달 */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <p style={{ whiteSpace: "pre-line" }}>
                {modalMsg
                  .replace(/https?:\/\/[^\s]+/g, "")
                  .replace(/localhost:\d+/g, "")
                  .trim()}
              </p>
              <button
                className={styles.modalButton}
                onClick={() => {
                  setShowModal(false);
                  setLoading(false); // 모달 닫을 때 로딩 해제
                  if (modalReload) window.location.reload();
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
