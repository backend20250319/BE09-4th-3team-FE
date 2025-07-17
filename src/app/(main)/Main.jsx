"use client";
import Section01 from "@/components/main/components/section01";
import Section02 from "@/components/main/components/section02";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Main() {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalPages: 0,
    totalElements: 0,
  });

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

  const fetchProjects = async (page = 0, size = 12) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project/list`, {
        params: { page, size },
      });
      if (response.data.success) {
        setProjects(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("프로젝트 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <main className="bg-white">
      <Section01 projects={projects} />
      <Section02 projects={projects} />
    </main>
  );
}
