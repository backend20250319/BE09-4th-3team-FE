"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

const CkEditor = dynamic(() => import("./components/ckEditor"), {
  ssr: false,
});

// 커스텀 훅: localStorage와 상태 동기화
const usePersistedState = (key, initialValue) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      setValue(JSON.parse(stored));
    }
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default function Page() {
  const [title, setTitle] = usePersistedState("project_title", "");
  const [description, setDescription] = usePersistedState("project_description", "");
  const [goalAmount, setGoalAmount] = usePersistedState("project_goalAmount", 0);
  const [startLine, setStartLine] = usePersistedState("project_startLine", "");
  const [deadLine, setDeadLine] = usePersistedState("project_deadLine", "");
  const [accountNumber, setAccountNumber] = usePersistedState("project_accountNumber", "");
  const [categoryNo, setCategoryNo] = usePersistedState("project_categoryNo", 1);
  const [creatorName, setCreatorName] = usePersistedState("project_creatorName", "");
  const [creatorInfo, setCreatorInfo] = usePersistedState("project_creatorInfo", "");
  const [thumbnailUrl, setThumbnailUrl] = usePersistedState("project_thumbnailUrl", "");
  const [rewards, setRewards] = usePersistedState("project_rewards", [{ title: "", amount: 0, description: "" }]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("accessToken");
      console.log(localStorage.getItem("accessToken"));
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project/images/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setThumbnailUrl(res.data.thumbnail.imagePath);
    } catch (err) {
      console.error("이미지 업로드 실패", err);
    }
  };

  const handleRewardChange = (index, field, value) => {
    const newRewards = [...rewards];
    newRewards[index][field] = value;
    setRewards(newRewards);
  };

  const addReward = () => {
    setRewards([...rewards, { title: "", amount: 0, description: "" }]);
  };

  const clearLocalStorage = () => {
    const keys = [
      "project_title",
      "project_description",
      "project_goalAmount",
      "project_startLine",
      "project_deadLine",
      "project_accountNumber",
      "project_categoryNo",
      "project_creatorName",
      "project_creatorInfo",
      "project_thumbnailUrl",
      "project_rewards",
    ];
    keys.forEach((key) => localStorage.removeItem(key));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      goalAmount,
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
      const token = localStorage.getItem("accessToken"); // ✅ 토큰 불러오기

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project/upload`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ 토큰 추가
        },
      });

      alert("프로젝트가 성공적으로 등록되었습니다!");
      console.log(res.data);
      clearLocalStorage();
      window.location.reload();
    } catch (err) {
      console.error("프로젝트 등록 실패", err);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  const categories = [
    { id: 1, name: "보드게임 · TRPG" },
    { id: 2, name: "디지털 게임" },
    { id: 3, name: "웹툰 · 만화" },
    { id: 4, name: "웹툰 리소스" },
    { id: 5, name: "디자인 문구" },
    { id: 6, name: "캐릭터 · 굿즈" },
    { id: 7, name: "홈 · 리빙" },
    { id: 8, name: "테크 · 가전" },
    { id: 9, name: "반려동물" },
    { id: 10, name: "푸드" },
    { id: 11, name: "향수 · 뷰티" },
    { id: 12, name: "의류" },
    { id: 13, name: "잡화" },
    { id: 14, name: "주얼리" },
    { id: 15, name: "출판" },
    { id: 16, name: "디자인" },
    { id: 17, name: "예술" },
    { id: 18, name: "사진" },
    { id: 19, name: "음악" },
    { id: 20, name: "영화 · 비디오" },
    { id: 21, name: "공연" },
  ];

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit} className="w-[1160px] mx-auto p-4 space-y-6">
        {/* 프로젝트 제목 */}
        <div className="space-y-1">
          <label htmlFor="title" className="block font-medium text-gray-700 text-lg">
            프로젝트 제목
            <span className="text-[#f00] pt-[2px]">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <p className="text-[#f00]">{title ? "필수 값" : ""}</p>
        </div>
        {/* 프로젝트 설명 */}
        <div className="space-y-1">
          <label className="block text-lg font-medium text-gray-700">
            프로젝트 설명
            <span className="text-[#f00] pt-[2px]">*</span>
          </label>
          <CkEditor onChange={setDescription} data={description} />
        </div>

        {/* 목표 금액 */}
        <div className="space-y-1">
          <label htmlFor="goalAmount" className="block text-lg font-medium text-gray-700">
            목표 금액
          </label>
          <input
            id="goalAmount"
            type="number"
            value={goalAmount}
            onChange={(e) => setGoalAmount(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* 시작일 / 종료일 */}
        <div className="flex">
          <div className="space-y-1">
            <label htmlFor="startLine" className="block text-lg font-medium text-gray-700">
              시작일
              <span className="text-[#f00] pt-[2px]">*</span>
            </label>
            <input
              id="startLine"
              type="date"
              value={startLine}
              onChange={(e) => setStartLine(e.target.value)}
              min={new Date().toISOString().split("T")[0]} // ✅ 오늘 이전 선택 불가
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="deadLine" className="block text-lg font-medium text-gray-700">
              종료일
              <span className="text-[#f00] pt-[2px]">*</span>
            </label>
            <input
              id="deadLine"
              type="date"
              value={deadLine}
              onChange={(e) => setDeadLine(e.target.value)}
              min={startLine || new Date().toISOString().split("T")[0]} // ✅ 시작일 또는 오늘 이후만
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* 계좌번호 */}
        <div className="space-y-1">
          <label htmlFor="accountNumber" className="block text-lg font-medium text-gray-700">
            계좌번호
            <span className="text-[#f00] pt-[2px]">*</span>
          </label>
          <input
            id="accountNumber"
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* 카테고리 */}
        <div className="space-y-1">
          <label htmlFor="categoryNo" className="block text-lg font-medium text-gray-700">
            카테고리 선택
            <span className="text-[#f00] pt-[2px]">*</span>
          </label>
          <select
            id="categoryNo"
            value={categoryNo}
            onChange={(e) => setCategoryNo(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="" disabled>
              카테고리를 선택하세요
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* 창작자 이름 */}
        <div className="space-y-1">
          <label htmlFor="creatorName" className="block text-lg font-medium text-gray-700">
            창작자 이름
            <span className="text-[#f00] pt-[2px]">*</span>
          </label>
          <input
            id="creatorName"
            type="text"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* 창작자 소개 */}
        <div className="space-y-1">
          <label htmlFor="creatorInfo" className="block text-lg font-medium text-gray-700">
            창작자 소개
            <span className="text-[#f00] pt-[2px]">*</span>
          </label>
          <input
            id="creatorInfo"
            type="text"
            value={creatorInfo}
            onChange={(e) => setCreatorInfo(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* 썸네일 */}
        <div className="space-y-1">
          <label className="block text-lg font-medium text-gray-700">
            썸네일 업로드
            <span className="text-[#f00] pt-[2px]">*</span>
          </label>

          <label
            htmlFor="thumbnail"
            className="inline-block bg-blue-600 text-white px-3 py-2 rounded cursor-pointer hover:bg-blue-700"
          >
            {thumbnailUrl ? "이미지 다시 선택" : "이미지 선택"}
          </label>
          <input id="thumbnail" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

          {thumbnailUrl && (
            <div className="mt-2">
              <p className="text-lg text-gray-600">썸네일 미리보기</p>
              <img src={thumbnailUrl} alt="썸네일" className="w-40 border rounded" />
              <button
                type="button"
                onClick={() => {
                  setThumbnailUrl(""); // 썸네일 초기화
                }}
                className="text-lg text-red-500 hover:underline"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {/* 리워드 */}
        <div>
          <label className="block text-lg font-medium text-gray-700">
            리워드 구성
            <span className="text-[#f00] pt-[2px]">*</span>
          </label>
          {rewards.map((reward, index) => (
            <div key={index} className="border p-3 rounded-md mb-3 space-y-2 bg-gray-50">
              <div>
                <label htmlFor={`reward-title-${index}`} className="block text-lg font-medium">
                  리워드 제목
                </label>
                <input
                  id={`reward-title-${index}`}
                  type="text"
                  value={reward.title}
                  onChange={(e) => handleRewardChange(index, "title", e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>

              <div>
                <label htmlFor={`reward-amount-${index}`} className="block text-lg font-medium">
                  리워드 금액
                </label>
                <input
                  id={`reward-amount-${index}`}
                  type="number"
                  value={reward.amount}
                  onChange={(e) => handleRewardChange(index, "amount", Number(e.target.value))}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>

              <div>
                <label htmlFor={`reward-description-${index}`} className="block text-lg font-medium">
                  리워드 설명
                </label>
                <textarea
                  id={`reward-description-${index}`}
                  value={reward.description}
                  onChange={(e) => handleRewardChange(index, "description", e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
            </div>
          ))}

          <button type="button" onClick={addReward} className="text-blue-600 hover:underline">
            + 리워드 추가
          </button>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          프로젝트 등록
        </button>
      </form>
    </div>
  );
}
