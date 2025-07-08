"use client";

import Header from "@/components/header/Header";
import Image from "next/image";
import React, { useState, useEffect } from "react"; // 🚀 개선점: useEffect 추가
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

  // 🚀 개선점: URL 파라미터에서 리다이렉트 경로 가져오기
  const [redirectPath, setRedirectPath] = useState("/seokgeun/main");

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

  // 🚀 개선점: 엔터키로 로그인 가능하게 개선
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit(e);
    }
  };

  // 로그인 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    // 🚀 개선점: 입력값 유효성 검사 추가
    if (!form.userId.trim() || !form.password.trim()) {
      setErrorMsg("아이디와 비밀번호를 모두 입력해주세요.");
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
        localStorage.setItem("accessToken", response.data.accessToken);
      }
      if (response.data && response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }

      // 🚀 개선점: 로그인 성공 시 사용자에게 피드백 제공
      console.log("로그인 성공:", response.data);

      // 리다이렉트 경로로 이동
      window.location.href = redirectPath;
    } catch (err) {
      // 에러 처리 - 서버 응답 에러 메시지 또는 기본 메시지 표시
      setErrorMsg(
        err.response?.data?.error ||
          "로그인에 실패했습니다. 아이디/비밀번호를 확인하세요."
      );
      console.error("로그인 에러:", err);
    } finally {
      setLoading(false); // 로딩 상태 비활성화
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
              onKeyPress={handleKeyPress} // 🚀 개선점: 엔터키 지원
              placeholder="아이디"
              className={styles.input}
              disabled={loading} // 로딩 중 입력 방지
              autoComplete="username" // 🚀 개선점: 자동완성 지원
            />

            {/* 비밀번호 입력 필드 */}
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress} // 🚀 개선점: 엔터키 지원
              placeholder="비밀번호"
              className={styles.input}
              disabled={loading} // 로딩 중 입력 방지
              autoComplete="current-password" // 🚀 개선점: 자동완성 지원
            />

            {/* 에러 메시지 출력 */}
            {errorMsg && (
              <div style={{ color: "red", margin: "10px 0", fontSize: "14px" }}>
                {errorMsg}
              </div>
            )}

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
    </div>
  );
}
