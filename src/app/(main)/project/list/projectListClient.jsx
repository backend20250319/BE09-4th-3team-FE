"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@/components/pagination/pagination";
import Image from "next/image";
import Link from "next/link";
import { getDday } from "@/components/utils/dday";

export default function ProjectListClient() {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalPages: 0,
    totalElements: 0,
  });
  const [approvedCount, setApprovedCount] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "0", 10);

  const fetchProjects = async (page = 0, size = 12) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project/list`,
        {
          params: { page, size },
        }
      );
      if (response.data.success) {
        setProjects(response.data.data);
        setPagination(response.data.pagination);
        setApprovedCount(response.data.approvedCount);
      }
    } catch (error) {
      console.error("프로젝트 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchProjects(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      router.push(`?page=${newPage}`);
    }
  };

  return (
    <div className="w-[1160px] mx-auto my-10">
      <div className="text-base leading-[27px] mx-auto pt-4 pr-5 pb-3">
        <span className="text-[#ff5757]">{approvedCount}</span>개의 프로젝트가
        있습니다.
      </div>

      {/* 썸네일 이미지 */}
      <div className="grid grid-cols-4 gap-4">
        {projects.map((project) => (
          <Link
            key={project.projectNo}
            href={`/project/detail/${project.projectNo}`}
          >
            <div className="rounded-t-[8px] border-b-3 border-[#eb4b38]">
              {project.thumbnailUrl ? (
                <div className="overflow-hidden rounded-t-[8px]">
                  <Image
                    src={project.thumbnailUrl}
                    alt={project.title}
                    width={300}
                    height={300}
                    className="object-cover transition-transform rounded-b-[8px] duration-300 ease-in-out hover:scale-110"
                  />
                </div>
              ) : (
                <div className="h-[264px] bg-gray-200 flex mb-[14px] items-center justify-center text-sm text-gray-500 rounded-[8px]">
                  이미지 없음
                </div>
              )}
              {/* 프로젝트 정보 */}

              <div className="pt-4 flex flex-col gap-1">
                <p className="text-xs leading-[120%] text-[#545454]">
                  {project.creatorName}
                </p>
                <h2 className="text-base pb-1 text-[#1c1c1c] mb-[6px] border-b ">
                  {project.title}
                </h2>
              </div>
              <div className="pb-1 text-sm">
                <p className="text-[#1c1c1c] mb-[6px] flex gap-2 items-center">
                  목표금액:
                  <span className="text-[#545454]">
                    {project.goalAmount.toLocaleString()}원
                  </span>
                </p>
                <p className="text-[#1c1c1c] mb-[6px] flex gap-2 items-center">
                  마감일:
                  <span className="text-[#545454]">{project.deadLine}</span>
                </p>

                <div className="flex gap-1 mb-[6px]">
                  {new Date(project.startLine) > new Date() ? (
                    // 시작일이 미래 → 공개예정
                    <div className="bg-[#EDE9FE] w-12 text-[#7C3AED] h-[18px] text-[10px] font-bold justify-center leading-[120%] flex items-center rounded-[2px]">
                      공개예정
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <div className="bg-[#e0f7e9] w-12 text-[#34a853] h-[18px] text-[10px] font-bold justify-center leading-[120%] flex items-center rounded-[2px]">
                        진행중
                      </div>
                      <div className="bg-[#F3F4F6] w-12 text-[#374151] h-[18px] text-[10px] font-bold justify-center leading-[120%] flex items-center rounded-[2px]">
                        {(() => {
                          const dday = getDday(
                            project.startLine,
                            project.deadLine
                          );
                          if (typeof dday === "string") return dday;
                          if (dday <= 0) return "마감";
                          return `${dday}일 남음`;
                        })()}
                      </div>
                    </div>
                  )}
                  {project.creatorName == "hoya" && (
                    <div>
                      <Image
                        src={"/main/goodCreator.png"}
                        alt="좋은 창작자"
                        width={60}
                        height={17}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <div className="flex gap-1">
                    <p className="text-sm text-[#eb4b38] font-bold">
                      {project.percent}%
                    </p>
                    <span className="text-[#545454] text-sm font-normal">
                      {project.currentAmount.toLocaleString()}원
                    </span>
                  </div>
                  <p className="text-[13px] text-[#545454] mb-[6px] font-bold">
                    {(() => {
                      const dday = getDday(project.startLine, project.deadLine);
                      if (typeof dday === "string") return dday;
                      if (dday <= 0) return "마감";
                      return `${dday}일 남음`;
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
