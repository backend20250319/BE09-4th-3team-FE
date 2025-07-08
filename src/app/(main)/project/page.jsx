import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="flex justify-center items-center mt-[116px] flex-col gap-5">
      <Link href={"/project/intro"}>프로젝트 등록</Link>
      <Link href={"/project/list"}>프로젝트 목록</Link>
    </div>
  );
}
