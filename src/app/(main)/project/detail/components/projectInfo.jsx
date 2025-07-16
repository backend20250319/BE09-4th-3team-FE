"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProjectInfo({
  project,
  selectedRewards = [],
  onAddReward,
  onUpdateQuantity,
  onRemoveReward,
  onPledge,
  selectedRewardsTotal = 0,
}) {
  const router = useRouter();
  const token = sessionStorage.getItem("accessToken");
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 1090);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 처음 로드 시에도 한 번 실행
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePledge = () => {
    if (!token) {
      router.push("/users/login");
      return;
    }

    if (selectedRewards.length === 0) {
      alert("최소 1개 이상의 선물을 선택해주세요.");
      return;
    }

    onPledge?.();
  };

  return (
    <section className={`w-[352px] pt-[25px]  `}>
      <div className="w-full min-h-[500px]">
        <div className="w-full mb-6">
          <Image
            src={"/jungho/projectDetail-img-1.png"}
            alt="pc 이미지"
            width={352}
            height={97}
          />
        </div>
        {/* 창작자 정보 */}
        <div
          className="border border-[#e4e4e4] rounded-[12px] p-5"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.03) 0px 1px 0px, rgba(0, 0, 0, 0.1) 0px 1px 6px",
          }}
        >
          <p className="mb-4">창작자 소개</p>
          <Link href={"#"}>
            <div className="flex items-center gap-5">
              <span className="rounded-[50%]">
                <Image
                  src={"/images/default_login_icon.png"}
                  alt="기본 로그인 아이콘"
                  width={68}
                  height={68}
                />
              </span>
              <span>{project.creatorName}</span>
            </div>
          </Link>
          <div className="pt-4">
            <p className="text-[#6d6d6d] font-normal text-[13px] leading-[22px]">
              {project.creatorInfo}
            </p>
          </div>
        </div>
        {/* 선물 선택 */}
        <div
          className={`pt-6 transition-all duration-300 ease-in-out ${
            isScrolled
              ? "fixed top-[8%] h-[calc(100%-52px)] scrollbar-hide overflow-auto right-[13%] w-[352px] z-10"
              : ""
          }`}
        >
          <p className="text-sm text-[#3d3d3d] font-semibold mb-[0.5rem]">
            선물 선택
          </p>
          <div className="flex flex-col gap-5 select-none">
            <button className="text-left" onClick={() => alert("준비중입니다")}>
              <div className="border p-5 rounded-md shadow-[0px_1px_0px_rgba(0,0,0,0.1),_0px_2px_4px_rgba(0,0,0,0.04)]">
                <p className="text-2xl leading-[36px] mb-[6px] tracking-[-0.025em]">
                  1000원 +
                </p>
                <p className="text-[13px] leading-[20px]">선물 없이 후원하기</p>
              </div>
            </button>
            {project.rewards && project.rewards.length > 0 ? (
              project.rewards.map((item) => (
                <div
                  key={item.id}
                  className="border p-5 rounded-md shadow-[0px_1px_0px_rgba(0,0,0,0.1),_0px_2px_4px_rgba(0,0,0,0.04)] cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => onAddReward?.(item)}
                >
                  <div className="flex-1">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-2xl leading-[36px] mb-[6px] tracking-[-0.025em]">
                      {item.amount.toLocaleString()}원 +
                    </p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>

                  {/* 선택된 선물이 있으면 수량 조절 UI 표시 */}
                  {selectedRewards.find((r) => r.id === item.id) && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          수량:{" "}
                          {selectedRewards.find((r) => r.id === item.id)
                            ?.quantity || 0}
                          개
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateQuantity?.(
                                item.id,
                                (selectedRewards.find((r) => r.id === item.id)
                                  ?.quantity || 1) - 1
                              );
                            }}
                            disabled={
                              (selectedRewards.find((r) => r.id === item.id)
                                ?.quantity || 1) <= 1
                            }
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {selectedRewards.find((r) => r.id === item.id)
                              ?.quantity || 1}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateQuantity?.(
                                item.id,
                                (selectedRewards.find((r) => r.id === item.id)
                                  ?.quantity || 1) + 1
                              );
                            }}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveReward?.(item.id);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">등록된 리워드가 없습니다.</p>
            )}
          </div>

          {/* 선택된 선물 요약 */}
          {selectedRewards.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium mb-2">
                선택된 선물: {selectedRewards.length}개
              </div>
              <div className="text-sm text-gray-600 mb-3">
                총액: {selectedRewardsTotal.toLocaleString()}원
              </div>
              {project.status == "IN_PROGRESS" ? (
                <button
                  onClick={handlePledge}
                  className="w-full h-[48px] cursor-pointer py-[14px] px-5 rounded-[8px] gap-1 flex items-center justify-center border-0 text-base bg-[#1c1c1c] text-white hover:bg-[#333] transition-colors"
                >
                  후원하기
                </button>
              ) : (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <button
                      onClick={() => setOpen(true)}
                      className="w-full h-[48px] cursor-pointer py-[14px] px-5 rounded-[8px] gap-1 flex items-center justify-center border-0 text-base bg-[#1c1c1c] text-white hover:bg-[#6d6d6d] transition-colors"
                    >
                      마감
                    </button>
                  </DialogTrigger>
                  <DialogContent className="w-[400px] flex justify-center items-center flex-col">
                    <DialogHeader>
                      <DialogTitle>마감 안내</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 items-center">
                      <p className="mt-4 text-sm text-gray-700 font-medium">
                        이 프로젝트는{" "}
                        <span className="text-purple-600 font-semibold">
                          {project.deadline}
                        </span>
                        에 마감되었습니다.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
