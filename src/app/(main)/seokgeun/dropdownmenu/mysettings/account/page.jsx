"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import "./page.css";

const TABS = [
  { label: "프로필", path: "/seokgeun/dropdownmenu/mysettings/profile" },
  { label: "계정", path: "/seokgeun/dropdownmenu/mysettings/account" },
  { label: "결제수단", path: "/seokgeun/dropdownmenu/mysettings/pay_methods" },
  { label: "배송지", path: "/seokgeun/dropdownmenu/mysettings/addresses" },
  { label: "알림", path: "/seokgeun/dropdownmenu/mysettings/notifications" },
];

export default function AccountPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [editField, setEditField] = useState(null); // 'email' | 'password' | null
  const [email, setEmail] = useState("chosukgeun@gmail.com");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  // 이메일 저장 핸들러
  const handleSaveEmail = () => {
    setEditField(null);
  };

  // 비밀번호 저장 핸들러
  const handleSavePassword = () => {
    setEditField(null);
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
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
        <form
          className="mysettings-profile-table"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* 이메일 */}
          <div className="mysettings-profile-row email-row">
            <div className="mysettings-profile-col">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div className="mysettings-profile-label">이메일</div>
                <button
                  className="mysettings-edit-btn"
                  type="button"
                  onClick={() => setEditField("email")}
                >
                  변경
                </button>
              </div>
              <div style={{ marginTop: 8 }}>
                <span
                  className="mysettings-profile-value mysettings-email-value"
                  style={{ color: "#d32f2f", fontWeight: 500 }}
                >
                  {email}
                </span>
                <div
                  className="mysettings-profile-desc-guide mysettings-email-guide"
                  style={{ color: "#d32f2f", fontSize: 13, marginTop: 2 }}
                >
                  <span>ⓘ 미인증 이메일입니다.</span>
                </div>
              </div>
            </div>
          </div>
          {/* 비밀번호 */}
          <div className="mysettings-profile-row password-row">
            <div className="mysettings-profile-col">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div className="mysettings-profile-label">비밀번호</div>
                <button
                  className="mysettings-edit-btn"
                  type="button"
                  onClick={() => setEditField("password")}
                >
                  변경
                </button>
              </div>
              <div style={{ marginTop: 8 }}>
                <span className="mysettings-profile-value">********</span>
              </div>
            </div>
          </div>
          {/* 연락처 */}
          <div className="mysettings-profile-row">
            <div className="mysettings-profile-col">
              <div className="mysettings-profile-label">연락처</div>
              <div className="mysettings-profile-value">
                01072542711
                <br />
                <span style={{ color: "#aaa", fontSize: 13 }}>
                  연락처는 한 번 1회 변경 가능합니다.
                </span>
              </div>
            </div>
            <div className="mysettings-profile-action-col">
              <button className="mysettings-edit-btn" type="button">
                변경
              </button>
            </div>
          </div>
          {/* 소셜 연동 */}
          <div className="mysettings-profile-row">
            <div className="mysettings-profile-col">
              <div className="mysettings-profile-label">카카오 계정 연동</div>
              <div className="mysettings-profile-value">
                <span style={{ color: "#222" }}>✔ 연동 중입니다.</span>
              </div>
            </div>
            <div className="mysettings-profile-action-col">
              <button
                className="mysettings-edit-btn"
                type="button"
                style={{ background: "#191919", color: "#fff" }}
              >
                연동 해제
              </button>
            </div>
          </div>
          <div className="mysettings-profile-row">
            <div className="mysettings-profile-col">
              <div className="mysettings-profile-label">페이스북 계정 연동</div>
              <div className="mysettings-profile-value">
                연동된 페이스북 계정이 없습니다.
              </div>
            </div>
            <div className="mysettings-profile-action-col">
              <button className="mysettings-edit-btn" type="button">
                연동
              </button>
            </div>
          </div>
          <div className="mysettings-profile-row">
            <div className="mysettings-profile-col">
              <div className="mysettings-profile-label">네이버 계정 연동</div>
              <div className="mysettings-profile-value">
                연동된 네이버 계정이 없습니다.
              </div>
            </div>
            <div className="mysettings-profile-action-col">
              <button className="mysettings-edit-btn" type="button">
                연동
              </button>
            </div>
          </div>
          <div className="mysettings-profile-row">
            <div className="mysettings-profile-col">
              <div className="mysettings-profile-label">애플 계정 연동</div>
              <div className="mysettings-profile-value">
                연동된 애플 계정이 없습니다.
              </div>
            </div>
            <div className="mysettings-profile-action-col">
              <button className="mysettings-edit-btn" type="button">
                연동
              </button>
            </div>
          </div>
          {/* 회원탈퇴 */}
          <div className="mysettings-profile-row">
            <div className="mysettings-profile-col">
              <div className="mysettings-profile-label">회원탈퇴</div>
            </div>
            <div className="mysettings-profile-action-col">
              <button
                className="mysettings-edit-btn"
                type="button"
                style={{ color: "#d32f2f", borderColor: "#d32f2f" }}
              >
                탈퇴
              </button>
            </div>
          </div>
        </form>
        {/* 우측 안내 영역 */}
        <div className="mysettings-profile-guide-block">
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            이메일과 연락처는 어디에 쓰이나요?
          </div>
          <div style={{ color: "#888", fontSize: 14 }}>
            이메일과 연락처로 프로젝트, 후원 및 결제 관련 알림을 드립니다.
            <br />
            배송 받는 문의 연락처는 개별 후원내역에서 설정해주세요.
            <br />
            <a
              href="#"
              style={{
                color: "#1976d2",
                textDecoration: "underline",
                fontWeight: 500,
              }}
            >
              내 후원현황 바로가기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
