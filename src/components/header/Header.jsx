"use client";

import { Bell, Heart, Menu, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

// 석근: API BASE URL 추가
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8888";
console.log("석근: 헤더 API_BASE_URL:", API_BASE_URL);

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [roleType, setRoleType] = useState("");

  const hiddenPaths = [
    /^\/users\/login$/,
    /^\/users\/register$/,
    /^\/users$/,
    /^\/project(?:\/[^/]+)*\/pledge(?:\/[^/]+)*$/,
  ];
  const shouldShow = !hiddenPaths.some((pattern) => pattern.test(pathname));

  const [isMounted, setIsMounted] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const [profileImg, setProfileImg] = useState(
  //   "/images/default_login_icon.png"
  // );
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // sessionStorage에서 이미지, 닉네임 동기화 (storage 이벤트 포함)
  // useEffect(() => {
  //   const updateProfileImg = () => {
  //     const savedImg = sessionStorage.getItem("profileImg");
  //     setProfileImg(
  //       getProfileImgUrl(savedImg) || "/images/default_login_icon.png"
  //     );
  //   };
  //   updateProfileImg();
  //   window.addEventListener("storage", updateProfileImg);
  //   return () => window.removeEventListener("storage", updateProfileImg);
  // }, []);

  useEffect(() => {
    const updateNickname = () => {
      const savedNickname = sessionStorage.getItem("nickname");
      if (savedNickname) setNickname(savedNickname);
    };
    updateNickname();
    window.addEventListener("storage", updateNickname);
    return () => window.removeEventListener("storage", updateNickname);
  }, []);

  // storage 이벤트 감지 시 사용자 정보 다시 fetch (OAuth 로그인 후 동기화)
  useEffect(() => {
    const handleStorageChange = () => {
      const accessToken = sessionStorage.getItem("accessToken");
      if (accessToken && !isLogin) {
        console.log("석근: storage 이벤트 감지, 사용자 정보 다시 fetch");
        fetchUserInfo();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isLogin]);

  // 사용자 정보 fetch - 실제 백엔드 API 사용
  const fetchUserInfo = async () => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      setIsLogin(false);
      setNickname("");
      return;
    }
    try {
      const response = await fetch("/api/register/user/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("not logged in");
      const data = await response.json();

      if (data.roleType) {
        setRoleType(data.roleType);
        sessionStorage.setItem("roleType", data.roleType);
      }

      // 닉네임 처리
      const savedNickname = sessionStorage.getItem("nickname");
      if (data.nickname && data.nickname !== savedNickname) {
        setNickname(data.nickname);
        sessionStorage.setItem("nickname", data.nickname);
      } else if (data.nickname && !savedNickname) {
        setNickname(data.nickname);
        sessionStorage.setItem("nickname", data.nickname);
      }
      // 프로필 이미지 처리 (항상 가공 후 저장)
      // if (data.profileImg) {
      //   const url = getProfileImgUrl(data.profileImg);
      //   setProfileImg(url);
      //   sessionStorage.setItem("profileImg", url);
      // }

      setIsLogin(true);
    } catch (error) {
      setIsLogin(false);
      setNickname("");
      setProfileImg("/images/default_login_icon.png");
      // sessionStorage.setItem("profileImg", "/images/default_login_icon.png");
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // 30초마다 갱신
  useEffect(() => {
    if (!isLogin) return;
    const interval = setInterval(() => fetchUserInfo(), 30000);
    return () => clearInterval(interval);
  }, [isLogin]);

  // 포커스 시 갱신
  useEffect(() => {
    const handleFocus = () => {
      if (isLogin) fetchUserInfo();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isLogin]);

  // 알림 읽음 처리
  const fetchUnreadCount = async () => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await fetch(
        "http://localhost:8888/notifications/unread-count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) return;
      const data = await res.json();
      setUnreadCount(data);
    } catch (error) {
      console.error("읽지 않은 알림 개수 가져오기 실패", error);
    }
  };

  useEffect(() => {
    if (!isLogin) return;
    fetchUnreadCount(); // 초기 호출
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [isLogin]);

  useEffect(() => {
    const handleFocus = () => {
      if (isLogin) {
        fetchUserInfo();
        fetchUnreadCount();
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isLogin]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
      setDropdownOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 로그아웃 - 실제 백엔드 API 사용
  const handleLogout = async () => {
    const accessToken = sessionStorage.getItem("accessToken");
    try {
      // 실제 백엔드 로그아웃 API 호출
      await fetch(`${API_BASE_URL}/api/user/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (e) {}
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("nickname");
    // sessionStorage.removeItem("profileImg");
    setIsLogin(false);
    setNickname("");
    router.push("/");
  };

  const handleNicknameClick = () => setDropdownOpen(!dropdownOpen);

  // 드롭다운 바깥 클릭 시 자동 닫힘
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  if (!isMounted || !shouldShow) return null;

  // 카테고리 메뉴 데이터 (생략 없이 전체)
  const categoryData = [
    [
      {
        label: "전체",
        icon: `
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.4 9.6H9.6V16.4H16.4V9.6ZM8 8V18H18V8H8Z" fill="#0D0D0D" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M28.4 9.6H21.6V16.4H28.4V9.6ZM20 8V18H30V8H20Z" fill="#0D0D0D" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.4 21.6H9.6V28.4H16.4V21.6ZM8 20V30H18V20H8Z" fill="#0D0D0D" />
            <path d="M20 20H30V30H20V20Z" fill="#FF5757" />
          </svg>
        `,
        iconType: "svg",
      },
      {
        label: "보드게임 · TRPG",
        icon: "https://assets.tumblbug.com/categories/svg/board.svg",
        iconType: "img",
      },
      {
        label: "디지털 게임",
        icon: "https://assets.tumblbug.com/categories/svg/digital-game.svg",
        iconType: "img",
      },
      {
        label: "웹툰 · 만화",
        icon: "https://assets.tumblbug.com/categories/svg/comics.svg",
        iconType: "img",
      },
      {
        label: "웹툰 리소스",
        icon: "https://assets.tumblbug.com/categories/svg/webtoon-resource.svg",
        iconType: "img",
      },
    ],
    [
      {
        label: "디자인 문구",
        icon: "https://assets.tumblbug.com/categories/svg/stationary.svg",
        iconType: "img",
      },
      {
        label: "캐릭터 · 굿즈",
        icon: "https://assets.tumblbug.com/categories/svg/charactor-goods.svg",
        iconType: "img",
      },
      {
        label: "홈 · 리빙",
        icon: "https://assets.tumblbug.com/categories/svg/home-living.svg",
        iconType: "img",
      },
      {
        label: "테크 · 가전",
        icon: "https://assets.tumblbug.com/categories/svg/tech-electronics.svg",
        iconType: "img",
      },
      {
        label: "반려동물",
        icon: "https://assets.tumblbug.com/categories/svg/pet.svg",
        iconType: "img",
      },
    ],
    [
      {
        label: "푸드",
        icon: "https://assets.tumblbug.com/categories/svg/food.svg",
        iconType: "img",
      },
      {
        label: "향수 · 뷰티",
        icon: "https://assets.tumblbug.com/categories/svg/perfumes-cosmetics.svg",
        iconType: "img",
      },
      {
        label: "의류",
        icon: "https://assets.tumblbug.com/categories/svg/fashion.svg",
        iconType: "img",
      },
      {
        label: "잡화",
        icon: "https://assets.tumblbug.com/categories/svg/accessories.svg",
        iconType: "img",
      },
      {
        label: "주얼리",
        icon: "https://assets.tumblbug.com/categories/svg/jewerly.svg",
        iconType: "img",
      },
    ],
    [
      {
        label: "출판",
        icon: "https://assets.tumblbug.com/categories/svg/publishing.svg",
        iconType: "img",
      },
      {
        label: "디자인",
        icon: "https://assets.tumblbug.com/categories/svg/design.svg",
        iconType: "img",
      },
      {
        label: "예술",
        icon: "https://assets.tumblbug.com/categories/svg/art.svg",
        iconType: "img",
      },
      {
        label: "사진",
        icon: "https://assets.tumblbug.com/categories/svg/photography.svg",
        iconType: "img",
      },
      {
        label: "음악",
        icon: "https://assets.tumblbug.com/categories/svg/music.svg",
        iconType: "img",
      },
    ],
    [
      {
        label: "영화 · 비디오",
        icon: "https://assets.tumblbug.com/categories/svg/film.svg",
        iconType: "img",
      },
      {
        label: "공연",
        icon: "https://assets.tumblbug.com/categories/svg/performing-art.svg",
        iconType: "img",
      },
    ],
  ];

  return (
    <div
      className={`mx-auto h-[116px] ${
        isCategoryOpen ? "" : "shadow-[0px_1px_6px_rgba(0,0,0,0.08)]"
      }`}
    >
      {/* 1번째 헤더 */}
      <div className="max-w-[1160px] w-full mx-auto flex justify-between items-center h-[60px] mt-[10px]">
        <div className="w-[132px] h-[60px] flex items-center">
          <Link href={"/"}>
            <Image
              src="/images/tumblbug_logo.png"
              alt="텀블벅 로고"
              width={132}
              height={36}
            />
          </Link>
        </div>
        <ul className="flex items-center">
          <li className="p-4">
            <Link href={"/project/intro"}>
              <span className="text-[#191919] text-[12px] leading-[28px] font-semibold">
                프로젝트 올리기
              </span>
            </Link>
          </li>
          {isLogin ? (
            <>
              <li className="p-4">
                <Link href="/users/dropdownmenu/myliked">
                  <Heart />
                </Link>
              </li>

              {/* ADMIN으로 가는 icon 추가 */}
              {roleType === "ADMIN" && (
                <li className="p-4">
                  <Link href="/admain">
                    <User />
                  </Link>
                </li>
              )}
              <li className="p-4">
                <Link href="/notification" className="relative inline-block">
                  <Bell />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] min-w-[16px] h-[16px] px-[4px] rounded-full flex items-center justify-center leading-none">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
              </li>
              <li className="relative">
                <button
                  className="flex cursor-pointer items-center border-1 ml-[10px] p-4 border-[#dfdfdf] rounded-[4px] min-w-[30px] max-h-[44px]"
                  onClick={handleNicknameClick}
                >
                  <Link href="/users/dropdownmenu/mypage">
                    <Image
                      src={"/images/default_login_icon.png"}
                      width={24}
                      height={24}
                      alt="프로필"
                      onError={(e) => {
                        e.target.src = "/images/default_login_icon.png";
                      }}
                    />
                  </Link>
                  <div className="font-bold text-[12px] ml-[10px]">
                    {nickname}
                  </div>
                </button>
                {dropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-[9999]"
                  >
                    <ul>
                      <li>
                        <Link
                          href="/users/dropdownmenu/mypage"
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          프로필
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/pledges"
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          후원한 프로젝트
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/review/myreview"
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          내 후기
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/users/dropdownmenu/myliked"
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          관심 프로젝트
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/users/dropdownmenu/myfollow"
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          팔로우
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/notification"
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          알림
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/users/dropdownmenu/mymessage"
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          메시지
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/users/dropdownmenu/myproject"
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          내가 만든 프로젝트
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/users/dropdownmenu/mysettings/profile"
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          설정
                        </Link>
                      </li>
                      <li
                        className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={handleLogout}
                      >
                        로그아웃
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            </>
          ) : (
            <li>
              <Link
                className="flex cursor-pointer items-center border-1 ml-[10px] p-4 border-[#dfdfdf] rounded-[4px] min-w-[30px] max-h-[44px]"
                href={"/users"}
              >
                <User className="bg-[#ddd] rounded-3xl" color="#fff" />
                <div className="font-bold text-[12px] ml-[10px]">
                  로그인/회원가입
                </div>
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* 2번째 헤더 */}
      <div
        className={`w-full bg-white ${
          isScrolled
            ? `fixed top-0 left-0 z-50 ${
                isCategoryOpen ? "" : "shadow-[0px_1px_6px_rgba(0,0,0,0.08)]"
              }`
            : ""
        }`}
        style={{ overflow: "visible" }}
      >
        <div className="w-[1160px] mx-auto flex justify-between items-center">
          <ul className="flex gap-[20px] h-[56px] items-center text-[15px] text-[#0d0d0d] font-semibold">
            <li
              className="flex group relative cursor-pointer"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <Menu className="mr-[8px] group-hover:text-[#FF5757] transition-all duration-300" />
              <span className="pt-[1px] px-[6px] group-hover:text-[#FF5757] transition-all duration-300">
                카테고리
              </span>
              {/* 카테고리 메뉴 전체 */}
              {isCategoryOpen && (
                <div
                  className="absolute top-[24px] left-[575px] -translate-x-1/2 w-[1530px] z-10 pt-[40px] pb-[30px] bg-white shadow-[0px_1px_6px_rgba(0,0,0,0.08)]"
                  onMouseEnter={() => setIsCategoryOpen(true)}
                  onMouseLeave={() => setIsCategoryOpen(false)}
                >
                  <div className="w-[1160px] mx-auto relative flex justify-between mt-[16px] px-[10px] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:shadow-[0_6px_7px_rgba(0,0,0,0.08)] after:pointer-events-none">
                    {categoryData.map((column, colIndex) => (
                      <div
                        key={colIndex}
                        className="flex-grow flex-shrink-0 basis-[20%]"
                      >
                        {column.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex flex-row justify-start items-center shrink-0 h-[32px] mb-[20px] px-[3px] cursor-pointer"
                          >
                            <div className="overflow-hidden inline-flex flex-col flex-none w-[40px] h-[40px] mr-[4px] justify-center items-center">
                              {item.iconType === "svg" ? (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: item.icon,
                                  }}
                                  aria-hidden="true"
                                />
                              ) : (
                                <Image
                                  src={item.icon}
                                  alt={item.label}
                                  width={0}
                                  height={0}
                                  className="w-full h-auto inline-flex justify-center items-center"
                                />
                              )}
                            </div>
                            <div className="mt-[4px] inline-flex w-full leading-[18px] justify-start items-start text-[13px] text-[#3d3d3d] break-keep text-left">
                              {item.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
            <li>
              <Link
                href={"/"}
                className="hover:text-[#FF5757] transition-all duration-300"
              >
                <span className="pt-[1px] px-[6px]">홈</span>
              </Link>
            </li>
            <li>
              <Link
                href={"/project/list"}
                className="hover:text-[#FF5757] transition-all duration-300"
              >
                <span className="pt-[1px] px-[6px]">인기</span>
              </Link>
            </li>
            <li>
              <Link
                href={"/project/list"}
                className="hover:text-[#FF5757] transition-all duration-300"
              >
                <span className="pt-[1px] px-[6px]">신규</span>
              </Link>
            </li>
          </ul>
          <div className="z-[300] relative px-[30px] pr-[30px] pl-[16px] inline-flex w-[216px] h-[36px] bg-[#f3f3f3] items-center rounded-[8px] text-[12px] leading-[28px] tracking-[0.02em] text-[rgba(0,0,0,0.3)]">
            <input
              type="text"
              placeholder="검색어를 입력해주세요."
              className="border-none text-[12px] leading-[28px] tracking-[0.02em] bg-[#f3f3f3] text-[#333333] appearance-none outline-none"
            />
            <div className="absolute right-[10px] inline-flex w-[20px] h-[20px] items-center justify-center">
              <Search color="#000" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
