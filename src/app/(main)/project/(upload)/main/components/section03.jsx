"use client";
import React from "react";
import usePersistedState from "../hooks/usePersistedState";
import { Asterisk } from "lucide-react";
import { numberWithCommas } from "@/components/utils/number";

export default function Section03({ rewards, setRewards }) {
  const handleRewardChange = (index, field, value) => {
    const newRewards = [...rewards];
    newRewards[index][field] = value;
    setRewards(newRewards);
  };

  // 금액 입력 처리 (숫자만 허용 + 10자리 제한)
  const handleAmountChange = (index, e) => {
    let rawValue = e.target.value.replace(/[^0-9]/g, "");

    if (rawValue.length > 10) {
      rawValue = rawValue.slice(0, 10);
    }

    handleRewardChange(index, "amount", Number(rawValue));
  };

  const addReward = () => {
    setRewards([...rewards, { title: "", amount: 0, description: "" }]);
  };

  return (
    <section>
      {/* 선물 */}
      <div className="space-y-1 flex justify-between pb-12 mb-14 border-b border-[#ddd]">
        <div className=" w-[351px]">
          <h2 className="font-bold  mb-3">선물</h2>
          <p className="text-[#6d6d6d] font-normal text-sm">
            선물은 후원자에게 프로젝트의 가치를 전달하는 수단입니다. 다양한 금액대로 여러 개의 선물을 만들어주세요.
            프로젝트 성공률이 높아지고, 더 많은 후원 금액을 모금할 수 있어요.
          </p>
        </div>
        <div className="w-[630px]">
          <div className="flex items-center mb-2">
            <p className="text-[12px] leading-[18px] text-[#3d3d3d] font-bold">선물</p>
            <Asterisk color="#ff0000" strokeWidth={2} size={13} />
          </div>
          {rewards.map((reward, index) => (
            <div key={index} className="border p-3 rounded-md mb-3 space-y-2 bg-gray-50">
              <div>
                <label
                  htmlFor={`reward-title-${index}`}
                  className="text-[12px] leading-[18px] text-[#3d3d3d] font-bold"
                >
                  선물 이름
                </label>
                <input
                  id={`reward-title-${index}`}
                  type="text"
                  value={reward.title}
                  placeholder="선물의 이름을 입력해주세요"
                  onChange={(e) => handleRewardChange(index, "title", e.target.value)}
                  className="w-full border px-3 py-2 rounded placeholder:text-sm"
                />
              </div>

              <div className="relative">
                <label
                  htmlFor={`reward-amount-${index}`}
                  className="text-[12px] leading-[18px] text-[#3d3d3d] font-bold"
                >
                  선물 금액
                </label>
                <input
                  id={`reward-amount-${index}`}
                  type="text"
                  value={numberWithCommas(reward.amount)}
                  onChange={(e) => handleAmountChange(index, e)}
                  placeholder="선물의 금액을 입력해주세요"
                  className="w-full border px-3 py-2 rounded pr-7 text-right placeholder:text-sm"
                  autoCapitalize="off"
                  autoComplete="off"
                  inputMode="numeric"
                />
                <span
                  className={`absolute right-3 top-[66%] -translate-y-1/2 text-gray-500 text-sm pointer-events-none`}
                >
                  원
                </span>
              </div>

              <div>
                <label
                  htmlFor={`reward-description-${index}`}
                  className="text-[12px] leading-[18px] text-[#3d3d3d] font-bold"
                >
                  선물 설명
                </label>
                <textarea
                  id={`reward-description-${index}`}
                  value={reward.description}
                  placeholder="간단한 선물의 설명을 입력해주세요"
                  onChange={(e) => handleRewardChange(index, "description", e.target.value)}
                  className="w-full border px-2 py-1 rounded placeholder:text-sm"
                />
              </div>
            </div>
          ))}

          <button type="button" onClick={addReward} className="text-blue-600 hover:underline text-sm">
            + 선물 추가
          </button>
        </div>
      </div>
    </section>
  );
}
