"use client";

import Header from "@/components/header/Header";
import React, { useState, useEffect, useRef } from "react";
import termsText from "./termsText";
import styles from "./register.module.css";
import { useRouter } from "next/navigation";

// API BASE URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888";

// ------- 중복 확인 함수 -------
const checkUserId = async (userId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/register/check-user-id?userId=${encodeURIComponent(
        userId
      )}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (err) {
    return false;
  }
};
const checkNickname = async (nickname) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/register/check-nickname?nickname=${encodeURIComponent(
        nickname
      )}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (err) {
    return false;
  }
};
const checkEmail = async (email) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/register/check-email?email=${encodeURIComponent(
        email
      )}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (err) {
    return false;
  }
};
const checkPhone = async (phone) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/register/check-phone?phone=${encodeURIComponent(
        phone
      )}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (err) {
    return false;
  }
};

// ------- 메인 컴포넌트 -------
export default function Page() {
  // 폼 입력 데이터
  const [form, setForm] = useState({
    userId: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    address: "",
    addressDetail: "",
    phone: "",
    email: "",
    termsAll: false,
    termsService: false,
    termsPrivacy: false,
    termsMarketingSms: false,
    termsMarketingEmail: false,
  });

  // 상태
  const [formErrors, setFormErrors] = useState({});
  const [userIdValid, setUserIdValid] = useState(null);
  const [nicknameValid, setNicknameValid] = useState(null);
  const [emailValid, setEmailValid] = useState(null);
  const [phoneValid, setPhoneValid] = useState(null);

  // 이메일 인증
  const [emailCode, setEmailCode] = useState(""); // 입력한 인증코드
  const [emailVerified, setEmailVerified] = useState(false); // 인증 성공여부
  const [emailVerificationSent, setEmailVerificationSent] = useState(false); // 인증번호 발송됨
  const [emailVerificationError, setEmailVerificationError] = useState(""); // 에러 메시지
  const [emailVerificationTimer, setEmailVerificationTimer] = useState(0); // 재요청 제한(초)
  const timerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 주소 API 로딩
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      const existingScript = document.querySelector(
        'script[src*="postcode.v2.js"]'
      );
      if (existingScript) document.body.removeChild(existingScript);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 개별 필드 유효성 검사
  const validateField = (name, value) => {
    switch (name) {
      case "userId":
        return !/^[a-zA-Z0-9]{5,20}$/.test(value)
          ? "아이디는 영문+숫자 5~20자여야 합니다."
          : "";
      case "password":
        return !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
          value
        )
          ? "비밀번호는 영문 대소문자+숫자+특수문자 포함 8~20자여야 합니다."
          : "";
      case "confirmPassword":
        return value !== form.password ? "비밀번호가 일치하지 않습니다." : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "올바른 이메일 형식이 아닙니다."
          : "";
      case "phone":
        return !/^01[016789]-?\d{3,4}-?\d{4}$/.test(value)
          ? "유효한 전화번호를 입력해주세요.(예:010-1234-1234)"
          : "";
      default:
        return "";
    }
  };

  // 전체 폼 유효성 검사
  const validateForm = () => {
    const errors = {};
    for (const name of [
      "userId",
      "password",
      "confirmPassword",
      "email",
      "phone",
    ])
      errors[name] = validateField(name, form[name]);
    setFormErrors(errors);
    return Object.values(errors).every((msg) => msg === "");
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));

    // 중복확인/이메일 인증 상태 초기화
    if (["userId", "nickname", "email", "phone"].includes(name)) {
      if (name === "userId") setUserIdValid(null);
      if (name === "nickname") setNicknameValid(null);
      if (name === "email") {
        setEmailValid(null);
        setEmailVerified(false);
        setEmailVerificationSent(false);
        setEmailVerificationError("");
        setEmailCode("");
      }
      if (name === "phone") setPhoneValid(null);
    }

    // 즉시 유효성 검사
    if (
      ["userId", "password", "confirmPassword", "email", "phone"].includes(name)
    ) {
      const msg = validateField(name, newValue);
      setFormErrors((prev) => ({ ...prev, [name]: msg }));
      if (name === "password" && form.confirmPassword) {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: validateField(
            "confirmPassword",
            form.confirmPassword
          ),
        }));
      }
    }
  };

  // 주소 검색
  const handleAddressSearch = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: (data) => {
          setForm((prev) => ({
            ...prev,
            address: data.roadAddress || data.jibunAddress,
          }));
        },
      }).open();
    } else {
      alert("주소 API 로딩 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };

  // ============ 이메일 인증 ============
  const sendEmailCode = async (email) => {
    const res = await fetch(
      `${API_BASE_URL}/members/emails/verification-requests?email=${encodeURIComponent(
        email
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ email }), // body 제거
      }
    );
    if (!res.ok) {
      const data = await res.text();
      throw new Error(data || "인증번호 요청 실패");
    }
    return true;
  };
  const verifyEmailCode = async (email, code) => {
    const res = await fetch(
      `${API_BASE_URL}/members/emails/verifications?email=${encodeURIComponent(
        email
      )}&code=${encodeURIComponent(code)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ email, code }), // GET에는 body가 없어야 함
      }
    );
    if (!res.ok) {
      const data = await res.text();
      throw new Error(data || "인증 실패");
    }
    return await res.json();
  };
  const handleSendEmailCode = async () => {
    if (!form.email.trim()) {
      setEmailVerificationError("이메일을 입력해주세요.");
      return;
    }
    const validationError = validateField("email", form.email);
    if (validationError) {
      setEmailVerificationError(validationError);
      return;
    }
    if (!emailValid) {
      setEmailVerificationError("이메일 중복확인을 먼저 해주세요.");
      return;
    }
    setEmailVerificationError("");
    setLoading(true);

    try {
      await sendEmailCode(form.email);
      setEmailVerificationSent(true);
      setEmailVerificationError("");
      setEmailVerified(false);
      setEmailCode("");
      setEmailVerificationTimer(60);

      // 타이머 시작
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
    } catch (e) {
      setEmailVerificationError(e.message);
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyEmailCode = async () => {
    if (!emailVerificationSent) {
      setEmailVerificationError("먼저 인증번호를 발송해주세요.");
      return;
    }
    if (!emailCode.trim()) {
      setEmailVerificationError("인증번호를 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyEmailCode(form.email, emailCode);
      // 응답 구조가 { data: { success, message } } 임을 반영
      if (res.data && res.data.success) {
        setEmailVerified(true);
        setEmailVerificationError("");
      } else {
        setEmailVerified(false);
        setEmailVerificationError(
          (res.data && res.data.message) || "인증 실패"
        );
      }
    } catch (e) {
      setEmailVerified(false);
      setEmailVerificationError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ============ 회원가입 제출 ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.termsService || !form.termsPrivacy) {
      alert("필수 약관에 동의해 주세요.");
      setLoading(false);
      return;
    }
    if (!validateForm()) {
      alert("입력값을 다시 확인해주세요.");
      setLoading(false);
      return;
    }
    if (!userIdValid) {
      alert("아이디 중복 확인을 완료해주세요.");
      setLoading(false);
      return;
    }
    if (!nicknameValid) {
      alert("닉네임 중복 확인을 완료해주세요.");
      setLoading(false);
      return;
    }
    if (!emailValid) {
      alert("이메일 중복 확인을 완료해주세요.");
      setLoading(false);
      return;
    }
    if (!phoneValid) {
      alert("전화번호 중복 확인을 완료해주세요.");
      setLoading(false);
      return;
    }
    if (!emailVerified) {
      alert("이메일 인증을 완료해주세요.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/register/signup`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      let data = {};
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textData = await response.text();
        try {
          data = JSON.parse(textData);
        } catch {
          data = { message: textData };
        }
      }
      if (response.ok) {
        alert("회원가입 성공! 로그인 화면으로 이동합니다.");
        window.location.href = "/seokgeun/login";
      } else if (response.status === 409) {
        alert(data.message || "이미 존재하는 정보가 있습니다.");
      } else if (response.status === 401 || response.status === 419) {
        alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
        window.location.href = "/seokgeun/login";
      } else {
        alert(`회원가입 실패: ${data.message || response.status}`);
      }
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        alert(
          "서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요."
        );
      } else {
        alert("서버 통신 중 오류가 발생했습니다: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 중복 확인 이벤트
  const handleUserIdCheck = async () => {
    if (!form.userId.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }
    const validationError = validateField("userId", form.userId);
    if (validationError) {
      alert(validationError);
      return;
    }
    const isDup = await checkUserId(form.userId);
    alert(isDup ? "이미 존재하는 아이디입니다." : "사용 가능한 아이디입니다.");
    setUserIdValid(!isDup);
  };
  const handleNicknameCheck = async () => {
    if (!form.nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    const isDup = await checkNickname(form.nickname);
    alert(isDup ? "이미 존재하는 닉네임입니다." : "사용 가능한 닉네임입니다.");
    setNicknameValid(!isDup);
  };
  const handleEmailCheck = async () => {
    if (!form.email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }
    const validationError = validateField("email", form.email);
    if (validationError) {
      alert(validationError);
      return;
    }
    const isDup = await checkEmail(form.email);
    alert(isDup ? "이미 존재하는 이메일입니다." : "사용 가능한 이메일입니다.");
    setEmailValid(!isDup);
  };
  const handlePhoneCheck = async () => {
    if (!form.phone.trim()) {
      alert("전화번호를 입력해주세요.");
      return;
    }
    const validationError = validateField("phone", form.phone);
    if (validationError) {
      alert(validationError);
      return;
    }
    const isDup = await checkPhone(form.phone);
    alert(
      isDup ? "이미 존재하는 전화번호입니다." : "사용 가능한 전화번호입니다."
    );
    setPhoneValid(!isDup);
  };

  // ============= 렌더링 =============
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.title}>회원가입</div>
          {/* 아이디 */}
          <div
            className={`${styles.row} ${
              formErrors.userId ? styles.invalid : ""
            }`}
          >
            <input
              name="userId"
              value={form.userId}
              onChange={handleChange}
              placeholder="아이디"
              className={styles.input}
              disabled={loading}
            />
            <button
              type="button"
              className={styles.button}
              onClick={handleUserIdCheck}
              disabled={loading}
            >
              중복확인
            </button>
          </div>
          {formErrors.userId && (
            <span className={styles.helperText}>{formErrors.userId}</span>
          )}

          {/* 비밀번호 */}
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호"
            className={styles.input}
            disabled={loading}
          />
          {formErrors.password && (
            <span className={styles.helperText}>{formErrors.password}</span>
          )}

          {/* 비밀번호 확인 */}
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호 확인"
            className={styles.input}
            disabled={loading}
          />
          {formErrors.confirmPassword && (
            <span className={styles.helperText}>
              {formErrors.confirmPassword}
            </span>
          )}

          {/* 닉네임 */}
          <div className={styles.row}>
            <input
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              placeholder="닉네임"
              className={styles.input}
              disabled={loading}
            />
            <button
              type="button"
              className={styles.button}
              onClick={handleNicknameCheck}
              disabled={loading}
            >
              중복확인
            </button>
          </div>

          {/* 주소 */}
          <div className={styles.addressGroup}>
            <input
              name="address"
              value={form.address}
              placeholder="도로명 주소"
              className={styles.input}
              readOnly
            />
            <button
              type="button"
              onClick={handleAddressSearch}
              className={styles.button}
              disabled={loading}
            >
              주소 검색
            </button>
          </div>
          <input
            name="addressDetail"
            value={form.addressDetail}
            onChange={handleChange}
            placeholder="상세 주소 입력"
            className={styles.input}
            disabled={loading}
          />

          {/* 전화번호 */}
          <div
            className={`${styles.phoneGroup} ${
              formErrors.phone ? styles.invalid : ""
            }`}
          >
            <div className={styles.row}>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="전화번호"
                className={styles.input}
                disabled={loading}
              />
              <button
                type="button"
                onClick={handlePhoneCheck}
                className={styles.button}
                disabled={loading}
              >
                중복확인
              </button>
            </div>
            {formErrors.phone && (
              <span className={styles.helperText}>{formErrors.phone}</span>
            )}
          </div>

          {/* 이메일 + 인증 */}
          <div className={styles.row}>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일"
              className={styles.input}
              disabled={loading || emailVerified}
            />
            <button
              type="button"
              className={styles.button}
              onClick={handleEmailCheck}
              disabled={loading || emailVerified}
            >
              중복확인
            </button>
          </div>
          {formErrors.email && (
            <span className={styles.helperText}>{formErrors.email}</span>
          )}

          {/* 이메일 인증: 인증번호 요청/입력/확인 */}
          <div className={styles.row}>
            <button
              type="button"
              className={styles.button}
              onClick={handleSendEmailCode}
              disabled={
                loading ||
                !emailValid ||
                emailVerified ||
                emailVerificationTimer > 0
              }
            >
              {emailVerificationTimer > 0
                ? `재요청 (${emailVerificationTimer}s)`
                : emailVerificationSent
                ? "인증번호 재전송"
                : "인증번호 발송"}
            </button>
            <input
              type="text"
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value)}
              placeholder="인증번호 입력"
              className={styles.input}
              maxLength={6}
              disabled={!emailVerificationSent || emailVerified}
              style={{ width: "140px", marginLeft: 8 }}
            />
            <button
              type="button"
              className={styles.button}
              onClick={handleVerifyEmailCode}
              disabled={loading || !emailVerificationSent || emailVerified}
              style={{ marginLeft: 8 }}
            >
              인증확인
            </button>
          </div>
          {/* 인증 메시지/에러 */}
          {emailVerificationError && (
            <span className={styles.helperText} style={{ color: "red" }}>
              {emailVerificationError}
            </span>
          )}
          {emailVerified && (
            <span className={styles.helperText} style={{ color: "green" }}>
              인증 완료!
            </span>
          )}

          {/* 약관 동의 */}
          <div className={styles.termsBox}>
            <div className={styles.consentRow}>
              <span>
                <strong>
                  이용약관 및 개인정보 수집 및 이용, 프로젝트, 후원계약 관련
                  법안 및 저작권에 모두 동의합니다.
                </strong>
              </span>
              <input
                type="checkbox"
                name="termsAll"
                checked={form.termsAll}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setForm((prev) => ({
                    ...prev,
                    termsAll: checked,
                    termsService: checked,
                    termsPrivacy: checked,
                    termsMarketingSms: checked,
                    termsMarketingEmail: checked,
                  }));
                }}
                disabled={loading}
              />
            </div>
            {/* ... (나머지 약관동의 영역, 기존 코드와 동일) */}
            <div className={styles.termSection}>
              <strong>[필수] 서비스의 이용 동의</strong>
              <div className={styles.termContent}>{termsText.termsService}</div>
              <div className={styles.consentRow}>
                <span>서비스 이용약관에 동의하십니까?</span>
                <input
                  type="checkbox"
                  name="termsService"
                  checked={form.termsService}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label>동의함</label>
              </div>
            </div>
            <div className={styles.termSection}>
              <strong>[필수] 개인정보 수집 및 프로젝트 생성 동의</strong>
              <div className={styles.termContent}>{termsText.termsPrivacy}</div>
              <div className={styles.consentRow}>
                <span>개인정보 수집 및 프로젝트 생성 등에 동의하십니까?</span>
                <input
                  type="checkbox"
                  name="termsPrivacy"
                  checked={form.termsPrivacy}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label>동의함</label>
              </div>
            </div>
            <div className={styles.termSection}>
              <strong>[필수] 후원계약 관련 법안 및 저작권 동의</strong>
              <div className={styles.termContent}>
                {termsText.termsMarketing}
              </div>
              <div className={styles.consentRow}>
                <span>후원계약 관련 법안에 동의하십니까?</span>
                <input
                  type="checkbox"
                  name="termsMarketingSms"
                  checked={form.termsMarketingSms}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label>동의함</label>
              </div>
              <div className={styles.consentRow}>
                <span>저작권 관련 법안에 동의하십니까?</span>
                <input
                  type="checkbox"
                  name="termsMarketingEmail"
                  checked={form.termsMarketingEmail}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label>동의함</label>
              </div>
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <div className={styles.confirmSection}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "회원가입 중..." : "회원가입"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
