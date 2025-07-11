"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { getDday } from "@/components/utils/dday";

export default function Page() {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalPages: 0,
    totalElements: 0,
  });
  const [approvedCount, setApprovedCount] = useState(0);

  const fetchProjects = async (page = 0, size = 12) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project/list`, {
        params: { page, size },
      });
      if (response.data.success) {
        setProjects(response.data.data);
        setPagination(response.data.pagination);
        setApprovedCount(response.data.approvedCount);

        console.log(response);
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

  return (
    <div className="p-6 w-[1160px] mx-auto">
      <div className="text-base leading-[27px] mx-auto pt-4 pr-5 pb-3">
        <span className="text-[#ff5757]">{approvedCount}</span>개의 프로젝트가 있습니다.
      </div>

      {/* 썸네일 이미지 */}
      <div className="grid grid-cols-4 gap-4">
        {projects.map((project) => (
          <Link key={project.projectNo} href={`/project/detail/${project.projectNo}`}>
            <div className="border rounded-[8px] shadow">
              {project.thumbnailUrl ? (
                <div className="overflow-hidden rounded-t-[8px]">
                  <Image
                    src={project.thumbnailUrl}
                    alt={project.title}
                    width={300}
                    height={300}
                    className="object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                  />
                </div>
              ) : (
                <div className="h-[264px] bg-gray-200 flex mb-2 items-center justify-center text-sm text-gray-500 rounded-t-[8px]">
                  이미지 없음
                </div>
              )}
              {/* 프로젝트 정보 */}

              <div className="px-4 pt-4 pb-2">
                <p className="text-xs leading-[120%] text-[#545454]">{project.creatorName}</p>
                <h2 className="text-base pb-4 text-[#1c1c1c] mb-[6px] border-b border-[#6d6d6d]">{project.title}</h2>
              </div>
              <div className="pb-4 px-4">
                <p className="text-base text-[#1c1c1c] mb-[6px] flex gap-2 items-center">
                  목표 금액:
                  <span className="text-[#545454] text-[15px]">{project.goalAmount.toLocaleString()}원</span>
                </p>
                <p className="text-base text-[#1c1c1c] mb-[6px] flex gap-2 items-center">
                  모인 금액:
                  <span className="text-[#545454] text-[15px]">{project.currentAmount.toLocaleString()}원</span>
                </p>
                <p className="text-base text-[#1c1c1c] mb-[6px] flex gap-2 items-center">
                  마감일:
                  <span className="text-[#545454] text-[15px]">{project.deadLine}</span>
                </p>
                <p className="text-base text-[#1c1c1c] mb-[6px] flex gap-2 items-center">
                  {getDday(project.startLine, project.deadLine)}일 남음
                </p>
              </div>
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
