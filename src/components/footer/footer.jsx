"use client";
import Link from "next/link";
import FooterLink from "./footerLink";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-[#efefef] z-40">
      <div className="relative overflow-hidden flex w-full items-center justify-center flex-col bg-white">
        {/* 첫번째 푸터 */}
        <section className="w-[1160px] flex flex-row justify-between max-h-[220px] min-h-[178px] ">
          <div className="mt-6 flex">
            <div className="flex-nowrap flex">
              <ul className="min-w-[160px] flex-wrap text-[#6d6d6d] font-medium text-sm leading-[22px] gap-3 flex flex-col">
                <li className="text-base font-bold text-[#3d3d3d]">
                  <h2>텀블벅</h2>
                </li>
                <FooterLink href="#" label="공지사항" isNew />
                <FooterLink href="#" label="서비스 소개" />
                <FooterLink href="#" label="채용" isNew />
                <FooterLink href="#" label="2024 텀블벅 결산" />
                <FooterLink href="#" label="텀블벅 광고센터" highlight />
              </ul>
              <ul className="min-w-[160px] flex-wrap text-[#6d6d6d] font-medium text-sm leading-[22px] gap-3 flex flex-col">
                <li className="text-base font-bold text-[#3d3d3d]">
                  <h2>이용안내</h2>
                </li>
                <FooterLink href="#" label="헬프센터" />
                <FooterLink href="#" label="첫 후원 가이드" />
                <FooterLink href="#" label="창작자 가이드" highlight />
                <FooterLink href="#" label="수수료 안내" />
                <FooterLink href="#" label="제휴·협력" />
              </ul>
              <ul className="min-w-[160px] flex-wrap text-[#6d6d6d] font-medium text-sm leading-[22px] gap-3 flex flex-col">
                <li className="text-base font-bold text-[#3d3d3d]">
                  <h2>정책</h2>
                </li>
                <FooterLink href="#" label="이용약관" highlight />
                <FooterLink href="#" label="개인정보처리방침" />
                <FooterLink href="#" label="프로젝트 심사 기준" />
              </ul>
              <ul className="min-w-[160px] flex-wrap text-[#6d6d6d] font-medium text-sm leading-[22px] gap-3 flex flex-col">
                <li className="text-base font-bold text-[#3d3d3d]">
                  <h2>App</h2>
                </li>
                <li className="hover:text-[#1c1c1c] hover:font-semibold transition-all duration-200 ease-in-out">
                  <Link
                    href="#"
                    className="bg-[#f0f0f0] rounded-[4px] w-[140px] h-[36px] flex justify-center items-center"
                  >
                    <div className="flex justify-center items-center gap-1">
                      <div className="w-[14px] h-[14px]">
                        <svg viewBox="0 0 48 48" className="text-[#6d6d6d]">
                          <path d="M24.6449 23.5185L10.1867 7.23185C10.0938 7.12575 9.9721 7.05142 9.83766 7.01869C9.70321 6.98597 9.56237 6.99639 9.43375 7.04858C9.30513 7.10077 9.1948 7.19226 9.11736 7.31097C9.03991 7.42968 8.99899 7.57 9.00002 7.71337V40.2866C8.99899 40.43 9.03991 40.5703 9.11736 40.689C9.1948 40.8077 9.30513 40.8992 9.43375 40.9514C9.56237 41.0036 9.70321 41.014 9.83766 40.9813C9.9721 40.9486 10.0938 40.8743 10.1867 40.7681L24.6449 24.4815C24.7619 24.3506 24.8269 24.1786 24.8269 24C24.8269 23.8214 24.7619 23.6494 24.6449 23.5185Z"></path>
                          <path d="M26.5546 25.6712C26.4887 25.6018 26.4101 25.5467 26.3235 25.5091C26.2368 25.4715 26.1439 25.4522 26.05 25.4522C25.9561 25.4522 25.8631 25.4715 25.7765 25.5091C25.6899 25.5467 25.6113 25.6018 25.5453 25.6712L14.2515 38.4172C14.1414 38.5421 14.0779 38.7038 14.0727 38.873C14.0675 39.0422 14.1209 39.2078 14.2232 39.3397C14.3255 39.4715 14.4698 39.561 14.6302 39.5918C14.7905 39.6227 14.9562 39.5928 15.0972 39.5077C19.4619 36.8877 24.8906 33.5737 29.76 30.5713C29.8474 30.5172 29.922 30.4435 29.9784 30.3556C30.0347 30.2677 30.0715 30.1678 30.0858 30.0633C30.1002 29.9587 30.0919 29.8521 30.0615 29.7514C30.0311 29.6506 29.9793 29.5581 29.91 29.4808L26.5546 25.6712Z"></path>
                          <path d="M38.3256 22.7537L32.1877 18.9724C32.0538 18.8904 31.897 18.8583 31.7433 18.8815C31.5895 18.9047 31.4479 18.9817 31.342 19.0998L27.4138 23.5185C27.2968 23.6494 27.2318 23.8214 27.2318 24C27.2318 24.1786 27.2968 24.3506 27.4138 24.4815L31.342 28.9001C31.4479 29.0182 31.5895 29.0953 31.7433 29.1184C31.897 29.1416 32.0538 29.1096 32.1877 29.0276L38.2711 25.2463C38.491 25.1261 38.6752 24.9459 38.8036 24.725C38.9321 24.5041 39 24.2509 39 23.9929C39 23.7349 38.9321 23.4817 38.8036 23.2608C38.6752 23.0399 38.491 22.8597 38.2711 22.7395L38.3256 22.7537Z"></path>
                          <path d="M25.5587 22.3288C25.6226 22.4018 25.7006 22.4602 25.7875 22.5001C25.8744 22.54 25.9684 22.5606 26.0634 22.5606C26.1584 22.5606 26.2524 22.54 26.3393 22.5001C26.4262 22.4602 26.5041 22.4018 26.5681 22.3288L29.9371 18.5333C30.0064 18.456 30.0581 18.3636 30.0886 18.2628C30.119 18.162 30.1273 18.0554 30.1129 17.9509C30.0985 17.8463 30.0618 17.7464 30.0054 17.6585C29.949 17.5706 29.8744 17.4969 29.7871 17.4428C24.8904 14.4404 19.4617 11.1406 15.1106 8.50642C14.9696 8.42131 14.804 8.39147 14.6436 8.4223C14.4833 8.45313 14.3389 8.5426 14.2366 8.67448C14.1343 8.80636 14.081 8.97192 14.0862 9.14115C14.0914 9.31038 14.1548 9.47207 14.2649 9.59692L25.5587 22.3288Z"></path>
                        </svg>
                      </div>
                      안드로이드
                    </div>
                  </Link>
                </li>
                <li className="hover:text-[#1c1c1c] hover:font-semibold transition-all duration-200 ease-in-out">
                  <Link
                    href="#"
                    className="bg-[#f0f0f0] rounded-[4px] w-[140px] h-[36px] flex justify-center items-center"
                  >
                    <div className="flex justify-center items-center gap-1">
                      <div className="w-[14px] h-[14px]">
                        <svg viewBox="0 0 48 48">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M27.3052 12.4302C26.2982 12.9673 25.3542 13.2371 24.4707 13.2371C24.2866 13.2371 24.1052 13.2211 23.9317 13.189C23.9212 13.1383 23.9054 13.0421 23.8843 12.9005C23.8633 12.7589 23.8554 12.6146 23.8554 12.4703C23.8554 11.4362 24.0737 10.4369 24.5154 9.47228C24.9572 8.50501 25.4567 7.69806 26.0115 7.05144C26.7294 6.19639 27.6286 5.48297 28.7067 4.91383C29.7848 4.34736 30.8181 4.04008 31.8042 4C31.8541 4.24048 31.8804 4.50501 31.8804 4.79893C31.8804 5.83033 31.6858 6.835 31.2967 7.81029C30.9049 8.78824 30.4079 9.6513 29.8005 10.4021C29.1432 11.2171 28.3123 11.8931 27.3052 12.4302ZM32.5062 13.7608C33.0952 13.8196 33.7683 13.9666 34.5229 14.2071C35.2776 14.4475 36.0454 14.8376 36.8263 15.3801C37.6072 15.9252 38.3251 16.6813 38.9824 17.6513C38.9219 17.694 38.6748 17.8731 38.2435 18.191C37.8123 18.509 37.3259 18.9766 36.7816 19.5938C36.2347 20.2084 35.7614 20.9859 35.3565 21.9265C34.9489 22.8644 34.7464 23.9759 34.7464 25.2612C34.7464 26.4395 34.92 27.4763 35.2618 28.3687C35.6062 29.2612 36.0348 30.0227 36.5502 30.6533C37.0629 31.2865 37.5757 31.7969 38.091 32.1897C38.6038 32.5798 39.0429 32.8684 39.4084 33.0581C39.7712 33.2451 39.9684 33.344 40 33.3547C39.9895 33.3974 39.8922 33.694 39.7081 34.2471C39.5214 34.8002 39.2322 35.5003 38.8378 36.3447C38.4408 37.1917 37.9306 38.0841 37.3048 39.022C36.75 39.837 36.1716 40.6226 35.5721 41.3787C34.9699 42.1349 34.3126 42.7548 33.6 43.2331C32.8848 43.7141 32.0802 43.9545 31.1888 43.9545C30.521 43.9545 29.9477 43.8744 29.4692 43.7114C28.9933 43.5484 28.541 43.3614 28.115 43.1476C27.6891 42.9338 27.2131 42.7495 26.6899 42.5918C26.164 42.4342 25.5172 42.3567 24.7468 42.3567C23.9974 42.3567 23.3453 42.4368 22.7905 42.5998C22.2357 42.7628 21.7282 42.9525 21.2654 43.1716C20.8026 43.3908 20.3346 43.5831 19.856 43.7515C19.3775 43.9171 18.8358 44 18.2311 44C17.4081 44 16.6587 43.7702 15.9803 43.3133C15.3045 42.8537 14.6524 42.2364 14.024 41.4642C13.3982 40.692 12.7619 39.8423 12.115 38.9125C11.3551 37.8169 10.6636 36.5451 10.0431 35.0995C9.41988 33.6539 8.92555 32.1256 8.55481 30.5143C8.18669 28.9004 8 27.2865 8 25.6673C8 23.7274 8.28135 22.0147 8.84141 20.5317C9.39885 19.0514 10.1535 17.8089 11.0975 16.8069C12.0414 15.8049 13.1011 15.0487 14.2712 14.5437C15.4412 14.0387 16.6429 13.7849 17.8761 13.7849C18.7385 13.7849 19.5537 13.9292 20.3188 14.2151C21.084 14.501 21.7939 14.7895 22.4513 15.0755C23.1086 15.364 23.716 15.5056 24.2708 15.5056C24.7836 15.5056 25.3883 15.356 26.0878 15.0514C26.7872 14.7495 27.5655 14.4449 28.4227 14.1376C29.2799 13.8276 30.2028 13.6753 31.1888 13.6753C31.4754 13.6753 31.9145 13.7047 32.5062 13.7608Z"
                          ></path>
                        </svg>
                      </div>
                      iOS
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="min-w-[200px] mt-6">
            <ul className="flex flex-col gap-3">
              <li className="text-sm text-[#3d3d3d] font-bold leading-[24px] ">고객지원</li>
              <li className="text-xs text-[#6d6d6d] leading-[18px]">평일 9:30 ~ 17:00 (12:00 ~14:00 제외)</li>
              <li className="">
                <Link
                  href={"#"}
                  className="max-w-[180px] h-9 text-sm leading-[22px] border border-[#e4e4e4] flex justify-center items-center rounded-[4px] "
                >
                  텀블벅에 문의
                </Link>
              </li>
            </ul>
          </div>
        </section>
        {/* 두번째 푸터 */}
        <section className="w-[1160px] flex flex-row justify-between mt-[18px] border-t border-[#efefef]">
          <div className="pt-5 min-w-[800px] w-full p place-content-start whitespace-pre">
            <div className="flex flex-wrap">
              <div className="text-[13px] h-5 leading-5">
                <strong>회사명 </strong>
                <span>(주) 백패커 </span>
              </div>
              <div className="text-[13px] h-5 leading-5">
                <strong>주소 </strong>
                <span>서울특별시 서초구 서초대로 398, 20층(서초동, BNK디지털타워) </span>
              </div>
              <div className="text-[13px] h-5 leading-5">
                <strong>대표 </strong>
                <span>김동환 </span>
              </div>
              <div className="text-[13px] h-5 leading-5">
                <strong>사업자등록번호 </strong>
                <span>107-87-83297 </span>
              </div>
              <div className="text-[13px] h-5 leading-5">
                <strong>통신판매업 신고번호 </strong>
                <span>2023-서울서초-2114호 </span>
              </div>
              <div className="text-[13px] h-5 leading-5">
                <strong>대표번호 </strong>
                <span>02-6080-0760 </span>
              </div>
              <div className="text-[13px] h-5 leading-5">
                <strong>메일주소 </strong>
                <span>support_tumblbug@backpac.kr </span>
              </div>
            </div>

            <div className="text-[13px] leading-5 mb-[72px] block text-[#9e9e9e]">@ 2025 Backpackr Inc.</div>
          </div>
          <div className="mt-[10px] flex w-full justify-end">
            <Link
              href="#"
              className="mr-[10px] inline-flex hover:border-[#6d6d6d] transition-all duration-300 ease-in-out justify-center items-center w-8 h-8 border border-[#e4e4e4] rounded-[32px] opacity-50 "
            >
              <div className="w-[18px] h-[18px]">
                <svg viewBox="0 0 48 48">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24 4C11.8 4 2 11.6865 2 21.0924C2.4 27.5653 6.4 33.1279 12.2 35.5552L10.1 43.2417C10 43.444 10.1 43.7474 10.3 43.8475C10.5 44.0508 10.9 44.0508 11.1 43.8475L20 37.8814C21.3 38.0837 22.6 38.1848 24 38.1848C36.1 38.1848 46 30.4983 46 21.0924C46 11.6865 36.2 4 24 4Z"
                  ></path>
                </svg>
              </div>
            </Link>
            <Link
              href="#"
              className="mr-[10px] inline-flex hover:border-[#6d6d6d] transition-all duration-300 ease-in-ou justify-center items-center w-8 h-8 border border-[#e4e4e4] rounded-[32px] opacity-50 "
            >
              <div className="w-[18px] h-[18px]">
                <svg viewBox="0 0 48 48">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M27.3343 2.24555C15.2931 0.443311 4.05474 8.75365 2.24857 20.8687C0.442397 32.9838 8.67052 44.1978 20.7117 46V30.4807H15.1928V24.0727H20.7117V19.1666V17.6647C21.0127 13.3594 24.7254 10.1554 29.0401 10.4558C30.6456 10.4558 32.3514 10.656 33.9579 10.8563V16.3631H31.047H30.3446C28.5384 16.5634 27.3343 18.0652 27.4356 19.8675V23.9726H33.5556L32.5521 30.3816H27.535V46C32.6525 45.199 37.3686 42.4956 40.6799 38.5908C44.0916 34.5858 45.9991 29.3803 45.9991 24.0727C46.0984 13.1591 38.071 3.84755 27.3343 2.24555Z"
                  ></path>
                </svg>
              </div>
            </Link>
            <Link
              href="#"
              className="mr-[10px] inline-flex hover:border-[#6d6d6d] transition-all duration-300 ease-in-ou justify-center items-center w-8 h-8 border border-[#e4e4e4] rounded-[32px] opacity-50 "
            >
              <div className="w-[18px] h-[18px]">
                <svg viewBox="0 0 48 48">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M46 10.288C44.304 10.986 42.607 11.485 40.812 11.784C42.707 10.587 44.104 8.792 44.803 6.698C43.007 7.795 41.111 8.493 39.115 8.892C37.419 7.097 35.024 6 32.53 6C27.542 6.1 23.451 10.188 23.551 15.175C23.551 15.873 23.65 16.571 23.75 17.269C16.467 16.87 9.682 13.38 5.192 7.596C2.798 11.784 3.995 17.169 7.986 19.962C6.589 19.962 5.192 19.563 3.896 18.765V18.865C3.796 23.253 6.889 27.042 11.079 27.939C10.281 28.14 9.483 28.239 8.685 28.239C8.086 28.239 7.587 28.14 6.988 28.04C8.086 31.729 11.478 34.322 15.37 34.422C12.177 37.015 8.186 38.411 4.195 38.411C3.497 38.411 2.798 38.411 2 38.311C6.09 41.103 10.879 42.5 15.769 42.5C30.036 42.4 41.41 30.832 41.41 16.571V16.172V14.975C43.306 13.779 44.803 12.183 46 10.288Z"
                  ></path>
                </svg>
              </div>
            </Link>
            <Link
              href="#"
              className="mr-[10px] inline-flex hover:border-[#6d6d6d] transition-all duration-300 ease-in-ou justify-center items-center w-8 h-8 border border-[#e4e4e4] rounded-[32px] opacity-50 "
            >
              <div className="w-[18px] h-[18px]">
                <svg viewBox="0 0 48 48">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M36.0761 9.1C36.0761 10.5 37.1785 11.6 38.5816 11.6C39.8846 11.6 41.0872 10.5 41.0872 9.1C41.0872 7.7 39.9848 6.6 38.5816 6.6C37.1785 6.6 36.0761 7.7 36.0761 9.1ZM10.9199 24C10.9199 31.1 16.8331 37 24.0492 37C31.2653 37 37.0783 31.2 37.0783 24C37.0783 16.8 31.1651 10.9 23.949 10.9C16.8331 10.9 10.9199 16.8 10.9199 24ZM11.3208 2H36.7776C41.9893 2 46.0984 6.2 45.9982 11.3V36.7C45.9982 41.8 41.889 46 36.6774 46H11.3208C6.2094 46 2 41.8 2 36.6V11.3C2 6.2 6.2094 2 11.3208 2ZM15.1293 24C15.1293 19.1 19.1383 15.1 24.0492 15.1C29.0604 15.1 32.9691 19.1 32.9691 24C32.9691 28.9 28.9602 32.9 24.0492 32.9C19.1383 32.9 15.1293 28.9 15.1293 24Z"
                  ></path>
                </svg>
              </div>
            </Link>
          </div>
        </section>
        {/* 세번째 푸터 */}
        <section className="w-[1160px] flex mb-5 items-center text-[#666] text-[10px] font-normal leading-[150%]">
          <Link href="#">
            <Image src={"/jungho/logo_isms.png"} alt="isms 로고" width={48} height={48} />
          </Link>
          <div className="flex pl-1 flex-col">
            <div className="flex w-full flex-wrap ">
              <span>[인증범위] 온라인 플랫폼 운영 (아이디어스,텀블벅)</span>
              <span>(심사받지 않은 물리적 인프라 제외)</span>
            </div>
            <span>[유효기간] 2024.11.06 ~ 2027.11.05</span>
          </div>
        </section>
        {/* 네번째 푸터 */}
        <section className="flex w-full h-auto min-h-[56px] items-center justify-center bg-[#f0f0f0] text-[#6d6d6d]">
          <div className="w-[1160px] text-xs leading-[12px] ">
            텀블벅은 크라우드 펀딩 및 통신판매중개 서비스를 제공하는 플랫폼으로 모금 및 통신판매의 당사자가 아니며,
            프로젝트의 정보, 진행, 선물 제공, 거래 등에 대한 책임은 프로젝트 창작자에게 있습니다.
          </div>
        </section>
      </div>
    </footer>
  );
}
