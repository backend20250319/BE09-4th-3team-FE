import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="flex justify-center mt-[116px]">
      <Link href={"/project/intro"}>프로젝트 등록</Link>
    </div>
  );
}
