"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronRight, Download, Heart, Share2 } from "lucide-react";
import Image from "next/image";
import { getDday } from "@/components/utils/dday";
import { numberWithCommas } from "@/components/utils/number";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectPlan from "../components/projectPlan";
import ProjectReview from "../components/projectReview";
import ProjectUpdate from "../components/projectUpdate";
import ProjectCommunity from "../components/projectCommunity";
import ProjectInfo from "../components/projectInfo";
import ScrollToTopButton from "@/components/scrollTopBtn/ScrollToTopButton";
import { v4 as uuidv4 } from "uuid";

export default function Page() {
  const { projectNo } = useParams();
  const [project, setProject] = useState(null);
  const [selectedRewards, setSelectedRewards] = useState([]);
  const router = useRouter();

  // 선물 수량 변경
  const updateRewardQuantity = (rewardId, newQuantity) => {
    if (newQuantity < 1) return;

    setSelectedRewards((prev) =>
      prev.map((reward) => (reward.id === rewardId ? { ...reward, quantity: newQuantity } : reward))
    );
  };

  // 선물 제거
  const removeReward = (rewardId) => {
    setSelectedRewards((prev) => prev.filter((reward) => reward.id !== rewardId));
  };

  // 선물 추가
  const addReward = (reward) => {
    const existingReward = selectedRewards.find((r) => r.id === reward.id);
    if (existingReward) {
      updateRewardQuantity(reward.id, existingReward.quantity + 1);
    } else {
      setSelectedRewards((prev) => [...prev, { ...reward, quantity: 1 }]);
    }
  };

  // 선택된 선물들의 총 금액 계산
  const selectedRewardsTotal = selectedRewards.reduce((sum, reward) => {
    return sum + reward.amount * reward.quantity;
  }, 0);

  const onClickGoPledge = () => {
    window.scrollTo({
      top: 1090,
      behavior: "smooth", // 부드러운 스크롤
    });
  };

  const handlePledge = () => {
    if (selectedRewards.length === 0) {
      alert("최소 1개 이상의 선물을 선택해주세요.");
      return;
    }
    const cartId = uuidv4();
    sessionStorage.setItem(`selectedRewards_${cartId}`, JSON.stringify(selectedRewards));
    router.push(`/project/detail/${projectNo}/pledge?cartId=${cartId}`);
  };

  // 결제 진행 날짜 +1일
  const getNextDay = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10); // "YYYY-MM-DD" 형태
  };

  // 예상 발송 시작일 +7일
  const getNextWeek = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 7);
    return date.toISOString().slice(0, 10); // "YYYY-MM-DD" 형태
  };

  useEffect(() => {
    if (projectNo) {
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project/${projectNo}`).then((res) => {
        setProject(res.data.data);
      });
    }
  }, [projectNo]);

  return project ? (
    <main className="bg-white">
      <div className="pt-8 w-[1040px] max-w-[1160px] flex flex-col mx-auto">
        <div className="flex text-[#545454] text-xs leading-[120%] items-center mb-3">
          {project.categoryName}
          <ChevronRight size={12} />
        </div>
        <div className="flex gap-[72px] pb-[42px]">
          <div className="w-[509px] mb-2">
            <Image
              src={project.thumbnailUrl}
              alt={project.thumbnailUrl}
              width={509}
              height={509}
              className="rounded-[8px]"
            />
          </div>
          <div className="w-[50%]">
            <div className="flex gap-5 flex-col pb-5 border-b border-[#e4e4e4]">
              <p className="text-2xl font-bold leading-[120%]">{project.title}</p>
              <div className="flex gap-[6px] flex-col leading-[120%]">
                <p className="text-sm font-normal text-[#545454]">모인금액</p>
                <p className="text-2xl font-bold leading-[120%]">
                  {project.currentAmount}
                  <span className="text-sm font-normal ml-[2px]">원</span>
                  <span className="text-lg ml-2 text-[#eb4b38]">{project.percentFunded}%</span>
                </p>
              </div>
              <div className="flex gap-[6px] flex-col leading-[120%]">
                <p className="text-sm font-normal text-[#545454]">남은시간</p>
                <p className="text-2xl font-bold leading-[120%]">
                  {getDday(project.startLine, project.deadline)}
                  <span className="text-sm font-normal ml-[2px]">일</span>
                </p>
              </div>
            </div>
            <div className="flex gap-5 flex-col py-5">
              <div className="flex gap-4 items-center">
                <p className="w-[86px] text-[#1c1c1c] text-xs font-semibold ">목표금액</p>
                <p className="text-[#1c1c1c] text-[13px] font-normal">{numberWithCommas(project.goalAmount)}원</p>
              </div>
              <div className="flex gap-4 items-center">
                <p className="w-[86px] text-[#1c1c1c] text-xs font-semibold ">펀딩 기간</p>
                <p className="text-[#1c1c1c] text-[13px] font-normal">
                  {project.startLine} ~ {project.deadline}
                  <span className="text-[10px] font-bold ml-[6px] py-[4px] px-[6px] rounded-[6px] bg-[#fff2f3] text-[#e53c41]">
                    {getDday(project.startLine, project.deadline)}일 남음
                  </span>
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <p className="w-[86px] text-[#1c1c1c] text-xs font-semibold ">결제</p>
                <p className="text-[#1c1c1c] text-[13px] font-normal">
                  목표 금액 달성 시 {getNextDay(project.deadline)}에 결제 진행
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <p className="w-[86px] text-[#1c1c1c] text-xs font-semibold ">예상 발송 시작일</p>
                <p className="text-[#1c1c1c] text-[13px] font-normal">{getNextWeek(project.deadline)}</p>
              </div>
            </div>
            <button className="w-full h-[44px] cursor-pointer flex items-center justify-center mt-2 mb-5 bg-[#fff7f0] border border-[fff7f0] rounded-[4px] outline-0 text-xs font-semibold leading-[120%] text-[#eb4b38]">
              최대 1,000원 응원권 받기
              <Download size={16} className="ml-2" />
            </button>
            <div className="flex gap-5 items-center justify-between">
              <div>
                <Heart />
              </div>
              <div>
                <Share2 />
              </div>
              <button
                onClick={onClickGoPledge}
                className="w-full h-[48px] cursor-pointer py-[14px] px-5 rounded-[8px] gap-1 flex items-center justify-center border-0 text-base bg-[#1c1c1c] text-white"
              >
                후원하기
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="px-[1rem] w-full flex items-stretch border-t relative border-[#e4e4e4]"
        style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)" }}
      >
        <div className="flex justify-start items-stretch w-[1040px] mx-auto">
          <Tabs defaultValue="section01">
            <TabsList className="mx-[1rem] w-full h-full bg-white flex gap-[17px]">
              <TabsTrigger
                value="section01"
                className="h-[56px] border-0 rounded-[2px] data-[state=active]:border-b-[3px] data-[state=active]:border-[#0d0d0d]"
              >
                프로젝트 계획
              </TabsTrigger>
              <TabsTrigger
                value="section02"
                className="h-[56px] border-0 rounded-[2px] data-[state=active]:border-b-[3px] data-[state=active]:border-[#0d0d0d]"
              >
                업데이트
              </TabsTrigger>
              <TabsTrigger
                value="section03"
                className="h-[56px] border-0 rounded-[2px] data-[state=active]:border-b-[3px] data-[state=active]:border-[#0d0d0d]"
              >
                커뮤니티
              </TabsTrigger>
              <TabsTrigger
                value="section04"
                className="h-[56px] border-0 rounded-[2px] data-[state=active]:border-b-[3px] data-[state=active]:border-[#0d0d0d]"
              >
                후기
              </TabsTrigger>
            </TabsList>
            <TabsContent value="section01" className="flex gap-[38px]">
              <ProjectPlan project={project} />
              <ProjectInfo
                project={project}
                selectedRewards={selectedRewards}
                onAddReward={addReward}
                onUpdateQuantity={updateRewardQuantity}
                onRemoveReward={removeReward}
                onPledge={handlePledge}
                selectedRewardsTotal={selectedRewardsTotal}
              />
            </TabsContent>
            <TabsContent value="section02" className="w-[1040px]">
              <ProjectUpdate project={project} />
            </TabsContent>
            <TabsContent value="section03" className="w-[1040px]">
              <ProjectCommunity project={project} />
            </TabsContent>
            <TabsContent value="section04" className="flex gap-[38px]">
              <ProjectReview project={project} />
              <ProjectInfo
                project={project}
                selectedRewards={selectedRewards}
                onAddReward={addReward}
                onUpdateQuantity={updateRewardQuantity}
                onRemoveReward={removeReward}
                onPledge={handlePledge}
                selectedRewardsTotal={selectedRewardsTotal}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <ScrollToTopButton />;
    </main>
  ) : (
    <div className="flex justify-center items-center h-screen">로딩중...</div>
  );
}
