"use client";
import React from "react";
import usePersistedState from "../hooks/usePersistedState";

export default function Section02() {
  const [startLine, setStartLine] = usePersistedState("project_startLine", "");
  const [deadLine, setDeadLine] = usePersistedState("project_deadLine", "");
  const [accountNumber, setAccountNumber] = usePersistedState("project_accountNumber", "");
  const [creatorName, setCreatorName] = usePersistedState("project_creatorName", "");
  const [creatorInfo, setCreatorInfo] = usePersistedState("project_creatorInfo", "");

  return (
    <section>
      {/* 시작일 / 종료일 */}
      <div className="flex gap-5">
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
    </section>
  );
}
