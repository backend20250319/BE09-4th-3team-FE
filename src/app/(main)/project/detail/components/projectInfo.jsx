"use client";
import { Dialog } from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProjectInfo({ project }) {
  const router = useRouter();
  const token = sessionStorage.getItem("accessToken");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 1090);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 처음 로드 시에도 한 번 실행
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePledge = (rewardId) => {
    if (token) {
      router.push(`/project/detail/${project.projectNo}/pledge?rewardId=${rewardId}`);
    } else {
      router.push("/seokgeun");
    }
  };

  return (
    <section className={`w-[352px] pt-[25px]  `}>
      <div className="w-full min-h-[500px]">
        <div className="w-full mb-6">
          <Image src={"/jungho/projectDetail-img-1.png"} alt="pc 이미지" width={352} height={97} />
        </div>
        {/* 창작자 정보 */}
        <div
          className="border border-[#e4e4e4] rounded-[12px] p-5"
          style={{ boxShadow: "rgba(0, 0, 0, 0.03) 0px 1px 0px, rgba(0, 0, 0, 0.1) 0px 1px 6px" }}
        >
          <p className="mb-4">창작자 소개</p>
          <Link href={"#"}>
            <div className="flex items-center gap-5">
              <span className="rounded-[50%]">
                <Image src={"/images/default_login_icon.png"} alt="기본 로그인 아이콘" width={68} height={68} />
              </span>
              <span>{project.creatorName}</span>
            </div>
          </Link>
          <div className="pt-4">
            <p className="text-[#6d6d6d] font-normal text-[13px] leading-[22px]">{project.creatorInfo}</p>
          </div>
        </div>
        {/* 선물 선택 */}
        <div
          className={`pt-6 transition-all duration-300 ease-in-out ${
            isScrolled ? "fixed top-[50px] right-[13%] w-[352px] z-10" : ""
          }`}
        >
          <p className="text-sm text-[#3d3d3d] font-semibold mb-[0.5rem]">선물 선택</p>
          <div className="flex flex-col gap-5">
            <button className="text-left" onClick={(e) => alert("준비중입니다")}>
              <div className="border p-5 rounded-md shadow-[0px_1px_0px_rgba(0,0,0,0.1),_0px_2px_4px_rgba(0,0,0,0.04)]">
                <p className="text-2xl leading-[36px] mb-[6px] tracking-[-0.025em]">1000원 +</p>
                <p className="text-[13px] leading-[20px]">선물 없이 후원하기</p>
              </div>
            </button>
            {project.rewards && project.rewards.length > 0 ? (
              project.rewards.map((item) => (
                <button
                  key={item.id}
                  className="border p-5 rounded-md text-left shadow-[0px_1px_0px_rgba(0,0,0,0.1),_0px_2px_4px_rgba(0,0,0,0.04)]"
                  onClick={(e) => handlePledge(item.id)}
                >
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-2xl leading-[36px] mb-[6px] tracking-[-0.025em]">
                    {item.amount.toLocaleString()}원 +
                  </p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500">등록된 리워드가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
