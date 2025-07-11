"use client";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="relative w-full">
      <div className="relative overflow-hidden flex w-full items-center justify-center flex-col bg-white">
        <div className="w-[1160px] flex flex-row justify-between max-h-[220px] min-h-[178px]">
          <div className="mt-6 flex">
            <div className="flex-nowrap">
              <ul className="min-w-[160px] flex-wrap text-[#6d6d6d] font-medium text-sm leading-[22px] gap-3 flex flex-col">
                <li className="text-base font-bold text-[#3d3d3d]">
                  <h2>텀블벅</h2>
                </li>
                <li className="hover:text-[#1c1c1c] hover:font-semibold transition-all duration-300 ease-in-out">
                  <Link href={"#"}>공지사항</Link>
                </li>
                <li className="hover:text-[#1c1c1c] hover:font-semibold transition-all duration-300 ease-in-out">
                  <Link href={"#"}>서비스 소개</Link>
                </li>
                <li className="hover:text-[#1c1c1c] hover:font-semibold transition-all duration-300 ease-in-out">
                  <Link href={"#"}> 채용</Link>
                </li>
                <li className="hover:text-[#1c1c1c] hover:font-semibold transition-all duration-300 ease-in-out">
                  <Link href={"#"}>2024 텀블벅 결산</Link>
                </li>
                <li className="text-[#FA6462]">
                  <Link href={"#"}>텀블벅 광고센터</Link>
                </li>
              </ul>
            </div>
          </div>
          <div></div>
        </div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </footer>
  );
}
