"use client";
import React from "react";
import usePersistedState from "../hooks/usePersistedState";

export default function Section04() {
  const [rewards, setRewards] = usePersistedState("project_rewards", [{ title: "", amount: 0, description: "" }]);

  const handleRewardChange = (index, field, value) => {
    const newRewards = [...rewards];
    newRewards[index][field] = value;
    setRewards(newRewards);
  };

  const addReward = () => {
    setRewards([...rewards, { title: "", amount: 0, description: "" }]);
  };

  return (
    <section>
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
    </section>
  );
}
