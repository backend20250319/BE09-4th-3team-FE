// seokgeun/api/axios.js

import axios from "axios";

// 필요시 baseURL 설정, credentials 등 옵션 네 상황에 맞게 조정
const api = axios.create({
  baseURL: "http://localhost:8888",
  withCredentials: true,
});

// 401 Unauthorized 처리 인터셉터 추가
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        // 1. 서버에 로그아웃 요청
        await api.post("/api/register/user/me/logout");
      } catch (logoutError) {
        // 로그아웃 실패는 무시 (이미 로그아웃이거나 토큰 만료 상황 가능)
      }
      // 2. 클라이언트 토큰 등 인증 상태 클리어
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // 3. 로그인 페이지로 강제 이동
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
export default api;
