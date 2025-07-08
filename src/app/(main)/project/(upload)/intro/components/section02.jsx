"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import Image from "next/image";
import Link from "next/link";
import "../css/swiperActive.css";
import slideData from "@/app/(main)/project/(upload)/intro/data/section02SlideData";

export default function Section02() {
  return (
    <section className="w-full mt-[70px] h-[383px] ">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={6}
        centeredSlides={true}
        allowTouchMove={false}
        loop
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        speed={1000}
        onSlideChange={() => console.log("slide change")}
        className="h-[355px]"
      >
        {slideData.map((el, idx) => (
          <SwiperSlide key={idx}>
            <Link
              href="#"
              className="w-[240px] h-[343px] select-none text-center flex flex-col gap-[12px] items-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-[12px] "
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
