"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./page.css";
import { useRouter } from "next/navigation";

const TAB_LIST = [
  { key: "profile", label: "프로필" },
  { key: "review", label: "작성한 후기" },
  { key: "contribution", label: "창작생태계 기여도" },
  { key: "follower", label: "팔로워" },
  { key: "following", label: "팔로잉" },
];

const PROFILE_STATS = [
  {
    label: (
      <>
        팔로잉 <span className="mypage-link">&gt;</span>
      </>
    ),
    value: "-",
    key: "following",
  },
  { label: "후원수", value: "-", key: "supportCount" },
  {
    label: (
      <>
        창작생태계 기여도 <span className="mypage-link">&gt;</span>
      </>
    ),
    value: "-",
    key: "contribution",
  },
];

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  // Header와 동일하게 프로필 이미지 상태 관리
  // const [profileImg, setProfileImg] = useState(
  //   "/images/default_login_icon.png"
  // );
  const router = useRouter();

  // useEffect(() => {
  //   const updateProfileImg = () => {
  //     const savedImg = sessionStorage.getItem("profileImg");
  //     setProfileImg(savedImg || "/images/default_login_icon.png");
  //   };
  //   updateProfileImg();
  //   window.addEventListener("storage", updateProfileImg);
  //   return () => window.removeEventListener("storage", updateProfileImg);
  // }, []);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
      router.replace("/seokgeun/login");
      return;
    }
    fetch("/api/register/user/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("유저 정보 없음");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message === "유저 정보 없음") {
          alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
          router.replace("/seokgeun/login");
        } else {
          setError("유저 정보를 불러올 수 없습니다.");
          setLoading(false);
        }
      });
  }, []);

  if (loading)
    return <div style={{ padding: 40, textAlign: "center" }}>로딩 중...</div>;
  if (error)
    return (
      <div style={{ padding: 40, textAlign: "center", color: "red" }}>
        {error}
      </div>
    );

  // 탭별 내용
  let tabContent = null;
  if (activeTab === "profile") {
    tabContent = <div className="mypage-desc">등록된 소개가 없습니다.</div>;
  } else if (activeTab === "review") {
    tabContent = <div className="mypage-desc">작성한 후기가 없습니다.</div>;
  } else if (activeTab === "contribution") {
    tabContent = (
      <div className="mypage-desc">아직 창작생태계 기여 내역이 없습니다.</div>
    );
  } else if (activeTab === "follower") {
    tabContent = <div className="mypage-desc">팔로워가 없습니다.</div>;
  } else if (activeTab === "following") {
    tabContent = <div className="mypage-desc">팔로잉이 없습니다.</div>;
  }

  return (
    <div className="mypage-container">
      <div className="sponsored-divider"></div>
      <div className="mypage-profile-row">
        <div className="mypage-profile-img">
          {/* <Image src={profileImg} width={80} height={80} alt="프로필" /> */}
        </div>
        <div className="mypage-profile-info">
          <div className="mypage-nickname">{user?.nickname || "-"}</div>
          <div className="mypage-profile-stats-block-row">
            {PROFILE_STATS.map((stat) => (
              <div className="mypage-profile-stat-item" key={stat.key}>
                <div className="mypage-profile-stat-label">{stat.label}</div>
                <div className="mypage-profile-stat-value">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
        <Link href="/seokgeun/dropdownmenu/mysettings/profile">
          <button className="mypage-edit-btn">프로필 편집</button>
        </Link>
      </div>
      <div className="mypage-tabs">
        <ul className="mypage-tabs-list">
          {TAB_LIST.map((tab) => (
            <li
              key={tab.key}
              className={activeTab === tab.key ? "active" : ""}
              onClick={() => setActiveTab(tab.key)}
              style={{ cursor: "pointer" }}
            >
              {tab.label}
            </li>
          ))}
        </ul>
      </div>
      {tabContent}
    </div>
  );
}
