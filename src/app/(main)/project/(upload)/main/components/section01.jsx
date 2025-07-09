"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import usePersistedState from "../hooks/usePersistedState";
import { CircleAlert } from "lucide-react";
import { numberWithCommas } from "@/components/utils/number";

const CkEditor = dynamic(() => import("./ckEditor"), {
  ssr: false,
});

// 목표금액 계산
const getFees = (amount) => {
  const num = parseInt(amount.toString().replace(/[^0-9]/g, ""), 10) || 0;

  const pgFee = Math.floor(num * 0.033); // 3.3%
  const platformFee = Math.floor(num * 0.055); // 5.5%
  const totalFee = pgFee + platformFee;
  const estimatedReceive = num - totalFee;

  return {
    pgFee,
    platformFee,
    totalFee,
    estimatedReceive,
  };
};

export default function Section01() {
  const [title, setTitle] = usePersistedState("project_title", "");
  const [description, setDescription] = usePersistedState("project_description", "");
  const [goalAmount, setGoalAmount] = usePersistedState("project_goalAmount", "");
  const [categoryNo, setCategoryNo] = usePersistedState("project_categoryNo", 1);
  const [validationMessage, setValidationMessage] = useState("");

  const handleGoalAmountChange = (e) => {
    let rawValue = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 추출

    // 최대 자리수 제한 (10자리: 9999999999)
    if (rawValue.length > 10) {
      rawValue = rawValue.slice(0, 10);
    }

    const numericValue = parseInt(rawValue || "0", 10);

    // 유효성 검사 메시지
    if (numericValue < 500000) {
      setValidationMessage("50만원 이상의 금액을 입력해주세요.");
    } else if (numericValue > 9999999999) {
      setValidationMessage("9,999,999,999원 이하인 금액을 입력해주세요.");
    } else {
      setValidationMessage("");
    }

    setGoalAmount(rawValue);
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

  const { pgFee, platformFee, totalFee, estimatedReceive } = getFees(goalAmount);

  return (
    <section>
      {/* 카테고리 */}
      <div className="space-y-1 flex justify-between pb-12 mb-14 border-b border-[#ddd]">
        <div className=" w-[351px]">
          <div className="flex">
            <h2 className="font-bold mb-3">프로젝트 카테고리</h2>
            <span className="text-[#f00] pt-[2px]">*</span>
          </div>
          <p className="text-[#6d6d6d] font-normal text-sm">
            프로젝트 성격과 가장 일치하는 카테고리를 선택해주세요. <br /> 적합하지 않을 경우 운영자에 의해 조정될 수
            있습니다.
          </p>
        </div>
        <div className="w-[630px]">
          <p className="text-[11px] leading-[18px] mb-2 text-[#3d3d3d] font-bold">카테고리</p>
          <span className="max-h-[41px] flex leading-6 items-center rounded-[1px] px-[18px] border border-[#e4e4e4]">
            <select
              id="categoryNo"
              value={categoryNo}
              onChange={(e) => setCategoryNo(Number(e.target.value))}
              className="w-full border px-3 py-2 rounded border-none outline-0"
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
          </span>
        </div>
      </div>

      {/* 프로젝트 제목 */}
      <div className="space-y-1 flex justify-between pb-12 mb-14 border-b border-[#ddd]">
        <div className=" w-[351px]">
          <div className="flex">
            <h2 className="font-bold mb-3">프로젝트 제목</h2>
            <span className="text-[#f00] pt-[2px]">*</span>
          </div>
          <p className="text-[#6d6d6d] font-normal text-sm">
            프로젝트의 주제, 창작물의 품목이 명확하게 드러나는 멋진 제목을 붙여주세요.
          </p>
        </div>
        <div className="w-[630px]">
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="프로젝트의 주제, 창작물의 품목이 명확하게 드러나는 멋진 제목을 붙여주세요."
            required
          />
        </div>
      </div>

      {/* 프로젝트 설명 */}
      <div className="space-y-1 flex justify-between pb-12 mb-14 border-b border-[#ddd]">
        <div className=" w-[351px]">
          <div className="flex">
            <h2 className="font-bold mb-3">프로젝트 설명</h2>
            <span className="text-[#f00] pt-[2px]">*</span>
          </div>
          <p className="text-[#6d6d6d] font-normal text-sm">프로젝트의 자세한 설명 및 이미지를 등록해 주세요.</p>
        </div>
        <div className="w-[630px]">
          <CkEditor onChange={setDescription} data={description} />
        </div>
      </div>

      {/* 목표 금액 */}
      <div className="space-y-1 flex justify-between pb-12 mb-14 border-b border-[#ddd]">
        <div className=" w-[351px]">
          <div className="flex">
            <h2 className="font-bold mb-3">목표 금액</h2>
            <span className="text-[#f00] pt-[2px]">*</span>
          </div>
          <p className="text-[#6d6d6d] font-normal text-sm">프로젝트를 완수하기 위해 필요한 금액을 설정해주세요.</p>
          <div className="bg-[#fff2f3] rounded-sm px-6 py-5  mt-[18px]">
            <span className="flex items-center text-xs font-bold text-[#e53c41] leading-[120%]">
              <CircleAlert size={13.5} className="mr-2" />
              목표 금액 설정 시 꼭 알아두세요!
            </span>
            <ul className="mt-2 list-disc">
              <li className="ml-3.5 mb-[5px] whitespace-pre-wrap text-xs leading-[150%] text-[#545454]">
                종료일까지 목표금액을 달성하지 못하면 후원자 결제가 진행되지 않습니다.
              </li>
              <li className="ml-3.5 mb-[5px] whitespace-pre-wrap text-xs leading-[150%] text-[#545454]">
                후원 취소 및 결제 누락을 대비해 10% 이상 초과 달성을 목표로 해주세요.
              </li>
              <li className="ml-3.5 mb-[5px] whitespace-pre-wrap text-xs leading-[150%] text-[#545454]">
                제작비, 선물 배송비, 인건비, 예비 비용 등을 함께 고려해주세요.
              </li>
            </ul>
          </div>
        </div>
        <div className="w-[630px]">
          <div className="bg-white border border-[#eaeaea] pt-8 pb-6 pr-6 pl-6 w-full">
            <div className="relative">
              <p className="font-bold text-[11px] reading-[18px] mb-2 text-[#3d3d3d] flex">목표금액</p>
              <input
                id="goalAmount"
                type="text"
                value={numberWithCommas(goalAmount)}
                required
                min={500000}
                autoCapitalize="off"
                autoComplete="off"
                onChange={handleGoalAmountChange}
                placeholder="50만원 이상의 금액을 입력해 주세요"
                className="w-full border px-3 py-2 rounded pr-7 text-right"
              />
              <span
                className={`absolute right-3 ${
                  validationMessage ? "top-[50%]" : "top-[68%]"
                } -translate-y-1/2 text-gray-500 text-sm pointer-events-none`}
              >
                원
              </span>
              {validationMessage && <p className="text-red-500 text-xs mt-1">{validationMessage}</p>}
            </div>
            <div className="bg-[#fcfcfc] rounded-[4px] px-[15px] pt-[25px] pb-[22px]">
              <div className="flex justify-between text-[#3d3d3d] text-xs reading-[19px] pb-4 mb-[11px] border-b border-[#eaeaea]">
                <span>목표 금액 달성 시 예상 수령액</span>
                <em className="not-italic text-[#f86453] text-[18px] leading-[27px] tracking-[-0.02em] font-semibold">
                  {estimatedReceive.toLocaleString()}원
                </em>
              </div>
              <div className="flex justify-between text-[#9e9e9e] text-xs leading-[19px]">
                총 수수료<em>{totalFee.toLocaleString()}원</em>
              </div>
              <div className="flex justify-between text-[#9e9e9e] text-xs leading-[19px]">
                결제대행 수수료 (총 결제 성공 금액의 3% + VAT)<em>{pgFee.toLocaleString()}원</em>
              </div>
              <div className="flex justify-between text-[#9e9e9e] text-xs leading-[19px]">
                Basic 요금제 수수료 (총 결제 성공 금액의 5% + VAT)<em>{platformFee.toLocaleString()}원</em>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
