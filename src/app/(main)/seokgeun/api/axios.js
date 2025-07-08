// seokgeun/api/axios.js
// HTTP 클라이언트 설정 및 인터셉터 관리

import axios from "axios";

// 🚀 개선점: 환경변수를 통한 baseURL 관리
// 현재: 하드코딩된 localhost:8888
// 개선: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888";

// axios 인스턴스 생성 - 공통 설정 적용
const api = axios.create({
  baseURL: API_BASE_URL, // API 서버의 기본 URL 설정
  withCredentials: true, // 쿠키를 포함한 요청 허용 (CORS 설정)
  timeout: 10000, // 🚀 개선점: 요청 타임아웃 설정 추가 (10초)
  headers: {
    "Content-Type": "application/json", // 기본 헤더 설정
  },
});

// 🚀 개선점: 요청 인터셉터 추가 - 토큰 자동 첨부
api.interceptors.request.use(
  (config) => {
    // 로컬스토리지에서 액세스 토큰 가져오기
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 401 Unauthorized 에러 처리
api.interceptors.response.use(
  (response) => {
    // 성공적인 응답은 그대로 반환
    return response;
  },
  async (error) => {
    // 401 에러 (인증 실패) 처리
    if (error.response && error.response.status === 401) {
      try {
        // 1. 서버에 로그아웃 요청 (세션 정리)
        await api.post("/api/register/user/me/logout");
      } catch (logoutError) {
        // 🚀 개선점: 로그아웃 실패 시에도 클라이언트 정리 진행
        console.warn("로그아웃 요청 실패:", logoutError);
      }

      // 2. 클라이언트 측 인증 정보 정리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // 🚀 개선점: 세션스토리지도 정리 (보안 강화)
      sessionStorage.clear();

      // 3. 로그인 페이지로 강제 이동
      // 🚀 개선점: 현재 페이지 정보를 state로 전달하여 로그인 후 복귀 가능하게 개선
      const currentPath = window.location.pathname;
      window.location.href = `/seokgeun/login?redirect=${encodeURIComponent(
        currentPath
      )}`;
    }

    // 🚀 개선점: 네트워크 에러 처리 추가
    if (!error.response) {
      console.error("네트워크 에러:", error.message);
      // 네트워크 에러 시 사용자에게 알림
      if (typeof window !== "undefined") {
        alert("서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
