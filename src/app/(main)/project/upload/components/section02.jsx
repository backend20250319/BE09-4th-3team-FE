"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // 기본 스타일
import Image from "next/image";

export default function Section02() {
  const slideData = [
    { src: "/jungho/project1.jpg" },
    { src: "/jungho/project2.jpg" },
    { src: "/jungho/project3.jpg" },
    { src: "/jungho/project4.jpg" },
    { src: "/jungho/project5.jpg" },
  ];

  return (
    <section className="w-full mt-[70px] h-[386px]">
      <Swiper spaceBetween={30} slidesPerView={3} loop>
        {slideData.map((el, idx) => (
          <SwiperSlide key={idx}>
            <div className="w-[240px] h-[152px]">
              <Image src={el.src} alt={`Slide ${idx + 1}`} width={240} height={152} className="object-cover rounded" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
