"use client";

import { useState } from "react";
import axios from "axios";

import Section01 from "./components/section01";
import Section02 from "./components/section02";
import Section03 from "./components/section03";
import Section04 from "./components/section04";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import usePersistedState from "./hooks/usePersistedState";
import ScrollToTopButton from "@/components/scrollTopBtn/ScrollToTopButton";
import { useRouter } from "next/navigation";

export default function Page() {
  // section01 props
  const [title, setTitle] = usePersistedState("project_title", "");
  const [description, setDescription] = usePersistedState("project_description", "");
  const [categoryNo, setCategoryNo] = usePersistedState("project_categoryNo", 1);
  const [thumbnailUrl, setThumbnailUrl] = usePersistedState("project_thumbnailUrl", "");
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  // section02 props
  const [startLine, setStartLine] = usePersistedState("project_startLine", "");
  const [deadLine, setDeadLine] = usePersistedState("project_deadLine", "");
  const [accountNumber, setAccountNumber] = usePersistedState("project_accountNumber", "");
  const [goalAmount, setGoalAmount] = usePersistedState("project_goalAmount", "");
  const [validationMessage, setValidationMessage] = useState("");

  // section03 props
  const [rewards, setRewards] = usePersistedState("project_rewards", [{ title: "", amount: "", description: "" }]);

  // section04 props
  const [creatorName, setCreatorName] = usePersistedState("project_creatorName", "");
  const [creatorInfo, setCreatorInfo] = usePersistedState("project_creatorInfo", "");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parseSafeNumber = (val) => {
      const n = Number(val);
      return isNaN(n) ? 0 : n;
    };

    const isEmpty = (value) => {
      if (typeof value === "number") return false;
      return value == null || String(value).trim() === "";
    };

    if (
      isEmpty(title) ||
      isEmpty(description) ||
      parseSafeNumber(goalAmount) < 500000 ||
      isEmpty(startLine) ||
      isEmpty(deadLine) ||
      isEmpty(accountNumber) ||
      categoryNo === 0 ||
      isEmpty(creatorName) ||
      isEmpty(creatorInfo) ||
      isEmpty(thumbnailUrl) ||
      rewards.length === 0 ||
      rewards.some(
        (reward) => isEmpty(reward.title) || isEmpty(reward.description) || !reward.amount || reward.amount < 100
      )
    ) {
      alert("모든 항목을 빠짐없이 입력해 주세요.\n(선물 항목도 포함)");
      return;
    }

    const payload = {
      title,
      description,
      goalAmount: parseSafeNumber(goalAmount),
      startLine,
      deadLine,
      accountNumber,
      categoryNo,
      creatorName,
      creatorInfo,
      thumbnailUrl,
      rewards,
    };

    try {
      const token = sessionStorage.getItem("accessToken");

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project/upload`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("프로젝트가 성공적으로 등록되었습니다!");
      router.push("/project/list");
    } catch (err) {
      console.error("프로젝트 등록 실패", err);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="w-full bg-gray-50">
      <form onSubmit={handleSubmit}>
        <div className="flex mx-auto w-[1080px] pt-12">
          <Tabs defaultValue="section01" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-[50px] border-b border-gray-200">
              <TabsTrigger
                value="section01"
                className="h-[40px] border-0 rounded-[2px] data-[state=active]:border-b-[3px] data-[state=active]:border-[#f86453]"
              >
                기본정보
              </TabsTrigger>
              <TabsTrigger
                value="section02"
                className="h-[40px] border-0 rounded-[2px] data-[state=active]:border-b-[3px] data-[state=active]:border-[#f86453]"
              >
                목표 금액 및 일정
              </TabsTrigger>
              <TabsTrigger
                value="section03"
                className="h-[40px] border-0 rounded-[2px] data-[state=active]:border-b-[3px] data-[state=active]:border-[#f86453]"
              >
                선물구성
              </TabsTrigger>
              <TabsTrigger
                value="section04"
                className="h-[40px] border-0 rounded-[2px] data-[state=active]:border-b-[3px] data-[state=active]:border-[#f86453]"
              >
                창작자 정보
              </TabsTrigger>
            </TabsList>

            <TabsContent value="section01">
              <Section01
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                categoryNo={categoryNo}
                setCategoryNo={setCategoryNo}
                thumbnailUrl={thumbnailUrl}
                setThumbnailUrl={setThumbnailUrl}
                thumbnailPreview={thumbnailPreview}
                setThumbnailPreview={setThumbnailPreview}
              />
            </TabsContent>
            <TabsContent value="section02">
              <Section02
                goalAmount={goalAmount}
                setGoalAmount={setGoalAmount}
                startLine={startLine}
                setStartLine={setStartLine}
                deadLine={deadLine}
                setDeadLine={setDeadLine}
                accountNumber={accountNumber}
                setAccountNumber={setAccountNumber}
                validationMessage={validationMessage}
                setValidationMessage={setValidationMessage}
              />
            </TabsContent>
            <TabsContent value="section03">
              <Section03 rewards={rewards} setRewards={setRewards} />
            </TabsContent>
            <TabsContent value="section04">
              <Section04
                creatorName={creatorName}
                setCreatorName={setCreatorName}
                creatorInfo={creatorInfo}
                setCreatorInfo={setCreatorInfo}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-center pb-20">
          <button
            type="submit"
            className="bg-[#f86453] text-white px-6 py-3 rounded hover:bg-[#f86453] hover:opacity-80"
          >
            프로젝트 등록
          </button>
        </div>
      </form>
      <ScrollToTopButton />
    </div>
  );
}
