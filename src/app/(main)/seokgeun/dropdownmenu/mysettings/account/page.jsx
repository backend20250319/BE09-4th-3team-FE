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

  // 비밀번호 변경 관련 상태
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState("");

  // 연락처 변경 관련 상태
  const [editPhone, setEditPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneSuccess, setPhoneSuccess] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  // 로그인 필요 페이지 진입 시 토큰 체크 및 이메일 불러오기
  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
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

  useEffect(() => {
    if (!confirmPassword) {
      setPasswordMatchError("");
    } else if (newPassword !== confirmPassword) {
      setPasswordMatchError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordMatchError("");
    }
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    setPhoneInput(phone || "");
  }, [phone]);

  // 인증 만료/실패 시 자동 로그아웃 및 리다이렉트 fetch 유틸
  const fetchWithAuth = async (url, options = {}) => {
    const accessToken = sessionStorage.getItem("accessToken");
    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
    const res = await fetch(fullUrl, {
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
      // 현재 사용자 정보 가져오기
      const userRes = await fetchWithAuth("/api/register/user/me");
      if (!userRes) return;
      const user = await userRes.json();

      // 석근 : PATCH만 시도 (PUT, /email 엔드포인트는 사용하지 않음)
      const res = await fetchWithAuth("/api/register/user/me/profile", {
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
  const handleSavePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    // 1. 입력값 검증
    if (!password || !newPassword || !confirmPassword) {
      setPasswordError("모든 항목을 입력해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("변경할 비밀번호가 일치하지 않습니다.");
      return;
    }
    if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
        newPassword
      )
    ) {
      setPasswordError("비밀번호는 영문+숫자+특수문자 포함 8~20자여야 합니다.");
      return;
    }

    // 2. API 요청
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      const res = await fetch("/api/register/user/me/password_update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          currentPassword: password,
          newPassword: newPassword,
        }),
      });
      if (!res.ok) {
        let data;
        try {
          data = await res.json();
        } catch {
          data = {};
        }
        setPasswordError(data.message || "비밀번호 변경에 실패했습니다.");
        return;
      }
      setPasswordSuccess("비밀번호가 성공적으로 변경되었습니다.");
      setShowPasswordModal(true);
      setEditField(null);
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      setPasswordError("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  const handlePhoneInputChange = async (e) => {
    const value = e.target.value;
    setPhoneInput(value);
    setPhoneError("");
    setPhoneSuccess("");

    // 000-0000-0000 형식 체크
    const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(value)) {
      setPhoneError("연락처는 000-0000-0000 형식으로 입력해주세요.");
      return;
    }

    // DB 저장
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      const res = await fetch("/api/register/user/me/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ phone: value }),
      });
      if (!res.ok) {
        setPhoneError("연락처 변경에 실패했습니다.");
        return;
      }
      setPhoneSuccess("연락처가 성공적으로 변경되었습니다.");
      setPhone(value);
      setEditPhone(false);
    } catch {
      setPhoneError("연락처 변경 중 오류가 발생했습니다.");
    }
  };

  const handlePhoneSave = async () => {
    setPhoneError("");
    setPhoneSuccess("");
    const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(phoneInput)) {
      setPhoneError("연락처는 000-0000-0000 형식으로 입력해주세요.");
      return;
    }
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      // 기존 사용자 정보 불러오기
      const userRes = await fetch("/api/register/user/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!userRes.ok) {
        setPhoneError("사용자 정보를 불러오지 못했습니다.");
        return;
      }
      const user = await userRes.json();
      // PATCH 요청에 모든 필수 필드 포함
      const res = await fetch("/api/register/user/me/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          nickname: user.nickname,
          email: user.email,
          phone: phoneInput,
          address: user.address || "",
          addressDetail: user.addressDetail || "",
        }),
      });
      if (!res.ok) {
        setPhoneError("연락처 변경에 실패했습니다.");
        return;
      }
      setPhoneSuccess("연락처가 성공적으로 변경되었습니다.");
      setPhone(phoneInput);
      setEditPhone(false);
      setShowPhoneModal(true);
    } catch {
      setPhoneError("연락처 변경 중 오류가 발생했습니다.");
    }
  };

  const handlePhoneCancel = () => {
    setEditPhone(false);
    setPhoneInput(phone || "");
    setPhoneError("");
    setPhoneSuccess("");
  };

  // 탈퇴 처리 함수 추가
  const handleWithdraw = async () => {
    if (
      !window.confirm(
        "정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    )
      return;
    const accessToken = sessionStorage.getItem("accessToken");
    try {
      const res = await fetch("/api/register/user/me_quit", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.ok) {
        alert("회원 탈퇴가 완료되었습니다.");
        // 로그아웃 처리 및 메인/로그인 페이지로 이동
        sessionStorage.clear();
        window.location.href = "/seokgeun/login";
      } else {
        const msg = await res.text();
        alert("회원 탈퇴 실패: " + msg);
      }
    } catch (e) {
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    }
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
              <div className="mysettings-profile-label">이메일</div>
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
            <div className="mysettings-profile-action-col">
              {editField === "email" ? (
                <button
                  className="mysettings-edit-btn"
                  type="button"
                  style={{ background: "#222", color: "#fff" }}
                  onClick={() => setEditField(null)}
                >
                  취소
                </button>
              ) : (
                <button
                  className="mysettings-edit-btn"
                  type="button"
                  onClick={() => setEditField("email")}
                >
                  변경
                </button>
              )}
            </div>
          </div>
          {/* 비밀번호 */}
          <div className="mysettings-profile-row password-row">
            <div className="mysettings-profile-col">
              <div className="mysettings-profile-label">비밀번호</div>
              <div style={{ marginTop: 8 }}>
                {/* 석근 : 비밀번호 변경 폼 */}
                {editField === "password" ? (
                  <div style={{ maxWidth: 400, marginTop: 16 }}>
                    <div style={{ marginBottom: 20 }}>
                      <div
                        className="mysettings-profile-label"
                        style={{ marginTop: 0 }}
                      >
                        현재 비밀번호
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="mysettings-profile-value"
                          placeholder="현재 비밀번호"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword((v) => !v)}
                          style={{
                            marginLeft: 8,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 20,
                          }}
                          tabIndex={-1}
                          aria-label={
                            showCurrentPassword
                              ? "비밀번호 숨기기"
                              : "비밀번호 표시"
                          }
                        >
                          {showCurrentPassword ? "🙈" : "👁️"}
                        </button>
                      </div>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <div
                        className="mysettings-profile-label"
                        style={{ marginTop: 0 }}
                      >
                        새 비밀번호
                      </div>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mysettings-profile-value"
                        placeholder="새 비밀번호"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((v) => !v)}
                        style={{
                          marginLeft: 8,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 20,
                        }}
                        tabIndex={-1}
                        aria-label={
                          showNewPassword ? "비밀번호 숨기기" : "비밀번호 표시"
                        }
                      >
                        {showNewPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <div
                        className="mysettings-profile-label"
                        style={{ marginTop: 0 }}
                      >
                        새 비밀번호 확인
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mysettings-profile-value"
                        placeholder="새 비밀번호 확인"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        style={{
                          marginLeft: 8,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 20,
                        }}
                        tabIndex={-1}
                        aria-label={
                          showConfirmPassword
                            ? "비밀번호 숨기기"
                            : "비밀번호 표시"
                        }
                      >
                        {showConfirmPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                    {passwordError && (
                      <div
                        style={{
                          color: "#d32f2f",
                          fontSize: 13,
                          marginBottom: 4,
                        }}
                      >
                        {passwordError}
                      </div>
                    )}
                    {passwordSuccess && (
                      <div
                        style={{
                          color: "green",
                          fontSize: 13,
                          marginBottom: 4,
                        }}
                      >
                        {passwordSuccess}
                      </div>
                    )}
                    {passwordMatchError && (
                      <div
                        style={{
                          color: "#d32f2f",
                          fontSize: 13,
                          marginBottom: 4,
                        }}
                      >
                        {passwordMatchError}
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
                        onClick={handleSavePassword}
                      >
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <span
                    className="mysettings-profile-value"
                    style={{ color: "#222", fontWeight: 500 }}
                  >
                    ********
                  </span>
                )}
              </div>
            </div>
            <div className="mysettings-profile-action-col">
              {editField === "password" ? (
                <button
                  className="mysettings-edit-btn"
                  type="button"
                  style={{ background: "#222", color: "#fff" }}
                  onClick={() => setEditField(null)}
                >
                  취소
                </button>
              ) : (
                <button
                  className="mysettings-edit-btn"
                  type="button"
                  onClick={() => setEditField("password")}
                >
                  변경
                </button>
              )}
            </div>
          </div>
          {/* 연락처 */}
          <div className="mysettings-profile-row">
            <div className="mysettings-profile-col">
              <div className="mysettings-profile-label">연락처</div>
              {editPhone ? (
                <div>
                  <div
                    className="mysettings-profile-label"
                    style={{ marginBottom: 8 }}
                  >
                    변경할 연락처
                  </div>
                  <input
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="mysettings-profile-value"
                    placeholder="000-0000-0000"
                    autoFocus
                  />
                  {phoneError && (
                    <div style={{ color: "red", fontSize: 13 }}>
                      {phoneError}
                    </div>
                  )}
                  {phoneSuccess && (
                    <div style={{ color: "green", fontSize: 13 }}>
                      {phoneSuccess}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button
                      className="mysettings-save-btn"
                      type="button"
                      onClick={handlePhoneSave}
                      disabled={!/^\d{3}-\d{3,4}-\d{4}$/.test(phoneInput)}
                    >
                      저장
                    </button>
                    <button
                      className="mysettings-cancel-btn"
                      type="button"
                      onClick={handlePhoneCancel}
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <span className="mysettings-profile-value">{phone || "-"}</span>
              )}
              <br />
            </div>
            <div className="mysettings-profile-action-col">
              <button
                className="mysettings-edit-btn"
                type="button"
                onClick={() => {
                  if (editPhone) {
                    setEditPhone(false);
                    setPhoneInput(phone || "");
                    setPhoneError("");
                    setPhoneSuccess("");
                  } else {
                    setEditPhone(true);
                  }
                }}
                style={editPhone ? { background: "#222", color: "#fff" } : {}}
              >
                {editPhone ? "취소" : "변경"}
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
                onClick={handleWithdraw}
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
              href="/seokgeun/dropdownmenu/sponsoredprojects"
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
      {/* 모달창: 비밀번호 변경 성공 */}
      {showPasswordModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "32px 40px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>
              비밀번호가 성공적으로 변경되었습니다.
            </div>
            <button
              className="mysettings-save-btn"
              style={{ minWidth: 100, fontSize: 16 }}
              onClick={() => setShowPasswordModal(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}
      {/* 모달창: 연락처 변경 성공 */}
      {showPhoneModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "32px 40px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>
              연락처가 성공적으로 변경되었습니다.
            </div>
            <button
              className="mysettings-save-btn"
              style={{ minWidth: 100, fontSize: 16 }}
              onClick={() => setShowPhoneModal(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
