// app/home/page.jsx

"use client";

import React from "react";

export default function HomePage() {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>🎉 로그인 성공!</h1>
      <p>여기는 임시 Home 페이지입니다.</p>
      <p>토큰은 쿠키에 저장되어 있으며, 백엔드 API 호출로 사용자 정보를 확인할 수 있습니다.</p>
    </div>
  );
}
