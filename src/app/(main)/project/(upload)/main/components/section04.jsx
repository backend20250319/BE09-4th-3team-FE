"use client";
import React from "react";
import usePersistedState from "../hooks/usePersistedState";
import { Asterisk } from "lucide-react";

export default function Section04({ creatorName, setCreatorName, creatorInfo, setCreatorInfo }) {
  return (
    <section>
      {/* 창작자 이름 */}
      <div className="space-y-1 flex justify-between pb-12 mb-14 border-b border-[#ddd]">
        <div className=" w-[351px]">
          <h2 className="font-bold  mb-3">창작자 이름</h2>
          <p className="text-[#6d6d6d] font-normal text-sm">창작자 개인이나 팀을 대표할 수 있는 이름을 써주세요.</p>
        </div>
        <div className="w-[630px]">
          <div className="flex items-center mb-2">
            <p className="text-[12px] leading-[18px] text-[#3d3d3d] font-bold">이름</p>
            <Asterisk color="#ff0000" strokeWidth={2} size={13} />
          </div>
          <input
            id="creatorName"
            type="text"
            value={creatorName}
            placeholder="창작자님의 이름을 입력해주세요"
            required
            onChange={(e) => setCreatorName(e.target.value)}
            className="w-full border px-3 py-2 rounded placeholder:text-sm"
          />
        </div>
      </div>

      {/* 창작자 소개 */}
      <div className="space-y-1 flex justify-between pb-12 mb-14 border-b border-[#ddd]">
        <div className=" w-[351px]">
          <h2 className="font-bold  mb-3">창작자 소개</h2>
          <p className="text-[#6d6d6d] font-normal text-sm">2~3문장으로 창작자님의 이력과 간단한 소개를 써주세요.</p>
        </div>
        <div className="w-[630px]">
          <div className="flex items-center mb-2">
            <p className="text-[12px] leading-[18px] text-[#3d3d3d] font-bold">소개</p>
            <Asterisk color="#ff0000" strokeWidth={2} size={13} />
          </div>
          <input
            id="creatorInfo"
            type="text"
            value={creatorInfo}
            placeholder="간단한 이력과 소개를 써주세요"
            required
            onChange={(e) => setCreatorInfo(e.target.value)}
            className="w-full border px-3 py-2 rounded placeholder:text-sm"
          />
        </div>
      </div>
    </section>
  );
}
