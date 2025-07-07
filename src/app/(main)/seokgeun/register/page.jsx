"use client";

import Header from "@/components/header/Header";
import React, { useState, useEffect } from "react";
import termsText from "./termsText";
import styles from "./register.module.css";

// 🚀 개선점: API 베이스 URL을 환경변수로 관리
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888";

// ✅ 중복 확인 함수들 - 각 필드별 중복 검사 API 호출

/**
 * 사용자 아이디 중복 확인 함수
 * @param {string} userId - 확인할 사용자 아이디
 * @returns {Promise<boolean>} - 중복 여부 (true: 중복, false: 사용 가능)
 */
const checkUserId = async (userId) => {
  try {
    console.log("아이디 중복 확인 요청:", userId);
    
    // 🚀 개선점: fetch 대신 api 인스턴스 사용
    const response = await fetch(
      `${API_BASE_URL}/api/register/check-user-id?userId=${encodeURIComponent(userId)}`
    );
    
    console.log("아이디 중복 확인 응답 상태:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("아이디 중복 확인 응답:", data);
    return data;
  } catch (err) {
    console.error("아이디 중복 확인 오류:", err);
    return false; // 에러 시 중복으로 처리하여 안전성 확보
  }
};

/**
 * 닉네임 중복 확인 함수
 * @param {string} nickname - 확인할 닉네임
 * @returns {Promise<boolean>} - 중복 여부 (true: 중복, false: 사용 가능)
 */
const checkNickname = async (nickname) => {
  try {
    console.log("닉네임 중복 확인 요청:", nickname);
    
    const response = await fetch(
      `${API_BASE_URL}/api/register/check-nickname?nickname=${encodeURIComponent(nickname)}`
    );
    
    console.log("닉네임 중복 확인 응답 상태:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("닉네임 중복 확인 응답:", data);
    return data;
  } catch (err) {
    console.error("닉네임 중복 확인 오류:", err);
    return false;
  }
};

/**
 * 이메일 중복 확인 함수
 * @param {string} email - 확인할 이메일
 * @returns {Promise<boolean>} - 중복 여부 (true: 중복, false: 사용 가능)
 */
const checkEmail = async (email) => {
  try {
    console.log("이메일 중복 확인 요청:", email);
    
    const response = await fetch(
      `${API_BASE_URL}/api/register/check-email?email=${encodeURIComponent(email)}`
    );
    
    console.log("이메일 중복 확인 응답 상태:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("이메일 중복 확인 응답:", data);
    return data;
  } catch (err) {
    console.error("이메일 중복 확인 오류:", err);
    return false;
  }
};

/**
 * 전화번호 중복 확인 함수
 * @param {string} phone - 확인할 전화번호
 * @returns {Promise<boolean>} - 중복 여부 (true: 중복, false: 사용 가능)
 */
const checkPhone = async (phone) => {
  try {
    console.log("전화번호 중복 확인 요청:", phone);
    
    const response = await fetch(
      `${API_BASE_URL}/api/register/check-phone?phone=${encodeURIComponent(phone)}`
    );
    
    console.log("전화번호 중복 확인 응답 상태:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("전화번호 중복 확인 응답:", data);
    return data;
  } catch (err) {
    console.error("전화번호 중복 확인 오류:", err);
    return false;
  }
};

export default function Page() {
  // 폼 데이터 상태 관리 - 모든 입력 필드 값 저장
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

  // 폼 유효성 검사 에러 상태 관리
  const [formErrors, setFormErrors] = useState({});
  
  // 중복 확인 상태 관리 - 각 필드별 중복 확인 완료 여부
  const [userIdValid, setUserIdValid] = useState(null);
  const [nicknameValid, setNicknameValid] = useState(null);
  const [emailValid, setEmailValid] = useState(null);
  const [phoneValid, setPhoneValid] = useState(null);

  // 🚀 개선점: 로딩 상태 관리 추가
  const [loading, setLoading] = useState(false);

  // 다음 주소 API 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
    
    // 🚀 개선점: 컴포넌트 언마운트 시 스크립트 정리
    return () => {
      const existingScript = document.querySelector('script[src*="postcode.v2.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  /**
   * 개별 필드 유효성 검사 함수
   * @param {string} name - 필드명
   * @param {string} value - 필드값
   * @returns {string} - 에러 메시지 (빈 문자열이면 유효)
   */
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

  /**
   * 전체 폼 유효성 검사 함수
   * @returns {boolean} - 모든 필드가 유효한지 여부
   */
  const validateForm = () => {
    const errors = {};
    for (const name of [
      "userId",
      "password",
      "confirmPassword",
      "email",
      "phone",
    ]) {
      errors[name] = validateField(name, form[name]);
    }
    setFormErrors(errors);
    return Object.values(errors).every((msg) => msg === "");
  };

  /**
   * 입력 필드 변경 핸들러
   * @param {Event} e - 이벤트 객체
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    // 1) 폼 상태 업데이트
    setForm((prev) => ({ ...prev, [name]: newValue }));

    // 2) 중복 확인 상태 초기화 - 필드 변경 시 중복 확인 재실행 필요
    if (["userId", "nickname", "email", "phone"].includes(name)) {
      if (name === "userId") setUserIdValid(null);
      if (name === "nickname") setNicknameValid(null);
      if (name === "email") setEmailValid(null);
      if (name === "phone") setPhoneValid(null);
    }

    // 3) 즉시 유효성 검사 실행
    if (
      ["userId", "password", "confirmPassword", "email", "phone"].includes(name)
    ) {
      const msg = validateField(name, newValue);
      setFormErrors((prev) => ({ ...prev, [name]: msg }));
      
      // 🚀 개선점: 비밀번호 변경 시 확인 비밀번호 재검증
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

  /**
   * 주소 검색 핸들러 - 다음 주소 API 사용
   */
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

  /**
   * 회원가입 제출 핸들러
   * @param {Event} e - 이벤트 객체
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    // 🚀 개선점: 로딩 상태 관리
    setLoading(true);

    // 필수 약관 동의 확인
    if (!form.termsService || !form.termsPrivacy) {
      alert("필수 약관에 동의해 주세요.");
      setLoading(false);
      return;
    }
    
    // 폼 유효성 검사
    if (!validateForm()) {
      alert("입력값을 다시 확인해주세요.");
      setLoading(false);
      return;
    }
    
    // 중복 확인 완료 여부 확인
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

    try {
      console.log("전송할 데이터:", form);

      // 🚀 개선점: fetch 대신 api 인스턴스 사용 고려
      const response = await fetch(
        `${API_BASE_URL}/api/register/signup`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      console.log("응답 상태:", response.status);
      console.log("응답 헤더:", Object.fromEntries(response.headers.entries()));

      let data = {};
      const contentType = response.headers.get("content-type") || "";

      try {
        if (contentType.includes("application/json")) {
          data = await response.json();
        } else {
          const textData = await response.text();
          console.log("응답 텍스트:", textData);
          try {
            data = JSON.parse(textData);
          } catch (parseError) {
            console.log("JSON 파싱 실패, 텍스트 응답:", textData);
            data = { message: textData };
          }
        }
      } catch (readError) {
        console.error("응답 읽기 오류:", readError);
        data = { message: "응답을 읽을 수 없습니다." };
      }

      if (response.ok) {
        alert("회원가입 성공! 로그인 화면으로 이동합니다.");
        window.location.href = "/seokgeun/login";
      } else {
        console.error("회원가입 오류 응답:", response.status, data);
        alert(`회원가입 실패: ${data.message || response.status}`);
      }
    } catch (error) {
      console.error("회원가입 통신 오류:", error);
      console.error("오류 상세:", error.message);
      console.error("오류 스택:", error.stack);

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

  /**
   * 아이디 중복 확인 핸들러
   */
  const handleUserIdCheck = async () => {
    if (!form.userId.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }
    
    // 🚀 개선점: 유효성 검사 먼저 실행
    const validationError = validateField("userId", form.userId);
    if (validationError) {
      alert(validationError);
      return;
    }
    
    const isDup = await checkUserId(form.userId);
    alert(isDup ? "이미 존재하는 아이디입니다." : "사용 가능한 아이디입니다.");
    setUserIdValid(!isDup);
  };

  /**
   * 닉네임 중복 확인 핸들러
   */
  const handleNicknameCheck = async () => {
    if (!form.nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    
    const isDup = await checkNickname(form.nickname);
    alert(isDup ? "이미 존재하는 닉네임입니다." : "사용 가능한 닉네임입니다.");
    setNicknameValid(!isDup);
  };

  /**
   * 이메일 중복 확인 핸들러
   */
  const handleEmailCheck = async () => {
    if (!form.email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }
    
    // 🚀 개선점: 유효성 검사 먼저 실행
    const validationError = validateField("email", form.email);
    if (validationError) {
      alert(validationError);
      return;
    }
    
    const isDup = await checkEmail(form.email);
    alert(isDup ? "이미 존재하는 이메일입니다." : "사용 가능한 이메일입니다.");
    setEmailValid(!isDup);
  };

  /**
   * 전화번호 중복 확인 핸들러
   */
  const handlePhoneCheck = async () => {
    if (!form.phone.trim()) {
      alert("전화번호를 입력해주세요.");
      return;
    }
    
    // 🚀 개선점: 유효성 검사 먼저 실행
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

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.title}>회원가입</div>

          {/* 아이디 입력 및 중복 확인 */}
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

          {/* 비밀번호 입력 */}
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

          {/* 비밀번호 확인 입력 */}
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

          {/* 닉네임 입력 및 중복 확인 */}
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

          {/* 주소 입력 */}
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

          {/* 전화번호 입력 및 중복 확인 */}
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

          {/* 이메일 입력 및 중복 확인 */}
          <div className={styles.row}>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일"
              className={styles.input}
              disabled={loading}
            />
            <button
              type="button"
              className={styles.button}
              onClick={handleEmailCheck}
              disabled={loading}
            >
              중복확인
            </button>
          </div>
          {formErrors.email && (
            <span className={styles.helperText}>{formErrors.email}</span>
          )}

          {/* 약관 동의 섹션 */}
          <div className={styles.termsBox}>
            {/* 전체 동의 체크박스 */}
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

            {/* 서비스 이용약관 */}
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

            {/* 개인정보 수집 동의 */}
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

            {/* 후원계약 관련 법안 동의 */}
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
