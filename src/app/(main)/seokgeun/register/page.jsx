"use client";

import Header from "@/components/header/Header";
import React, { useState, useEffect } from "react";
import termsText from "./termsText";
import styles from "./register.module.css";

// ✅ 중복 확인 함수들
const checkUserId = async (userId) => {
  try {
    const res = await fetch(
      `http://localhost:8888/api/register/check-user-id?userId=${userId}`
    );
    return await res.json();
  } catch (err) {
    console.error("아이디 중복 확인 오류:", err);
    return false;
  }
};

const checkNickname = async (nickname) => {
  try {
    const res = await fetch(
      `http://localhost:8888/api/register/check-nickname?nickname=${nickname}`
    );
    return await res.json();
  } catch (err) {
    console.error("닉네임 중복 확인 오류:", err);
    return false;
  }
};

const checkEmail = async (email) => {
  try {
    const res = await fetch(
      `http://localhost:8888/api/register/check-email?email=${email}`
    );
    return await res.json();
  } catch (err) {
    console.error("이메일 중복 확인 오류:", err);
    return false;
  }
};

const checkPhone = async (phone) => {
  try {
    const res = await fetch(
      `http://localhost:8888/api/register/check-phone?phone=${phone}`
    );
    return await res.json();
  } catch (err) {
    console.error("전화번호 중복 확인 오류:", err);
    return false;
  }
};

export default function Page() {
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

  const [formErrors, setFormErrors] = useState({});
  const [userIdValid, setUserIdValid] = useState(null);
  const [nicknameValid, setNicknameValid] = useState(null);
  const [emailValid, setEmailValid] = useState(null);
  const [phoneValid, setPhoneValid] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case "userId":
        return value.trim() === "" ? "아이디를 입력해주세요." : "";

      case "password":
        return !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(
          value
        )
          ? "비밀번호는 영문 대소문자+숫자+특수문자 포함 8~15자여야 합니다."
          : "";

      case "confirmPassword":
        return value !== form.password ? "비밀번호가 일치하지 않습니다." : "";

      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "올바른 이메일 형식이 아닙니다."
          : "";

      case "phone":
        return !/^01[016789]-?\d{3,4}-?\d{4}$/.test(value)
          ? "유효한 전화번호를 입력해주세요.(예:010-1234-1234)."
          : "";

      default:
        return "";
    }
  };

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    // 1) 값 업데이트
    setForm((prev) => ({ ...prev, [name]: newValue }));

    // 2) 중복 확인 상태 초기화
    if (["userId", "nickname", "email", "phone"].includes(name)) {
      if (name === "userId") setUserIdValid(null);
      if (name === "nickname") setNicknameValid(null);
      if (name === "email") setEmailValid(null);
      if (name === "phone") setPhoneValid(null);
    }

    // 3) 즉시 유효성 검사
    if (
      ["userId", "password", "confirmPassword", "email", "phone"].includes(name)
    ) {
      const msg = validateField(name, newValue);
      setFormErrors((prev) => ({ ...prev, [name]: msg }));
      // password 변경 시 confirmPassword 재검증
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.termsService || !form.termsPrivacy) {
      return alert("필수 약관에 동의해 주세요.");
    }
    if (!validateForm()) {
      return alert("입력값을 다시 확인해주세요.");
    }
    if (!userIdValid) return alert("아이디 중복 확인을 완료해주세요.");
    if (!nicknameValid) return alert("닉네임 중복 확인을 완료해주세요.");
    if (!emailValid) return alert("이메일 중복 확인을 완료해주세요.");
    if (!phoneValid) return alert("전화번호 중복 확인을 완료해주세요.");

    try {
      const response = await fetch(
        "http://localhost:8888/api/register/signup",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      let data = {};
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await response.json();
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
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

  const handleUserIdCheck = async () => {
    if (!form.userId.trim()) return alert("아이디를 입력해주세요.");
    const isDup = await checkUserId(form.userId);
    alert(isDup ? "이미 존재하는 아이디입니다." : "사용 가능한 아이디입니다.");
    setUserIdValid(!isDup);
  };

  const handleNicknameCheck = async () => {
    if (!form.nickname.trim()) return alert("닉네임을 입력해주세요.");
    const isDup = await checkNickname(form.nickname);
    alert(isDup ? "이미 존재하는 닉네임입니다." : "사용 가능한 닉네임입니다.");
    setNicknameValid(!isDup);
  };

  const handleEmailCheck = async () => {
    if (!form.email.trim()) return alert("이메일을 입력해주세요.");
    const isDup = await checkEmail(form.email);
    alert(isDup ? "이미 존재하는 이메일입니다." : "사용 가능한 이메일입니다.");
    setEmailValid(!isDup);
  };

  const handlePhoneCheck = async () => {
    if (!form.phone.trim()) return alert("전화번호를 입력해주세요.");
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
            />
            <button
              type="button"
              className={styles.button}
              onClick={handleUserIdCheck}
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
          />
          {formErrors.password && (
            <span className={styles.helperText}>{formErrors.password}</span>
          )}

          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호 확인"
            className={styles.input}
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
            />
            <button
              type="button"
              className={styles.button}
              onClick={handleNicknameCheck}
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
              />
              <button
                type="button"
                onClick={handlePhoneCheck}
                className={styles.button}
              >
                중복확인
              </button>
            </div>
            {formErrors.phone && (
              <span className={styles.helperText}>{formErrors.phone}</span>
            )}
          </div>

          {/* 이메일 */}
          <div className={styles.row}>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일"
              className={styles.input}
            />
            <button
              type="button"
              className={styles.button}
              onClick={handleEmailCheck}
            >
              중복확인
            </button>
          </div>
          {formErrors.email && (
            <span className={styles.helperText}>{formErrors.email}</span>
          )}

          {/* 약관 */}
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
              />
            </div>

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
                />
                <label>동의함</label>
              </div>
            </div>
          </div>

          <div className={styles.confirmSection}>
            <button type="submit" className={styles.submitButton}>
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
