// app/home/page.jsx
// 로그인 성공 후 임시 홈 페이지

"use client";

import React, { useEffect, useState } from "react"; // 🚀 개선점: useEffect, useState 추가

export default function HomePage() {
  // 🚀 개선점: 사용자 정보 상태 관리 추가
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 사용자 정보 확인
  useEffect(() => {
    const checkUserInfo = () => {
      try {
        // 로컬스토리지에서 토큰 확인
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (accessToken && refreshToken) {
          setUserInfo({
            hasToken: true,
            tokenInfo: {
              accessToken: accessToken.substring(0, 20) + "...", // 보안을 위해 일부만 표시
              refreshToken: refreshToken.substring(0, 20) + "...",
            },
          });
        } else {
          setUserInfo({ hasToken: false });
        }
      } catch (error) {
        console.error("사용자 정보 확인 중 오류:", error);
        setUserInfo({ hasToken: false, error: true });
      } finally {
        setLoading(false);
      }
    };

    checkUserInfo();
  }, []);

  // 🚀 개선점: 메인 페이지로 이동 핸들러
  const handleGoToMain = () => {
    window.location.href = "/seokgeun/main";
  };

  // 🚀 개선점: 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.clear();
    window.location.href = "/seokgeun/login";
  };

  return (
    <div
      style={{
        padding: "50px",
        textAlign: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
        🎉 로그인 성공!
      </h1>

      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          padding: "30px",
          borderRadius: "15px",
          backdropFilter: "blur(10px)",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <p style={{ fontSize: "1.2rem", marginBottom: "15px" }}>
          여기는 임시 Home 페이지입니다.
        </p>

        <p
          style={{ fontSize: "1rem", marginBottom: "20px", lineHeight: "1.6" }}
        >
          토큰은 쿠키에 저장되어 있으며, 백엔드 API 호출로 사용자 정보를 확인할
          수 있습니다.
        </p>

        {/* 🚀 개선점: 토큰 정보 표시 */}
        {!loading && userInfo && (
          <div
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              padding: "20px",
              borderRadius: "10px",
              marginTop: "20px",
              textAlign: "left",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>🔐 인증 상태</h3>
            {userInfo.hasToken ? (
              <div>
                <p style={{ marginBottom: "10px" }}>
                  <strong>✅ 토큰 상태:</strong> 정상
                </p>
                <p style={{ marginBottom: "10px", fontSize: "0.9rem" }}>
                  <strong>Access Token:</strong>{" "}
                  {userInfo.tokenInfo.accessToken}
                </p>
                <p style={{ fontSize: "0.9rem" }}>
                  <strong>Refresh Token:</strong>{" "}
                  {userInfo.tokenInfo.refreshToken}
                </p>
              </div>
            ) : (
              <p style={{ color: "#ff6b6b" }}>
                <strong>❌ 토큰 상태:</strong> 토큰이 없습니다.
              </p>
            )}
          </div>
        )}

        {/* 🚀 개선점: 네비게이션 버튼들 */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            marginTop: "30px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleGoToMain}
            style={{
              padding: "12px 24px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
          >
            🏠 메인 페이지로 이동
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: "12px 24px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#da190b")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#f44336")}
          >
            🚪 로그아웃
          </button>
        </div>

        {/* 🚀 개선점: 추가 정보 */}
        <div
          style={{
            marginTop: "30px",
            fontSize: "0.9rem",
            opacity: "0.8",
            background: "rgba(0, 0, 0, 0.1)",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <h4 style={{ marginBottom: "10px" }}>💡 개발 정보</h4>
          <ul style={{ textAlign: "left", listStyle: "none", padding: 0 }}>
            <li>• 이 페이지는 로그인 성공 후 임시로 표시됩니다</li>
            <li>• 실제 프로덕션에서는 메인 페이지로 리다이렉트됩니다</li>
            <li>• 토큰은 localStorage에 안전하게 저장됩니다</li>
            <li>• API 호출 시 자동으로 토큰이 첨부됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
