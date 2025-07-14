"use client";
import Section01 from "@/components/main/section01";
import Link from "next/link";
import React, { useEffect } from "react";

export default function Main() {
  // OAuth 로그인 후 토큰 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");

    if (accessToken) {
      sessionStorage.setItem("accessToken", accessToken);
      // URL에서 토큰 파라미터 제거
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);

      // 헤더 동기화를 위한 이벤트 발생
      window.dispatchEvent(new Event("storage"));

      console.log("OAuth 로그인 성공: 토큰이 저장되었습니다.");
    }
    if (refreshToken) {
      sessionStorage.setItem("refreshToken", refreshToken);
    }
  }, []);

  return (
    <main className="bg-white">
      <Section01 />
    </main>
  );
}
