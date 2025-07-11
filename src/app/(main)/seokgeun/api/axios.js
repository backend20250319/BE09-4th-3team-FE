// seokgeun/api/axios.js
// HTTP 클라이언트 설정 및 인터셉터 관리 (JWT 전용, 불필요한 코드 제거)

import axios from "axios";

// 환경변수를 통한 baseURL 관리
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888";

// axios 인스턴스 생성 - 공통 설정 적용
const api = axios.create({
  baseURL: API_BASE_URL, // API 서버의 기본 URL 설정
  timeout: 10000, // 요청 타임아웃 10초
  headers: {
    "Content-Type": "application/json", // 기본 헤더
  },
  // withCredentials: true, // (JWT 전용이면 필요 없음. 쿠키 기반 쓸 때만 true)
});

// 요청 인터셉터 - 토큰 자동 첨부
api.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 401 Unauthorized 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 에러(인증 실패) 처리
    if (error.response && error.response.status === 401) {
      // 로그인 페이지에서는 새로고침/이동하지 않음
      if (window.location.pathname.startsWith("/seokgeun/login")) {
        return Promise.reject(error);
      }
      // 1. 클라이언트 인증 정보 정리
      sessionStorage.clear();

      // 2. 로그인 페이지로 강제 이동 (현재 페이지 정보 포함)
      const currentPath = window.location.pathname;
      window.location.href = `/seokgeun/login?redirect=${encodeURIComponent(
        currentPath
      )}`;

      // 3. logout API 호출은 하지 않는다! (JWT라면 프론트에서 토큰만 삭제하면 됨)
      return; // 추가적인 Promise.reject 방지
    }

    // 네트워크 에러 처리
    if (!error.response) {
      if (typeof window !== "undefined") {
        alert("서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
