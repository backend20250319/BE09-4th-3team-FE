"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalPages: 0,
    totalElements: 0,
  });

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

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchProjects(newPage, pagination.size);
    }
  };

  // 남은 일수 계산
  const getDday = (start, end) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">프로젝트 목록</h1>

      <div className="grid grid-cols-3 gap-4">
        {projects.map((project) => (
          <Link key={project.projectNo} href={`/project/detail/${project.projectNo}`}>
            <div className="border rounded p-4 shadow">
              {project.thumbnailUrl ? (
                <Image
                  src={project.thumbnailUrl}
                  alt={project.title}
                  width={300}
                  height={300}
                  className="object-cover mb-2"
                />
              ) : (
                <div className="w-[275px] h-[275px] bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                  이미지 없음
                </div>
              )}
              <p>{project.categoryName}</p>
              <h2 className="text-lg font-semibold">{project.title}</h2>
              <p>목표 금액: {project.goalAmount.toLocaleString()}원</p>
              <p>모금액: {project.currentAmount.toLocaleString()}원</p>
              <p>마감일: {project.deadLine}</p>
              <p>상태: {project.status}</p>
              <p>{getDday(project.startLine, project.deadLine)}일 남음</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex justify-center items-center space-x-4">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          이전
        </button>
        <span>
          {pagination.page + 1} / {pagination.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page + 1 >= pagination.totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
}
