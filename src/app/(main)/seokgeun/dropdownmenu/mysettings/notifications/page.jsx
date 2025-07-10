"use client";
import React, { useEffect } from "react";
import "./page.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const notifications = [
  {
    label: "메시지",
    desc: "새 메시지 알림을 이메일로 수신합니다.",
  },
  {
    label: "프로젝트 업데이트",
    desc: "프로젝트 업데이트 알림을 이메일로 수신합니다.",
  },
  {
    label: "알림신청 프로젝트",
    desc: "알림신청한 프로젝트가 공개되었다는 알림을 이메일로 수신합니다.",
  },
  {
    label: "좋아한 프로젝트",
    desc: "좋아한 프로젝트의 마감일이 임박했다는 알림을 이메일로 수신합니다.",
  },
  {
    label: "팔로우",
    desc: "필요로한 사용자의 프로젝트 추천 알림을 이메일로 수신합니다.",
  },
  {
    label: "마케팅 메일",
    desc: "텀블벅 신규 콘텐츠 및 프로젝트 추천 알림을 이메일로 수신합니다.",
  },
];

const TABS = [
  { label: "프로필", path: "/seokgeun/dropdownmenu/mysettings/profile" },
  { label: "계정", path: "/seokgeun/dropdownmenu/mysettings/account" },
  { label: "결제수단", path: "/seokgeun/dropdownmenu/mysettings/pay_methods" },
  { label: "배송지", path: "/seokgeun/dropdownmenu/mysettings/addresses" },
  { label: "알림", path: "/seokgeun/dropdownmenu/mysettings/notifications" },
];

export default function NotificationsPage() {
  const router = useRouter();
  const pathname = usePathname();

  // 로그인 필요 페이지 진입 시 토큰 체크
  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      router.replace("/seokgeun/login");
    }
  }, [router]);

  // 인증 만료/실패 시 자동 로그아웃 및 리다이렉트 fetch 유틸
  const fetchWithAuth = async (url, options = {}) => {
    const accessToken = sessionStorage.getItem("accessToken");
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.status === 401 || res.status === 419) {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
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
        {/* 알림 메인 영역 */}
        <form
          className="mysettings-profile-table"
          onSubmit={(e) => e.preventDefault()}
          style={{ width: "100%" }}
        >
          {notifications.map((item, idx) => (
            <div className="mysettings-profile-row" key={item.label}>
              <div className="mysettings-profile-col">
                <div className="mysettings-profile-label">{item.label}</div>
                <div
                  className="mysettings-profile-value"
                  style={{ fontSize: 14, color: "#444", marginTop: 8 }}
                >
                  <span style={{ color: "#222", fontSize: 15, marginRight: 4 }}>
                    ✔
                  </span>{" "}
                  {item.desc}
                </div>
              </div>
              <div className="mysettings-profile-action-col">
                <button className="mysettings-edit-btn" type="button">
                  변경
                </button>
              </div>
            </div>
          ))}
        </form>
        {/* 우측 안내 영역 */}
        <div className="mysettings-profile-guide-block">
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            어떤 이메일로 알림을 받나요?
          </div>
          <div style={{ color: "#888", fontSize: 14 }}>
            회원님의 로그인 이메일 <b>(choskgeun@gmail.com)</b> 으로 알림 메일을
            수신하게 됩니다.
            <br />
            변경을 원하실 경우 계정 설정 항목에서 이메일을 변경해주세요.
          </div>
        </div>
      </div>
    </div>
  );
}
