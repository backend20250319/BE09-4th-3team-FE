"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/header/Header";

export default function HeaderWrapper() {
  const pathname = usePathname();
  // seokgeun의 로그인, 회원가입, 루트에서만 Header 숨김
  const hideHeader =
    pathname === "/seokgeun/login" ||
    pathname === "/seokgeun/register" ||
    pathname === "/seokgeun";

  if (hideHeader) return null;
  return <Header />;
}
