"use client";

import Header from "@/components/header/Header";
import Image from "next/image";
import React, { useState } from "react";
import styles from "./main.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function LoginPage() {
  // 환경 변수 확인용 로그
  console.log("API BASE URL:", API_BASE_URL);

  // 미정의 예외 처리
  if (!API_BASE_URL) {
    console.warn("API_BASE_URL 환경 변수가 정의되지 않았습니다.");
  }

  // 로그인 핸들러
  const handleKakaoLogin = () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`;
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  return (
    <div className={styles.container}>
      {/* 좌측 로그인 박스 */}
      <div className={styles.leftPanel}>
        {/* 좌측 상단 로고 고정 */}
        <div className={styles.logoContainer}></div>

        <div className={styles.loginBox}>
          <div className={styles.description}>
            간편하게 로그인하고 <br />
            <b>세상에 하나뿐인</b>
            <br />
            <b>특별한 프로젝트를 발견해보세요</b>
          </div>

          {/* 카카오 로그인 */}
          <button className={styles.kakaoButton} onClick={handleKakaoLogin}>
            카카오로 로그인
          </button>

          {/* 구글 로그인 */}
          <button className={styles.googleButton} onClick={handleGoogleLogin}>
            구글로 로그인
          </button>

          <div className={styles.signup}>
            아직 펀디 계정이 없으신가요?{" "}
            <a
              href="/seokgeun/register"
              style={{ textDecoration: "underline" }}
            >
              회원가입
            </a>
          </div>

          <div className={styles.loginLink}>
            이미 펀디 계정이 있으신가요?{" "}
            <a href="/seokgeun/login" style={{ textDecoration: "underline" }}>
              로그인
            </a>
          </div>
        </div>
      </div>

      {/* 우측 배경 이미지 */}
      <div
        className={styles.rightPanel}
        style={{
          backgroundImage: 'url("/login_register/login_register_image_1.png")',
        }}
      />
    </div>
  );
}
