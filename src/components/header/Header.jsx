"use client";
import { Bell, Heart, Menu, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function Header() {
  // 닉네임/로그인 상태 관리
  const [nickname, setNickname] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileImg, setProfileImg] = useState(
    "/images/default_login_icon.png"
  );
  useEffect(() => {
    const updateProfileImg = () => {
      const savedImg = localStorage.getItem("profileImg");
      setProfileImg(savedImg || "/images/default_login_icon.png");
    };
    updateProfileImg();
    window.addEventListener("storage", updateProfileImg);
    return () => window.removeEventListener("storage", updateProfileImg);
  }, []);

  // 닉네임을 localStorage에서 읽어오고 storage 이벤트 감지
  useEffect(() => {
    const updateNickname = () => {
      const savedNickname = localStorage.getItem("nickname");
      if (savedNickname) {
        setNickname(savedNickname);
      }
    };
    updateNickname();
    window.addEventListener("storage", updateNickname);
    return () => window.removeEventListener("storage", updateNickname);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setIsLogin(false);
      return;
    }
    fetch("/api/register/user/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("not logged in");
        return res.json();
      })
      .then((data) => {
        // localStorage에 닉네임이 없으면 API에서 가져온 값으로 설정
        const savedNickname = localStorage.getItem("nickname");
        if (!savedNickname) {
          setNickname(data.nickname);
          localStorage.setItem("nickname", data.nickname);
        }
        setIsLogin(true);
      })
      .catch(() => setIsLogin(false));
  }, []);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // ** 클라이언트 마운트 상태 추가 **
  const [isMounted, setIsMounted] = useState(false);

  // ** 읽지 않은 알림 개수 상태 추가 **
  const [unreadCount, setUnreadCount] = useState(0);

  // 로그인 / 로그아웃 확인용 클릭 이벤트
  const onClickLoginTest = () => {
    setIsLogin(!isLogin);
  };

  // ** 클라이언트 마운트 확인 **
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60); // 60px 이상이면 fixed
      setDropdownOpen(false); // 스크롤 시 드롭다운 닫기
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted]);

  // 로그인 상태일 때 읽지 않은 알림 개수 API 호출 (예시 URL, 실제 URL에 맞게 수정)
  useEffect(() => {
    if (!isMounted || !isLogin) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const userNo = 8; // TODO: 실제 로그인 유저 번호로 변경
        const res = await fetch(
          `http://localhost:8888/notifications/unread-count?userNo=${userNo}`
        );
        if (!res.ok) throw new Error("Failed to fetch unread count");

        const data = await res.json();

        setUnreadCount(Number(data));
      } catch (e) {
        console.error("알림 수 조회 실패:", e);
        setUnreadCount(0);
      }
    };

    // 최초 로딩 시 실행
    fetchUnreadCount();

    // ✅ 알림 읽음 이벤트가 발생했을 때 다시 fetch
    const handleNotificationRead = () => {
      fetchUnreadCount();
    };

    window.addEventListener("notificationRead", handleNotificationRead);

    // ✅ 이벤트 리스너 정리
    return () => {
      window.removeEventListener("notificationRead", handleNotificationRead);
    };
  }, [isLogin, isMounted]);

  const categoryData = [
    // (생략) 기존 카테고리 데이터 그대로 사용
    // ...
  ];

  // ** 서버 사이드 렌더링 중일 때는 간단한 UI 렌더링 **
  if (!isMounted) {
    return (
      <div className="mx-auto h-[116px] shadow-[0px_1px_6px_rgba(0,0,0,0.08)]">
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
              <Link href={"#"}>
                <span className="text-[#191919] text-[12px] leading-[28px] font-semibold">
                  프로젝트 올리기
                </span>
              </Link>
            </li>
            {/* 로그인 상태에 따른 UI는 클라이언트에서만 렌더링 */}
            <li className="p-4">
              <Heart />
            </li>
            <li className="p-4">
              <Bell />
            </li>
            <li>
              <div className="flex cursor-pointer items-center border-1 ml-[10px] p-4 border-[#dfdfdf] rounded-[4px] min-w-[30px] max-h-[44px]">
                <Image
                  src={"/images/default_login_icon.png"}
                  width={24}
                  height={24}
                  alt="기본 로그인 아이콘"
                />
                <div className="font-bold text-[12px] ml-[10px]">로딩중</div>
              </div>
            </li>
          </ul>
        </div>

        {/* 2번째 헤더 */}
        <div className="w-full bg-white">
          <div className="w-[1160px] mx-auto flex justify-between items-center">
            <ul className="flex gap-[20px] h-[56px] items-center text-[15px] text-[#0d0d0d] font-semibold">
              <li className="flex group relative cursor-pointer">
                <Menu className="mr-[8px]" />
                <span className="pt-[1px] px-[6px]">카테고리</span>
              </li>
              <li>
                <Link href={"#"}>
                  <span className="pt-[1px] px-[6px]">홈</span>
                </Link>
              </li>
              <li>
                <Link href={"#"}>
                  <span className="pt-[1px] px-[6px]">인기</span>
                </Link>
              </li>
              <li>
                <Link href={"#"}>
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

  const router = useRouter();

  // 로그아웃 핸들러
  const handleLogout = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      await fetch("/api/register/user/me/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (e) {}
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLogin(false);
    setNickname("");
    router.push("/seokgeun/main");
  };

  const pathname = usePathname();


  return (
    <div
      className={`mx-auto  h-[116px] ${
        isCategoryOpen ? "" : "shadow-[0px_1px_6px_rgba(0,0,0,0.08)]"
      } `}
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
              <span className="text-[#191919] text-[12px] leading-[28px] font-semibold">프로젝트 올리기</span>
            </Link>
          </li>
          {isLogin ? (
            <>
              <li className="p-4">
                <Heart />
              </li>
              <li className="p-4 relative">
                <Link href="nayeon/notification" className="relative">
                  <Bell />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-[16px] h-[16px] rounded-full flex items-center justify-center pointer-events-none select-none">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
              </li>
              <li className="relative">
                <button
                  className="flex cursor-pointer items-center border-1 ml-[10px] p-4 border-[#dfdfdf] rounded-[4px] min-w-[30px] max-h-[44px]"
                  onClick={handleNicknameClick}
                >
                  <Image
                    src={profileImg}
                    width={24}
                    height={24}
                    alt="기본 로그인 아이콘"
                  />
                  <div className="font-bold text-[12px] ml-[10px]">
                    {nickname}
                  </div>

                </button>
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-[9999]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ul>
                      <li>
                        <Link
                          href="/seokgeun/dropdownmenu/mypage"
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          프로필
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/seokgeun/dropdownmenu/sponsoredprojects"
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          후원한 프로젝트
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/seokgeun/dropdownmenu/myreview"
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          내 후기
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/seokgeun/dropdownmenu/myliked"
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          관심 프로젝트
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/seokgeun/dropdownmenu/myfollow"
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          팔로우
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/seokgeun/dropdownmenu/mynotification"
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          알림
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/seokgeun/dropdownmenu/mymessage"
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          메시지
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/seokgeun/dropdownmenu/myproject"
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          내가 만든 프로젝트
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/seokgeun/dropdownmenu/mysettings/profile"
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
                href={"/seokgeun"}
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

              {/* 카테고리 메뉴 */}
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
                href={"#"}
                className="hover:text-[#FF5757] transition-all duration-300"
              >
                <span className="pt-[1px] px-[6px]">홈</span>
              </Link>
            </li>
            <li>
              <Link
                href={"#"}
                className="hover:text-[#FF5757] transition-all duration-300"
              >
                <span className="pt-[1px] px-[6px]">인기</span>
              </Link>
            </li>
            <li>
              <Link
                href={"#"}
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
