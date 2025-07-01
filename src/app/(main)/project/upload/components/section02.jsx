"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import Link from "next/link";

export default function Section02() {
  const slideData = [
    {
      src: "/jungho/project1.jpg",
      tag: "네이버웹툰",
      title: "화산은 사라지지 않는다, \n <화산귀환> 첫번째 단행본 제작",
      descript: "네이버 시리즈 무협 소설 부동의 1위 \n <화산귀환> 첫 번째 단행본 펀딩",
      percent: 3209,
    },
    {
      src: "/jungho/project2.jpg",
      tag: "에스틸로",
      title: "고객 피드백으로 돌아온 \n <누적 15만대> 미니건조기",
      descript: "1인 가구에게 대환영을 받은 \n 소형 가전 제품",
      percent: 13625,
    },
    {
      src: "/jungho/project3.jpg",
      tag: "널스노트(주)",
      title: "간호사가 만든 종아리 \n 압박스타킹 널핏",
      descript: "간호사를 간호하는 기업, 널스노트를 \n 6,000여 명에게 알리다",
      percent: 20525,
    },
    {
      src: "/jungho/project4.jpg",
      tag: "Moonlab Studio",
      title: "아기 오구의 모험기 \n '오구와 비밀의 숲'",
      descript: "텀블벅으로 구축한 캐릭터, \n 인기 이모티콘을 넘어 게임까지",
      percent: 1939,
    },
    {
      src: "/jungho/project6.jpg",
      tag: "써니사이드업",
      title: "마녀 엘리의 견습 생활, \n <숲속의 작은 마녀>",
      descript: "출시하자마자 스팀 전 세계 \n 최고 판매 제품 1위!",
      percent: 1366,
    },
    {
      src: "/jungho/project7.jpg",
      tag: "듀이랩스",
      title: "처음 만나는 더 쉽고 편해진 \n 생리디스크 <Poicup>",
      descript: "6,000여 명의 여성이 공감한 \n 차별화된 선택지",
      percent: 2006,
    },
    { src: "/jungho/project8.jpg" },
    { src: "/jungho/project9.jpg" },
    { src: "/jungho/project10.jpg" },
    { src: "/jungho/project11.jpg" },
    { src: "/jungho/project12.jpg" },
    { src: "/jungho/project13.jpg" },
    { src: "/jungho/project14.jpg" },
    { src: "/jungho/project15.jpg" },
    { src: "/jungho/project16.jpg" },
    { src: "/jungho/project17.jpg" },
    { src: "/jungho/project18.jpg" },
    { src: "/jungho/project19.jpg" },
    { src: "/jungho/project20.jpg" },
    { src: "/jungho/project21.jpg" },
    { src: "/jungho/project22.jpg" },
    { src: "/jungho/project23.jpg" },
    { src: "/jungho/project24.jpg" },
    { src: "/jungho/project25.jpg" },
    { src: "/jungho/project26.jpg" },
  ];

  return (
    <section className="w-full mt-[70px] h-[383px]">
      <Swiper slidesPerView={6} spaceBetween={150} centeredSlides={true} loop className="h-[355px]">
        {slideData.map((el, idx) => (
          <SwiperSlide key={idx}>
            <Link
              href="#"
              className="w-[240px] h-[343px] text-center flex flex-col gap-[12px] items-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-[12px] "
            >
              <Image src={el.src} alt={`Slide ${idx + 1}`} width={240} height={152} className="object-cover rounded" />
              <div className="w-full px-6">
                <p className="block w-full text-[#6d6d6d] rounded-[4px] mt-5 bg-[#f0f0f0] font-bold text-[10px] px-1.5">
                  {el.tag}
                </p>
                <p className="whitespace-pre mt-1.5 text-black font-bold text-[14px]">{el.title}</p>
                <p className="whitespace-pre text-[#3d3d3d] text-[10px]">{el.descript}</p>
                <p className="whitespace-pre text-[#f86453] mt-[8px] font-bold text-base">{el.percent}% 달성</p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
