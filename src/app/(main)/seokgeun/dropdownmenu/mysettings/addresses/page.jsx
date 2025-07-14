"use client";
import React, { useState, useEffect } from "react";
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

// 모달 컴포넌트
const Modal = ({ isOpen, onClose, title, message, type = "info" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-title ${type}`}>{title}</div>
        <div className="modal-message">{message}</div>
        <button className={`modal-button ${type}`} onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
};

// 확인 모달 컴포넌트
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title info">{title}</div>
        <div className="modal-message">{message}</div>
        <div className="confirm-modal-actions">
          <button className="confirm-modal-cancel-btn" onClick={onClose}>
            취소
          </button>
          <button className="confirm-modal-confirm-btn" onClick={onConfirm}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AddressesPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    zipcode: "",
    address: "",
    detail: "",
  });

  // 모달 상태
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    addressId: null,
  });

  // 모달 표시 함수
  const showModal = (title, message, type = "info") => {
    setModal({ isOpen: true, title, message, type });
  };

  const hideModal = () => {
    setModal({ isOpen: false, title: "", message: "", type: "info" });
  };

  const showConfirmModal = (title, message, addressId) => {
    setConfirmModal({ isOpen: true, title, message, addressId });
  };

  const hideConfirmModal = () => {
    setConfirmModal({ isOpen: false, title: "", message: "", addressId: null });
  };

  // 카카오 주소 검색 스크립트 로드
  const loadDaumPostcodeScript = () => {
    if (document.getElementById("daum-postcode-script")) return;
    const script = document.createElement("script");
    script.id = "daum-postcode-script";
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    document.body.appendChild(script);
  };

  useEffect(() => {
    loadDaumPostcodeScript();
  }, []);

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
      showModal(
        "로그인 만료",
        "로그인 세션이 만료되었습니다. 다시 로그인 해주세요.",
        "error"
      );
      router.replace("/seokgeun/login");
      return null;
    }
    return res;
  };

  // 주소 검색 팝업
  const handleAddressSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      showModal(
        "주소 검색 오류",
        "주소 검색 스크립트가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.",
        "error"
      );
      return;
    }
    new window.daum.Postcode({
      oncomplete: function (data) {
        setForm((prev) => ({
          ...prev,
          zipcode: data.zonecode,
          address: data.roadAddress || data.jibunAddress,
        }));
      },
    }).open();
  };

  // 폼 입력 핸들러
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ 배송지 등록 API 호출
  const handleSave = async () => {
    console.log("=== 배송지 등록 시작 ===");

    // 폼 유효성 검사
    if (!form.name.trim()) {
      showModal("입력 오류", "수령인 이름을 입력해주세요.", "error");
      return;
    }
    if (!form.phone.trim()) {
      showModal("입력 오류", "연락처를 입력해주세요.", "error");
      return;
    }
    if (!form.zipcode.trim()) {
      showModal("입력 오류", "우편번호를 검색해주세요.", "error");
      return;
    }
    if (!form.address.trim()) {
      showModal("입력 오류", "주소를 검색해주세요.", "error");
      return;
    }

    // 전화번호 형식 검증
    const phoneRegex = /^[0-9-+\s()]+$/;
    if (!phoneRegex.test(form.phone)) {
      showModal("입력 오류", "올바른 전화번호 형식을 입력해주세요.", "error");
      return;
    }

    setSaving(true);
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      console.log("1. 토큰 확인:", accessToken ? "토큰 존재" : "토큰 없음");

      if (!accessToken) {
        showModal("로그인 필요", "로그인이 필요합니다.", "error");
        return;
      }

      const requestData = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        zipcode: form.zipcode.trim(),
        address: form.address.trim(),
        detail: form.detail.trim(),
        isDefault: addresses.length === 0, // 첫 번째 배송지는 기본으로 설정
      };

      console.log("2. 요청 데이터:", requestData);
      console.log("3. 토큰 일부:", accessToken.substring(0, 20) + "...");

      console.log("4. API 호출 시작...");
      const response = await fetch(
        "http://localhost:8888/api/user/me/addresses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      console.log("5. 응답 상태:", response.status);
      console.log(
        "6. 응답 헤더:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        const newAddress = await response.json();
        console.log("7. 성공 응답:", newAddress);
        setAddresses([...addresses, newAddress]);
        setShowForm(false);
        setForm({ name: "", phone: "", zipcode: "", address: "", detail: "" });
        showModal(
          "등록 완료",
          "배송지가 성공적으로 등록되었습니다.",
          "success"
        );
      } else {
        console.log("8. 오류 응답 처리 시작...");
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.log("9. 오류 데이터 (JSON):", errorData);
          console.log("10. 오류 데이터 타입:", typeof errorData);
          console.log("11. 오류 데이터 키들:", Object.keys(errorData));

          // 500 에러에 대한 특별 처리
          if (response.status === 500) {
            errorMessage = `서버 내부 오류 (500): ${
              errorData.message || errorData.error || "알 수 없는 서버 오류"
            }`;
            console.error("백엔드 서버 오류 상세:", errorData);
            showModal(
              "서버 오류",
              `백엔드 서버에서 오류가 발생했습니다.\n\n오류 코드: ${errorData.error}\n메시지: ${errorData.message}\n\n백엔드 개발자에게 이 정보를 전달해주세요.`,
              "error"
            );
            return;
          }

          // 400 에러 (잘못된 요청)
          if (response.status === 400) {
            showModal(
              "입력 오류",
              errorData.message || "잘못된 입력 정보입니다.",
              "error"
            );
            return;
          }

          // 401 에러 (인증 실패)
          if (response.status === 401) {
            showModal(
              "인증 실패",
              "로그인이 필요하거나 인증이 만료되었습니다.",
              "error"
            );
            return;
          }

          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.log("12. JSON 파싱 실패:", parseError);
          const responseText = await response.text();
          console.log("13. 응답 텍스트:", responseText);
          errorMessage = responseText || errorMessage;
        }
        console.log("14. 최종 오류 메시지:", errorMessage);
        showModal(
          "등록 실패",
          `배송지 등록에 실패했습니다: ${errorMessage}`,
          "error"
        );
      }
    } catch (error) {
      console.log("15. 네트워크 오류 발생:", error);
      console.log("16. 오류 타입:", error.constructor.name);
      console.log("17. 오류 메시지:", error.message);
      console.log("18. 오류 스택:", error.stack);
      showModal(
        "연결 오류",
        "서버 연결에 실패했습니다. 백엔드 서버가 실행 중인지 확인해주세요.",
        "error"
      );
    } finally {
      setSaving(false);
      console.log("=== 배송지 등록 종료 ===");
    }
  };

  // 취소
  const handleCancel = () => {
    setShowForm(false);
    setForm({ name: "", phone: "", zipcode: "", address: "", detail: "" });
  };

  // ✅ 배송지 목록 조회
  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const accessToken = sessionStorage.getItem("accessToken");
        if (!accessToken) {
          console.log("로그인 토큰이 없습니다.");
          setLoading(false);
          return;
        }

        console.log("배송지 목록 조회 요청");
        console.log("Access Token:", accessToken.substring(0, 20) + "...");

        const response = await fetch(
          "http://localhost:8888/api/user/me/addresses",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log("배송지 목록 조회 응답 상태:", response.status);
        console.log(
          "배송지 목록 조회 응답 헤더:",
          Object.fromEntries(response.headers.entries())
        );

        if (response.ok) {
          const data = await response.json();
          console.log("배송지 목록 조회 성공:", data);
          setAddresses(data);
        } else {
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          try {
            const errorData = await response.json();
            console.error("배송지 목록 조회 실패 - 응답 데이터:", errorData);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (parseError) {
            console.error(
              "배송지 목록 조회 실패 - JSON 파싱 오류:",
              parseError
            );
            const responseText = await response.text();
            console.error("배송지 목록 조회 실패 - 응답 텍스트:", responseText);
            errorMessage = responseText || errorMessage;
          }

          if (response.status === 401) {
            showModal(
              "로그인 만료",
              "로그인이 만료되었습니다. 다시 로그인해주세요.",
              "error"
            );
          } else {
            console.error("배송지 목록 조회 실패:", errorMessage);
            showModal(
              "조회 실패",
              `배송지 목록 조회에 실패했습니다: ${errorMessage}`,
              "error"
            );
          }
        }
      } catch (error) {
        console.error("배송지 조회 네트워크 오류:", error);
        console.error("오류 상세:", error.message);
        console.error("오류 스택:", error.stack);
        showModal(
          "연결 오류",
          "서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // ✅ 배송지 삭제
  const handleDelete = async (addressId) => {
    showConfirmModal(
      "배송지 삭제",
      "정말로 이 배송지를 삭제하시겠습니까?",
      addressId
    );
  };

  // 실제 삭제 처리
  const confirmDelete = async () => {
    const addressId = confirmModal.addressId;
    if (!addressId) return;

    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        showModal("로그인 필요", "로그인이 필요합니다.", "error");
        return;
      }

      console.log("배송지 삭제 요청:", addressId);

      const response = await fetch(
        `http://localhost:8888/api/user/me/addresses/${addressId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("배송지 삭제 응답 상태:", response.status);

      if (response.ok) {
        console.log("배송지 삭제 성공");
        setAddresses(addresses.filter((addr) => addr.id !== addressId));
        showModal(
          "삭제 완료",
          "배송지가 성공적으로 삭제되었습니다.",
          "success"
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("배송지 삭제 실패:", errorData);
        showModal(
          "삭제 실패",
          `배송지 삭제에 실패했습니다: ${
            errorData.message || response.statusText
          }`,
          "error"
        );
      }
    } catch (error) {
      console.error("배송지 삭제 오류:", error);
      showModal("연결 오류", "서버 연결에 실패했습니다.", "error");
    } finally {
      hideConfirmModal();
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
        {/* 배송지 메인 영역 */}
        <div className="addresses-main-area">
          <div className="addresses-header">
            <div className="addresses-title">등록된 배송지</div>
            <button
              className="mysettings-edit-btn addresses-add-btn"
              onClick={() => setShowForm(true)}
              disabled={saving}
            >
              + 추가
            </button>
          </div>

          {/* 로딩 상태 */}
          {loading && (
            <div className="addresses-loading">
              <div className="addresses-loading-text">
                배송지 목록을 불러오는 중...
              </div>
            </div>
          )}

          {/* 배송지 목록 */}
          {!loading && addresses.length === 0 && !showForm && (
            <div className="addresses-empty">
              <div className="addresses-empty-icon">&#33;</div>
              <div className="addresses-empty-title">
                등록된 배송지가 없습니다.
              </div>
              <div className="addresses-empty-subtitle">
                배송지를 추가해주세요.
              </div>
            </div>
          )}
          {!loading && addresses.length > 0 && (
            <ul className="addresses-list">
              {addresses.map((addr, idx) => (
                <li key={addr.id || idx} className="addresses-item">
                  <div className="addresses-item-header">
                    <div className="addresses-item-info">
                      <span className="addresses-item-name">{addr.name}</span>{" "}
                      <span className="addresses-item-phone">
                        ({addr.phone})
                      </span>
                      <br />
                      <span className="addresses-item-address">
                        [{addr.zipcode}] {addr.address} {addr.detail}
                      </span>
                      {addr.isDefault && (
                        <span className="addresses-item-default-badge">
                          기본
                        </span>
                      )}
                    </div>
                    <button
                      className="addresses-delete-btn"
                      onClick={() => handleDelete(addr.id)}
                      disabled={saving}
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* 추가 폼 */}
          {showForm && (
            <div className="addresses-form">
              <div className="addresses-form-row">
                <input
                  name="name"
                  placeholder="이름"
                  value={form.name}
                  onChange={handleChange}
                  className="addresses-form-input"
                  disabled={saving}
                />
                <input
                  name="phone"
                  placeholder="연락처"
                  value={form.phone}
                  onChange={handleChange}
                  className="addresses-form-input"
                  disabled={saving}
                />
              </div>
              <div className="addresses-form-row">
                <input
                  name="zipcode"
                  placeholder="우편번호"
                  value={form.zipcode}
                  readOnly
                  className="addresses-form-input addresses-zipcode-input"
                />
                <button
                  type="button"
                  className="mysettings-edit-btn addresses-search-btn"
                  onClick={handleAddressSearch}
                  disabled={saving}
                >
                  주소검색
                </button>
                <input
                  name="address"
                  placeholder="기본주소"
                  value={form.address}
                  readOnly
                  className="addresses-form-input addresses-address-input"
                />
                <input
                  name="detail"
                  placeholder="상세주소"
                  value={form.detail}
                  onChange={handleChange}
                  className="addresses-form-input addresses-detail-input"
                  disabled={saving}
                />
              </div>
              <div className="addresses-form-actions">
                <button
                  className="mysettings-save-btn addresses-save-btn"
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "저장 중..." : "저장"}
                </button>
                <button
                  className="mysettings-cancel-btn"
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
        {/* 우측 안내 영역 */}
        <div className="mysettings-profile-guide-block">
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            배송지를 삭제하면 예약된 후원의 배송지 정보도 삭제되나요?
          </div>
          <div style={{ color: "#888", fontSize: 14 }}>
            현재 저장한 프로필에 등록된 배송지가 삭제돼도 예약된 후원의 배송지가
            반영되지 않습니다.
            <br />
            이런 변경을 원하시면 후원함(마이페이지)에서 변경해주세요.
            <br />
            <a
              href="/pledges"
              style={{
                color: "#1976d2",
                textDecoration: "underline",
                fontWeight: 500,
              }}
            >
              내 후원함 바로가기
            </a>
          </div>
        </div>
      </div>

      {/* 모달 컴포넌트들 */}
      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={hideModal}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onClose={hideConfirmModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
