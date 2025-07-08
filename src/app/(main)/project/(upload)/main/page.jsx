"use client";

import React from "react";

import axios from "axios";
import Section01 from "./components/section01";
import Section02 from "./components/section02";
import Section03 from "./components/section03";
import Section04 from "./components/section04";

export default function Page() {
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

    const parseSafeNumber = (val) => {
      const n = Number(val);
      return isNaN(n) ? 0 : n;
    };

    const stripQuotes = (value) => value.replace(/^"|"$/g, "");

    const payload = {
      title: localStorage.getItem("project_title") ?? "",
      description: localStorage.getItem("project_description") ?? "",
      goalAmount: parseSafeNumber(localStorage.getItem("project_goalAmount")),
      startLine: stripQuotes(localStorage.getItem("project_startLine") ?? ""),
      deadLine: stripQuotes(localStorage.getItem("project_deadLine") ?? ""),
      accountNumber: localStorage.getItem("project_accountNumber") ?? "",
      categoryNo: parseSafeNumber(localStorage.getItem("project_categoryNo")),
      creatorName: localStorage.getItem("project_creatorName") ?? "",
      creatorInfo: localStorage.getItem("project_creatorInfo") ?? "",
      thumbnailUrl: localStorage.getItem("project_thumbnailUrl") ?? "",
      rewards: JSON.parse(localStorage.getItem("project_rewards") ?? "[]"),
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
      clearLocalStorage();
      window.location.reload();
    } catch (err) {
      console.error("프로젝트 등록 실패", err);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center pt-[84px]">
      <form onSubmit={handleSubmit} className="w-[1080px] mx-auto p-4 space-y-6">
        <Section01 />

        <Section02 />

        <Section03 />

        <Section04 />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          프로젝트 등록
        </button>
      </form>
    </div>
  );
}
