"use client";

import Image from "next/image";
import React, { useState } from "react";
import styles from "./login.module.css";

export default function LoginPage() {
  const [form, setForm] = useState({
    userId: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 로그인 로직 (예: 백엔드 API 호출 등)
    console.log("아이디:", form.userId, "비밀번호:", form.password);

    // 로그인 성공 후 메인 화면으로 리디렉션
    window.location.href = "/main"; // 메인 화면으로 리디렉션
  };

  return (
    <div className={styles.container}>
      {/* 좌측 로그인 박스 */}
      <div className={styles.leftPanel}>
        {/* 🔥 좌측 상단 로고 고정 */}
        <div className={styles.logoContainer}>
          <img
            src="/login_register/favicon.png"
            alt="logo"
            width={50}
            height={50}
          />
        </div>

        <div className={styles.loginBox}>
          <div className={styles.description}>
            간편하게 로그인하고 <br />
            <b>세상에 하나뿐인</b>
            <br />
            <b>특별한 프로젝트를 발견해보세요</b>
          </div>

          {/* 아이디 입력 필드 */}
          <input
            name="userId"
            value={form.userId}
            onChange={handleChange}
            placeholder="아이디"
            className={styles.input}
          />

          {/* 비밀번호 입력 필드 */}
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호"
            className={styles.input}
          />

          {/* 로그인 버튼 */}
          <button className={styles.kakaoButton} onClick={handleSubmit}>
            로그인
          </button>

          {/* 회원가입 링크 */}
          <div className={styles.signup}>
            아직 펀디 계정이 없으신가요?{" "}
            <a
              href="/seokgeun/register"
              style={{ textDecoration: "underline" }}
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
