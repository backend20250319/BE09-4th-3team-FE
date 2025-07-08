"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import "./page.css";

// API BASE URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888";

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
  const [phone, setPhone] = useState("");

  // 이메일 인증 관련 상태
  const [emailCode, setEmailCode] = useState("");
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailVerificationError, setEmailVerificationError] = useState("");
  const [emailVerificationTimer, setEmailVerificationTimer] = useState(0);
  const timerRef = React.useRef(null);

  // 로그인 필요 페이지 진입 시 토큰 체크 및 이메일 불러오기
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.replace("/seokgeun/login");
      return;
    }
    // 이메일/연락처 불러오기
    fetchWithAuth("/api/register/user/me")
      .then((res) => (res && res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.email) setEmail(data.email);
        if (data && data.phone) setPhone(data.phone);
      });
  }, [router]);

  // 인증 만료/실패 시 자동 로그아웃 및 리다이렉트 fetch 유틸
  const fetchWithAuth = async (url, options = {}) => {
    const accessToken = localStorage.getItem("accessToken");
    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
    const res = await fetch(fullUrl, {
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

  // 이메일 인증번호 전송
  const handleSendEmailCode = async () => {
    if (!email.trim()) {
      setEmailVerificationError("이메일을 입력해주세요.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailVerificationError("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    setEmailVerificationError("");
    try {
      // 중복 체크
      const checkRes = await fetchWithAuth(
        `/api/register/check-email?email=${encodeURIComponent(email)}`
      );
      if (!checkRes) return;
      const isDup = await checkRes.json();
      if (isDup) {
        setEmailVerificationError("이미 사용 중인 이메일입니다.");
        return;
      }
      // 인증메일 전송 (로그인 불필요)
      const res = await fetch(
        `${API_BASE_URL}/members/emails/verification-requests?email=${encodeURIComponent(
          email
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res || !res.ok) {
        setEmailVerificationError("인증메일 전송에 실패했습니다.");
        return;
      }
      setEmailVerificationSent(true);
      setEmailVerificationError("");
      setEmailVerified(false);
      setEmailCode("");
      setEmailVerificationTimer(60);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setEmailVerificationTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      alert("인증메일이 전송되었습니다. 메일함을 확인해주세요.");
    } catch (e) {
      setEmailVerificationError("인증메일 전송 중 오류가 발생했습니다.");
    }
  };

  // 이메일 인증번호 확인
  const handleVerifyEmailCode = async () => {
    if (!emailVerificationSent) {
      setEmailVerificationError("먼저 인증번호를 발송해주세요.");
      return;
    }
    if (!emailCode.trim()) {
      setEmailVerificationError("인증번호를 입력해주세요.");
      return;
    }
    setEmailVerificationError("");
    try {
      const res = await fetch(
        `${API_BASE_URL}/members/emails/verifications?email=${encodeURIComponent(
          email
        )}&code=${encodeURIComponent(emailCode)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res || !res.ok) {
        setEmailVerified(false);
        setEmailVerificationError("인증 실패");
        return;
      }
      const data = await res.json();
      if (data.data && data.data.success) {
        setEmailVerified(true);
        setEmailVerificationError("");
        alert("이메일 인증이 완료되었습니다. 저장을 눌러 변경을 완료하세요.");
      } else {
        setEmailVerified(false);
        setEmailVerificationError(
          (data.data && data.data.message) || "인증 실패"
        );
      }
    } catch (e) {
      setEmailVerified(false);
      setEmailVerificationError("인증 실패");
    }
  };

  // 이메일 변경 저장
  const handleSaveEmail = async () => {
    if (!emailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }
    try {
      // 먼저 현재 사용자 정보를 가져와서 다른 필드들도 포함
      const userRes = await fetchWithAuth("/api/register/user/me");
      if (!userRes) return;
      const user = await userRes.json();

      // 이메일 변경 API 시도 (여러 가능한 엔드포인트)
      let res = null;

      // 방법 1: 기존 profile 업데이트
      try {
        res = await fetchWithAuth("/api/register/user/me/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            nickname: user.nickname || "",
            phone: user.phone || "",
            address: user.address || "",
            addressDetail: user.addressDetail || "",
          }),
        });
      } catch (e) {
        console.log("방법 1 실패:", e);
      }

      // 방법 2: 별도 이메일 변경 엔드포인트
      if (!res || !res.ok) {
        try {
          res = await fetchWithAuth("/api/register/user/me/email", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
        } catch (e) {
          console.log("방법 2 실패:", e);
        }
      }

      // 방법 3: PUT 메서드로 시도
      if (!res || !res.ok) {
        try {
          res = await fetchWithAuth("/api/register/user/me/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              nickname: user.nickname || "",
              phone: user.phone || "",
              address: user.address || "",
              addressDetail: user.addressDetail || "",
            }),
          });
        } catch (e) {
          console.log("방법 3 실패:", e);
        }
      }

      if (!res) {
        alert(
          "이메일 변경 API에 연결할 수 없습니다. 백엔드 서버를 확인해주세요."
        );
        return;
      }

      if (res.status === 409) {
        alert("이미 사용 중인 이메일입니다.");
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error("이메일 변경 실패:", res.status, errorText);
        alert(`이메일 변경에 실패했습니다. (${res.status})`);
        return;
      }

      alert("이메일이 성공적으로 변경되었습니다.");
      setEditField(null);
      setEmailVerificationSent(false);
      setEmailVerified(false);
      setEmailCode("");
    } catch (e) {
      console.error("이메일 변경 에러:", e);
      alert("이메일 변경 중 오류가 발생했습니다.");
    }
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
          {/* 이메일 변경 영역 */}
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
                {editField === "email" ? (
                  <>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mysettings-profile-value mysettings-email-value"
                      style={{
                        color: "#222",
                        fontWeight: 500,
                        width: 300,
                        marginBottom: 8,
                      }}
                    />
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <button
                        type="button"
                        className="mysettings-edit-btn"
                        style={{
                          background: "#222",
                          color: "#fff",
                          minWidth: 120,
                        }}
                        onClick={handleSendEmailCode}
                        disabled={emailVerificationTimer > 0}
                      >
                        {emailVerificationTimer > 0
                          ? `재요청 (${emailVerificationTimer}s)`
                          : "인증메일 전송"}
                      </button>
                      <button
                        type="button"
                        className="mysettings-edit-btn"
                        style={{
                          background: "#222",
                          color: "#fff",
                          minWidth: 80,
                        }}
                        onClick={() => setEditField(null)}
                      >
                        취소
                      </button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <input
                        type="text"
                        value={emailCode}
                        onChange={(e) => setEmailCode(e.target.value)}
                        placeholder="인증번호 입력"
                        className="mysettings-profile-value"
                        style={{ width: 180 }}
                        disabled={!emailVerificationSent || emailVerified}
                      />
                      <button
                        type="button"
                        className="mysettings-edit-btn"
                        style={{ minWidth: 80 }}
                        onClick={handleVerifyEmailCode}
                        disabled={!emailVerificationSent || emailVerified}
                      >
                        인증확인
                      </button>
                    </div>
                    {emailVerificationError && (
                      <div
                        style={{
                          color: "#d32f2f",
                          fontSize: 13,
                          marginBottom: 4,
                        }}
                      >
                        {emailVerificationError}
                      </div>
                    )}
                    {emailVerified && (
                      <div
                        style={{
                          color: "green",
                          fontSize: 13,
                          marginBottom: 4,
                        }}
                      >
                        인증 완료!
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        className="mysettings-edit-btn"
                        style={{
                          background: "#222",
                          color: "#fff",
                          minWidth: 120,
                        }}
                        onClick={handleSaveEmail}
                        disabled={!emailVerified}
                      >
                        저장
                      </button>
                    </div>
                  </>
                ) : (
                  <span
                    className="mysettings-profile-value mysettings-email-value"
                    style={{ color: "#222", fontWeight: 500 }}
                  >
                    {email}
                  </span>
                )}
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
                {phone || "-"}
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
