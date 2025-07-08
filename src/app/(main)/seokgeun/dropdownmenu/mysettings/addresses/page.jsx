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

  // 주소 검색 팝업
  const handleAddressSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert(
        "주소 검색 스크립트가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요."
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
      alert("수령인 이름을 입력해주세요.");
      return;
    }
    if (!form.phone.trim()) {
      alert("연락처를 입력해주세요.");
      return;
    }
    if (!form.zipcode.trim()) {
      alert("우편번호를 검색해주세요.");
      return;
    }
    if (!form.address.trim()) {
      alert("주소를 검색해주세요.");
      return;
    }

    setSaving(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      console.log("1. 토큰 확인:", accessToken ? "토큰 존재" : "토큰 없음");

      if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
      }

      const requestData = {
        name: form.name,
        phone: form.phone,
        zipcode: form.zipcode,
        address: form.address,
        detail: form.detail,
        isDefault: addresses.length === 0, // 첫 번째 배송지는 기본으로 설정
      };

      console.log("2. 요청 데이터:", requestData);
      console.log("3. 토큰 일부:", accessToken.substring(0, 20) + "...");

      console.log("4. API 호출 시작...");
      const response = await fetch(
        "http://localhost:8888/api/register/user/me/addresses",
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
        alert("배송지가 등록되었습니다.");
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
            alert(
              `백엔드 서버에서 오류가 발생했습니다.\n\n오류 코드: ${errorData.error}\n메시지: ${errorData.message}\n\n백엔드 개발자에게 이 정보를 전달해주세요.`
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
        alert(`배송지 등록에 실패했습니다: ${errorMessage}`);
      }
    } catch (error) {
      console.log("15. 네트워크 오류 발생:", error);
      console.log("16. 오류 타입:", error.constructor.name);
      console.log("17. 오류 메시지:", error.message);
      console.log("18. 오류 스택:", error.stack);
      alert(
        "서버 연결에 실패했습니다. 백엔드 서버가 실행 중인지 확인해주세요."
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
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.log("로그인 토큰이 없습니다.");
          setLoading(false);
          return;
        }

        console.log("배송지 목록 조회 요청");
        console.log("Access Token:", accessToken.substring(0, 20) + "...");

        const response = await fetch(
          "http://localhost:8888/api/register/user/me/addresses",
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
            alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          } else {
            console.error("배송지 목록 조회 실패:", errorMessage);
          }
        }
      } catch (error) {
        console.error("배송지 조회 네트워크 오류:", error);
        console.error("오류 상세:", error.message);
        console.error("오류 스택:", error.stack);
        // 네트워크 오류는 조용히 처리 (백엔드 서버가 실행되지 않았을 수 있음)
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // ✅ 배송지 삭제
  const handleDelete = async (addressId) => {
    if (!confirm("정말로 이 배송지를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
      }

      console.log("배송지 삭제 요청:", addressId);

      const response = await fetch(
        `http://localhost:8888/api/register/user/me/addresses/${addressId}`,
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
        alert("배송지가 삭제되었습니다.");
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("배송지 삭제 실패:", errorData);
        alert(
          `배송지 삭제에 실패했습니다: ${
            errorData.message || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error("배송지 삭제 오류:", error);
      alert("서버 연결에 실패했습니다.");
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
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 16 }}>등록된 배송지</div>
            <button
              className="mysettings-edit-btn"
              style={{ fontWeight: 700, fontSize: 15, padding: "4px 18px" }}
              onClick={() => setShowForm(true)}
              disabled={saving}
            >
              + 추가
            </button>
          </div>

          {/* 로딩 상태 */}
          {loading && (
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
              <div style={{ fontSize: 16, color: "#888" }}>
                배송지 목록을 불러오는 중...
              </div>
            </div>
          )}

          {/* 배송지 목록 */}
          {!loading && addresses.length === 0 && !showForm && (
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
                등록된 배송지가 없습니다.
              </div>
              <div style={{ color: "#bbb", fontSize: 15 }}>
                배송지를 추가해주세요.
              </div>
            </div>
          )}
          {!loading && addresses.length > 0 && (
            <ul style={{ margin: 0, padding: 0 }}>
              {addresses.map((addr, idx) => (
                <li
                  key={addr.id || idx}
                  style={{
                    border: "1.5px solid #ececec",
                    borderRadius: 8,
                    marginBottom: 12,
                    padding: 16,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <b>{addr.name}</b> ({addr.phone})<br />[{addr.zipcode}]{" "}
                      {addr.address} {addr.detail}
                      {addr.isDefault && (
                        <span
                          style={{
                            marginLeft: 8,
                            padding: "2px 6px",
                            backgroundColor: "#1976d2",
                            color: "white",
                            borderRadius: 4,
                            fontSize: 12,
                          }}
                        >
                          기본
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#dc3545",
                        cursor: "pointer",
                        fontSize: 12,
                        padding: "4px 8px",
                      }}
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
            <div
              style={{
                border: "1.5px solid #ececec",
                borderRadius: 8,
                padding: 24,
                marginTop: 16,
                background: "#fff",
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <input
                  name="name"
                  placeholder="이름"
                  value={form.name}
                  onChange={handleChange}
                  style={{ marginRight: 8 }}
                  disabled={saving}
                />
                <input
                  name="phone"
                  placeholder="연락처"
                  value={form.phone}
                  onChange={handleChange}
                  style={{ marginRight: 8 }}
                  disabled={saving}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <input
                  name="zipcode"
                  placeholder="우편번호"
                  value={form.zipcode}
                  readOnly
                  style={{ marginRight: 8, width: 120 }}
                />
                <button
                  type="button"
                  className="mysettings-edit-btn"
                  onClick={handleAddressSearch}
                  style={{ marginRight: 8 }}
                  disabled={saving}
                >
                  주소검색
                </button>
                <input
                  name="address"
                  placeholder="기본주소"
                  value={form.address}
                  readOnly
                  style={{ marginRight: 8, width: 240 }}
                />
                <input
                  name="detail"
                  placeholder="상세주소"
                  value={form.detail}
                  onChange={handleChange}
                  style={{ width: 180 }}
                  disabled={saving}
                />
              </div>
              <button
                className="mysettings-save-btn"
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
                style={{ marginLeft: 8 }}
                disabled={saving}
              >
                취소
              </button>
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
              href="/seokgeun/dropdownmenu/sponsoredprojects"
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
    </div>
  );
}
