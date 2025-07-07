"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import "./page.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "프로필", path: "/seokgeun/dropdownmenu/mysettings/profile" },
  { label: "계정", path: "/seokgeun/dropdownmenu/mysettings/account" },
  { label: "결제수단", path: "/seokgeun/dropdownmenu/mysettings/pay_methods" },
  { label: "배송지", path: "/seokgeun/dropdownmenu/mysettings/addresses" },
  { label: "알림", path: "/seokgeun/dropdownmenu/mysettings/notifications" },
];

export default function MySettingsPage() {
  const [activeTab, setActiveTab] = useState("프로필");
  const [nickname, setNickname] = useState("석근");
  const [profileImg, setProfileImg] = useState(
    "/images/default_login_icon.png"
  );
  const [previewImg, setPreviewImg] = useState(null);
  const [userUrl, setUserUrl] = useState("dpsjsvexvokhtpks");
  const [bio, setBio] = useState("");
  const [ideus, setIdeus] = useState("");
  const [website, setWebsite] = useState("");
  const fileInputRef = useRef(null);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editFile, setEditFile] = useState(null);

  const pathname = usePathname();

  // 페이지 진입 시 localStorage에서 프로필 이미지 불러오기
  useEffect(() => {
    const savedNickname = localStorage.getItem("nickname");
    if (savedNickname) setNickname(savedNickname);
    const savedImg = localStorage.getItem("profileImg");
    if (savedImg) setProfileImg(savedImg);
  }, []);

  // 변경 버튼 클릭 시 에디트 모드 진입 (이전 에디트 모드는 자동 취소)
  const handleEditClick = (field, value) => {
    setEditField(field);
    setEditValue(value || "");
    setPreviewImg(null);
    setEditFile(null);
  };
  // 취소 핸들러
  const handleCancel = () => {
    setEditField(null);
    setEditValue("");
    setPreviewImg(null);
    setEditFile(null);
  };
  // 프로필 이미지 업로드
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewImg(ev.target.result);
      reader.readAsDataURL(file);
    }
  };
  const handleImgClick = () => {
    fileInputRef.current?.click();
  };
  // 저장 핸들러
  const handleSave = async (field) => {
    if (field === "프로필 사진") {
      if (previewImg) {
        setProfileImg(previewImg);
        localStorage.setItem("profileImg", previewImg);
        window.dispatchEvent(new Event("storage"));
      }
    } else if (field === "이름") {
      try {
        const accessToken = localStorage.getItem("accessToken");

        // 1. 현재 유저 정보 불러오기
        const userRes = await fetch("/api/register/user/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!userRes.ok) throw new Error("유저 정보 조회 실패");
        const user = await userRes.json();

        // 2. UserUpdateRequestDTO 형식에 맞게 데이터 구성
        const updateData = {
          nickname: editValue,
          email: user.email,
          phone: user.phone || "",
          address: user.address || "",
          addressDetail: user.addressDetail || "",
        };

        // 3. 새로운 프로필 업데이트 엔드포인트 사용
        const patchRes = await fetch("/api/register/user/me/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updateData),
        });

        if (!patchRes.ok) {
          const errorData = await patchRes.text();
          console.error("API 응답:", patchRes.status, errorData);
          throw new Error(`닉네임 변경 실패: ${patchRes.status}`);
        }

        const updatedUser = await patchRes.json();
        console.log("업데이트 성공:", updatedUser);

        setNickname(editValue);
        localStorage.setItem("nickname", editValue);
        window.dispatchEvent(new Event("storage"));
      } catch (e) {
        console.error("닉네임 변경 에러:", e);
        alert("닉네임 변경에 실패했습니다. 다시 시도해 주세요.");
        return;
      }
    } else if (field === "사용자 이름(URL)") setUserUrl(editValue);
    else if (field === "소개") setBio(editValue);
    else if (field === "아이디어스 주소") setIdeus(editValue);
    else if (field === "웹사이트") setWebsite(editValue);
    setEditField(null);
    setEditValue("");
    setPreviewImg(null);
    setEditFile(null);
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
        {/* 좌측: 프로필 폼 */}
        <form
          className="mysettings-profile-table"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* 프로필 사진 */}
          <div className="mysettings-profile-row">
            <div className="mysettings-profile-col">
              <div className="mysettings-profile-label">프로필 사진</div>
              {editField === "프로필 사진" ? (
                <>
                  <div className="mysettings-profile-img-edit-row">
                    <div
                      className="mysettings-profile-img-edit-wrap"
                      onClick={handleImgClick}
                    >
                      <Image
                        src={previewImg || profileImg}
                        width={80}
                        height={80}
                        alt="프로필"
                        className="mysettings-profile-img-edit"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleImgChange}
                      />
                    </div>
                    <div className="mysettings-profile-img-upload-col">
                      <button
                        className="mysettings-profile-img-upload-btn"
                        type="button"
                        onClick={handleImgClick}
                      >
                        파일 업로드
                      </button>
                      <div className="mysettings-profile-desc-guide">
                        250 x 250 픽셀에 최적화되어 있으며, 5MB 이하의 JPG, GIF,
                        PNG 파일만 저장됩니다.
                      </div>
                    </div>
                  </div>
                  <div
                    className="mysettings-profile-edit-actions"
                    style={{ marginTop: "20px" }}
                  >
                    <button
                      className="mysettings-save-btn"
                      type="button"
                      onClick={() => handleSave("프로필 사진")}
                    >
                      저장
                    </button>
                  </div>
                </>
              ) : (
                <div className="mysettings-profile-img-left-block">
                  <div
                    className="mysettings-profile-img-wrap"
                    onClick={handleImgClick}
                  >
                    <Image
                      src={profileImg}
                      width={56}
                      height={56}
                      alt="프로필"
                      className="mysettings-profile-img"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="mysettings-profile-action-col">
              {editField === "프로필 사진" ? (
                <button
                  className="mysettings-cancel-btn"
                  type="button"
                  onClick={handleCancel}
                >
                  취소
                </button>
              ) : (
                <button
                  className="mysettings-edit-btn"
                  type="button"
                  onClick={() => handleEditClick("프로필 사진")}
                >
                  변경
                </button>
              )}
            </div>
          </div>
          {/* 이름 */}
          <div className="mysettings-profile-row">
            <div className="mysettings-profile-col">
              <div className="mysettings-profile-label">이름</div>
              <div className="mysettings-profile-value">
                {editField === "이름" ? (
                  <>
                    <input
                      className="mysettings-profile-edit-input"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                    <div className="mysettings-profile-edit-actions">
                      <button
                        className="mysettings-save-btn"
                        type="button"
                        onClick={() => handleSave("이름")}
                      >
                        저장
                      </button>
                    </div>
                  </>
                ) : (
                  <span>{nickname}</span>
                )}
              </div>
            </div>
            <div className="mysettings-profile-action-col">
              {editField === "이름" ? (
                <button
                  className="mysettings-cancel-btn"
                  type="button"
                  onClick={handleCancel}
                >
                  취소
                </button>
              ) : (
                <button
                  className="mysettings-edit-btn"
                  type="button"
                  onClick={() => handleEditClick("이름", nickname)}
                >
                  변경
                </button>
              )}
            </div>
          </div>
          {/* 사용자 이름(URL) */}
          <div className="mysettings-profile-row">
            <div className="mysettings-profile-col">
              <div className="mysettings-profile-label">사용자 이름(URL)</div>
              <div className="mysettings-profile-value">
                {editField === "사용자 이름(URL)" ? (
                  <>
                    <input
                      className="mysettings-profile-edit-input"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                    <div
                      className="mysettings-profile-desc-guide"
                      style={{ marginTop: "12px" }}
                    >
                      사용자 이름은 최종적인 프로필 주소로 활용됩니다. 예)
                      tumblbug.com/u/사용자이름
                    </div>
                    <div className="mysettings-profile-edit-actions">
                      <button
                        className="mysettings-save-btn"
                        type="button"
                        onClick={() => handleSave("사용자 이름(URL)")}
                      >
                        저장
                      </button>
                    </div>
                  </>
                ) : (
                  <span>
                    http://tumblbug.com/u/<b>{userUrl}</b>
                  </span>
                )}
              </div>
            </div>
            <div className="mysettings-profile-action-col">
              {editField === "사용자 이름(URL)" ? (
                <button
                  className="mysettings-cancel-btn"
                  type="button"
                  onClick={handleCancel}
                >
                  취소
                </button>
              ) : (
                <button
                  className="mysettings-edit-btn"
                  type="button"
                  onClick={() => handleEditClick("사용자 이름(URL)", userUrl)}
                >
                  변경
                </button>
              )}
            </div>
          </div>
          {/* 소개 */}
          <div className="mysettings-profile-row">
            <div className="mysettings-profile-col">
              <div className="mysettings-profile-label">소개</div>
              <div className="mysettings-profile-value">
                {editField === "소개" ? (
                  <>
                    <textarea
                      className="mysettings-profile-edit-input"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      rows={3}
                      autoFocus
                    />
                    <div className="mysettings-profile-edit-actions">
                      <button
                        className="mysettings-save-btn"
                        type="button"
                        onClick={() => handleSave("소개")}
                      >
                        저장
                      </button>
                    </div>
                  </>
                ) : (
                  <span>
                    {bio || (
                      <span className="mysettings-profile-empty">
                        등록된 소개가 없습니다.
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
            <div className="mysettings-profile-action-col">
              {editField === "소개" ? (
                <button
                  className="mysettings-cancel-btn"
                  type="button"
                  onClick={handleCancel}
                >
                  취소
                </button>
              ) : (
                <button
                  className="mysettings-edit-btn"
                  type="button"
                  onClick={() => handleEditClick("소개", bio)}
                >
                  변경
                </button>
              )}
            </div>
          </div>
          {/* 아이디어스 주소 */}
          <div className="mysettings-profile-row">
            <div className="mysettings-profile-col">
              <div className="mysettings-profile-label">아이디어스 주소</div>
              {editField === "아이디어스 주소" ? (
                <div className="mysettings-profile-value">
                  <input
                    className="mysettings-profile-edit-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                  />
                  <div className="mysettings-profile-edit-actions">
                    <button
                      className="mysettings-save-btn"
                      type="button"
                      onClick={() => handleSave("아이디어스 주소")}
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="mysettings-profile-desc-guide"
                    style={{ marginBottom: "4px" }}
                  >
                    아이디어스의 작가 페이지에서 공유하기 버튼을 눌러, 링크
                    복사를 선택해 주세요.
                    <br />
                    복사한 링크를 이 곳에 등록하면 텀블벅 프로필에 아이디어스
                    작가 페이지 바로가기가 제공됩니다.
                  </div>
                  <div className="mysettings-profile-value">
                    {ideus ? (
                      <span>{ideus}</span>
                    ) : (
                      <span className="mysettings-profile-empty">
                        등록된 아이디어스 주소가 없습니다.
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="mysettings-profile-action-col">
              {editField === "아이디어스 주소" ? (
                <button
                  className="mysettings-cancel-btn"
                  type="button"
                  onClick={handleCancel}
                >
                  취소
                </button>
              ) : (
                <button
                  className="mysettings-edit-btn"
                  type="button"
                  onClick={() => handleEditClick("아이디어스 주소", ideus)}
                >
                  변경
                </button>
              )}
            </div>
          </div>
          {/* 웹사이트 */}
          <div className="mysettings-profile-row">
            <div className="mysettings-profile-col">
              <div className="mysettings-profile-label">웹사이트</div>
              <div className="mysettings-profile-value">
                {editField === "웹사이트" ? (
                  <>
                    <input
                      className="mysettings-profile-edit-input"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                    <div className="mysettings-profile-edit-actions">
                      <button
                        className="mysettings-save-btn"
                        type="button"
                        onClick={() => handleSave("웹사이트")}
                      >
                        저장
                      </button>
                    </div>
                  </>
                ) : (
                  <span>
                    {website || (
                      <span className="mysettings-profile-empty">
                        등록된 URL이 없습니다.
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
            <div className="mysettings-profile-action-col">
              {editField === "웹사이트" ? (
                <button
                  className="mysettings-cancel-btn"
                  type="button"
                  onClick={handleCancel}
                >
                  취소
                </button>
              ) : (
                <button
                  className="mysettings-edit-btn"
                  type="button"
                  onClick={() => handleEditClick("웹사이트", website)}
                >
                  변경
                </button>
              )}
            </div>
          </div>
        </form>
        {/* 우측: 안내 박스 */}
        <div className="mysettings-profile-guide-block">
          <div className="mysettings-profile-info-title">
            어떤 정보가 프로필에 공개되나요?
          </div>
          <div className="mysettings-profile-info-desc">
            프로필 사진과 이름, URL, 소개글, 웹사이트가 프로필 페이지에 공개
            됩니다.{" "}
            <a href="#" className="mysettings-profile-link">
              내 프로필 바로가기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
