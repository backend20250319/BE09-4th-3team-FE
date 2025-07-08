"use client";
import React, { useEffect } from "react";
import "./page.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const TABS = [
  { label: "프로필", path: "/seokgeun/dropdownmenu/mysettings/profile" },
  { label: "계정", path: "/seokgeun/dropdownmenu/mysettings/account" },
  { label: "결제수단", path: "/seokgeun/dropdownmenu/mysettings/pay_methods" },
  { label: "배송지", path: "/seokgeun/dropdownmenu/mysettings/addresses" },
  { label: "알림", path: "/seokgeun/dropdownmenu/mysettings/notifications" },
];

export default function PayMethodsPage() {
  const router = useRouter();
  const pathname = usePathname();

  // 로그인 필요 페이지 진입 시 토큰 체크
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.replace("/seokgeun/login");
    }
  }, [router]);

  // 인증 만료/실패 시 자동 로그아웃 및 리다이렉트 fetch 유틸
  const fetchWithAuth = async (url, options = {}) => {
    const accessToken = localStorage.getItem("accessToken");
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.status === 401 || res.status === 419) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
      router.replace("/seokgeun/login");
      return null;
    }
    return res;
  };

  return (
    <div className="mysettings-main-container">
      <h1 className="mysettings-title">설정</h1>
      <div className="mysettings-horizontal-tabs">
        {TABS.map((tab) => (
          <Link
            key={tab.path}
            href={tab.path}
            className={`mysettings-horizontal-tab${
              pathname === tab.path ? " active" : ""
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <div className="mysettings-profile-table-row-wrapper">
        {/* 결제수단 메인 영역 */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 16 }}>등록된 결제수단</div>
            <button
              className="mysettings-edit-btn"
              style={{ fontWeight: 700, fontSize: 15, padding: "4px 18px" }}
            >
              + 추가
            </button>
          </div>
          <div
            style={{
              border: "1.5px solid #ececec",
              borderRadius: 8,
              minHeight: 180,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#fafafa",
              marginBottom: 0,
            }}
          >
            <div style={{ fontSize: 48, color: "#bbb", marginBottom: 8 }}>
              &#33;
            </div>
            <div
              style={{
                color: "#888",
                fontSize: 16,
                fontWeight: 500,
                marginBottom: 4,
              }}
            >
              등록된 결제수단이 없습니다.
            </div>
            <div style={{ color: "#bbb", fontSize: 15 }}>
              결제수단을 추가해주세요.
            </div>
          </div>
        </div>
        {/* 우측 안내 영역 */}
        <div className="mysettings-profile-guide-block">
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            결제수단을 등록/삭제하면 현재 후원에 등록한 결제수단이
            변경/삭제되나요?
          </div>
          <div style={{ color: "#888", fontSize: 14 }}>
            아닙니다. 여기서 결제수단을 등록/삭제해도 이미 후원에 등록된
            결제수단이 변경/삭제되지 않습니다.
            <br />
            이런 변경을 원하시면 후원함(마이페이지)에서 변경해주세요.
            <br />
            <a
              href="#"
              style={{
                color: "#1976d2",
                textDecoration: "underline",
                fontWeight: 500,
              }}
            >
              후원함으로 바로가기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
