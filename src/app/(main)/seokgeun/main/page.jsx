"use client";

import React, { useEffect, useState } from "react";
import api from "../api/axios"; // API 인스턴스 사용

export default function MainPage() {
  // 사용자 정보 상태 관리
  const [user, setUser] = useState(null);

  // 에러 상태 관리
  const [error, setError] = useState("");

  // 로딩 상태 관리
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 사용자 정보 조회
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        setError("");

        // 로컬스토리지에서 액세스 토큰 확인
        const accessToken = sessionStorage.getItem("accessToken");
        if (!accessToken) {
          setError("로그인 정보가 없습니다. 다시 로그인해주세요.");
          setLoading(false);
          return;
        }

        // 개선점: API 인터셉터에서 자동으로 토큰을 첨부하므로 헤더 설정 불필요
        // const response = await api.get("/api/register/user/me", {
        //   headers: { Authorization: `Bearer ${accessToken}` },
        // });

        // 사용자 정보 조회 API 호출
        const response = await api.get("/api/user/me");
        setUser(response.data);
      } catch (err) {
        console.error("사용자 정보 조회 실패:", err);

        // 개선점: 더 구체적인 에러 메시지 제공
        if (err.response?.status === 401) {
          setError("인증이 만료되었습니다. 다시 로그인해주세요.");
        } else if (err.response?.status === 404) {
          setError("사용자 정보를 찾을 수 없습니다.");
        } else if (!err.response) {
          setError("서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.");
        } else {
          setError(
            "사용자 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시에만 실행

  //  개선점: 로그아웃 핸들러 추가
  const handleLogout = async () => {
    try {
      await api.post("/api/user/logout");
    } catch (error) {
      console.warn("로그아웃 요청 실패:", error);
    } finally {
      // 클라이언트 측 정리
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      sessionStorage.clear();
      window.location.href = "/seokgeun/login";
    }
  };

  return (
    <div
      style={{
        color: "white",
        textAlign: "center",
        marginTop: "100px",
        background: "#222",
        height: "100vh",
        padding: "20px",
      }}
    >
      <h1>메인 페이지</h1>
      <p>여기는 로그인 후 이동하는 메인 화면입니다.</p>

      {/* 로딩 상태 표시 */}
      {loading && (
        <div style={{ marginTop: "30px", color: "#ccc" }}>
          사용자 정보를 불러오는 중...
        </div>
      )}

      {/* 사용자 정보 표시 */}
      {user && !loading && (
        <div style={{ marginTop: "30px" }}>
          <h2>사용자 정보</h2>
          <div
            style={{
              background: "#333",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "400px",
              margin: "0 auto",
              textAlign: "left",
            }}
          >
            <p>
              <strong>유저명:</strong> {user.nickname}
            </p>
            <p>
              <strong>상태:</strong> {user.userStatus}
            </p>
            <p>
              <strong>이메일:</strong> {user.email}
            </p>
            {/* 개선점: 추가 사용자 정보 표시 */}
            {user.userId && (
              <p>
                <strong>아이디:</strong> {user.userId}
              </p>
            )}
            {user.address && (
              <p>
                <strong>주소:</strong> {user.address}
              </p>
            )}
            {user.phone && (
              <p>
                <strong>전화번호:</strong> {user.phone}
              </p>
            )}
          </div>

          {/* 개선점: 로그아웃 버튼 추가 */}
          <button
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            로그아웃
          </button>
        </div>
      )}

      {/* 에러 상태 표시 */}
      {error && !loading && (
        <div
          style={{
            color: "#ff6b6b",
            marginTop: "30px",
            background: "#333",
            padding: "15px",
            borderRadius: "8px",
            maxWidth: "400px",
            margin: "30px auto 0",
          }}
        >
          <strong>오류:</strong> {error}
          <br />
          <button
            onClick={() => (window.location.href = "/seokgeun/login")}
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            로그인 페이지로 이동
          </button>
        </div>
      )}
    </div>
  );
}
