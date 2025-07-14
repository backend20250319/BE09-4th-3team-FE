"use client";
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
    <>
      {/* <ul className="text-3xl flex flex-col gap-5">
        <li className="hover:text-[#f00]">
          <Link href="/nayeon">임나연</Link>
        </li>
        <li className="hover:text-[#ffbe4f]">
          <Link href="/seokgeun">조석근</Link>
        </li>
        <li className="hover:text-[#65ff4a]">
          <Link href="/junbem">박준범</Link>
        </li>
        <li className="hover:text-[#4fd3ff]">
          <Link href="/seokjin">이석진</Link>
        </li>
        <li className="hover:text-[#8446ff]">
          <Link href="/project">지정호</Link>
        </li>
      </ul> */}
    </>
  );
}
