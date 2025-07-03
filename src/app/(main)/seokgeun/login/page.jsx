"use client";

import Image from "next/image";
import React, { useState } from "react";
import styles from "./login.module.css";
import api from "../api/axios"; // ← api 인스턴스 사용, 경로는 프로젝트 구조에 맞게 조정

export default function LoginPage() {
  const [form, setForm] = useState({
    userId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrorMsg(""); // 입력시 에러메시지 리셋
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await api.post("/api/register/login", {
        userId: form.userId,
        password: form.password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
      }
      if (response.data && response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }

      window.location.href = "/seokgeun/main";
    } catch (err) {
      setErrorMsg(
        err.response?.data?.error ||
          "로그인에 실패했습니다. 아이디/비밀번호를 확인하세요."
      );
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
            disabled={loading}
          />

          {/* 비밀번호 입력 필드 */}
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호"
            className={styles.input}
            disabled={loading}
          />

          {/* 에러 메시지 출력 */}
          {errorMsg && (
            <div style={{ color: "red", margin: "10px 0" }}>{errorMsg}</div>
          )}

          {/* 로그인 버튼 */}
          <button
            className={styles.kakaoButton}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
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
