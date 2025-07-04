"use client";

import React, { useEffect, useState } from "react";
import api from "../api/axios"; // ← 경로는 상황에 따라 조정

export default function MainPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("로그인 정보가 없습니다.");
      return;
    }

    api
      .get("/api/register/user/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        setError("유저 정보를 불러올 수 없습니다.");
      });
  }, []);

  return (
    <div
      style={{
        color: "white",
        textAlign: "center",
        marginTop: "100px",
        background: "#222",
        height: "100vh",
      }}
    >
      <h1>메인 페이지</h1>
      <p>여기는 로그인 후 이동하는 메인 화면입니다.</p>
      {user ? (
        <div>
          <p>유저명: {user.nickname}</p>
          <p>상태: {user.userStatus}</p>
          <p>이메일: {user.email}</p>
        </div>
      ) : error ? (
        <div style={{ color: "orange", marginTop: "30px" }}>{error}</div>
      ) : (
        <div style={{ marginTop: "30px" }}>유저 정보를 불러오는 중...</div>
      )}
    </div>
  );
}
