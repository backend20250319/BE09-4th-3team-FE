"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/loading";

export default function SearchPage() {
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const searchParams = useSearchParams();
  const query = (searchParams.get("query") || "").toLowerCase(); // 소문자로 통일
  const [isLoading, setIsLoading] = useState(false);

  // 1. 전체 데이터 불러오기
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        setIsLoading(true); // ✅ 시작할 때 true
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project/list`, {
          params: { page: 0, size: 9999 },
        });
        if (res.data.success) {
          setAllProjects(res.data.data);
        }
      } catch (err) {
        console.error("전체 프로젝트 불러오기 실패", err);
      } finally {
        setIsLoading(false); // ✅ 완료되면 false
      }
    };

    fetchAllProjects();
  }, []);

  // 2. query로 필터링
  useEffect(() => {
    const filtered = allProjects.filter((project) => {
      return (
        project.title?.toLowerCase().includes(query) ||
        project.creatorName?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
      );
    });

    setFilteredProjects(filtered);
  }, [allProjects, query]);

  return (
    <div className="w-[1160px] mx-auto my-10">
      {isLoading ? (
        <LoadingSpinner />
      ) : query ? (
        filteredProjects.length > 0 ? (
          <>
            <div>
              <h1 className="text-2xl font-bold mb-6">"{query}"에 대한 검색 결과</h1>
              <p>
                <span className="text-[#ff5757]">{filteredProjects.length}</span>개의 프로젝트가 있습니다.
              </p>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {filteredProjects.map((project) => (
                <Link key={project.projectNo} href={`/project/detail/${project.projectNo}`}>
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
                    <div className="pt-4 flex flex-col gap-1">
                      <p className="text-xs leading-[120%] text-[#545454]">{project.creatorName}</p>
                      <h2 className="text-base pb-1 text-[#1c1c1c] mb-[6px]">{project.title}</h2>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <p className="text-2xl text-center text-gray-500 mt-10 h-screen flex items-center justify-center">
            🔍 검색 결과가 없습니다.
          </p>
        )
      ) : (
        <p className="text-sm text-center text-gray-500 mt-10">검색어를 입력해 주세요.</p>
      )}
    </div>
  );
}
