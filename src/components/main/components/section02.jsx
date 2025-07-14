"use client";

import { getDday } from "@/components/utils/dday";
import Image from "next/image";
import Link from "next/link";

export default function Section02({ projects }) {
  const sectionTitles = ["이런 프로젝트 어때요?", "에디터의 PICK", "내가 본 프로젝트와 비슷해요"];

  return (
    <section className="pt-6">
      <div className="max-w-[1160px] mx-auto pb-11">
        {sectionTitles.map((title, i) => (
          <div key={i}>
            <div className="flex items-center gap-[10px] mt-6">
              <h2 className="text-[#1c1c1c] font-bold text-xl">{title}</h2>
              <span className="w-[25px] h-[19px] flex justify-center items-center rounded-[2px] font-bold text-[11px] border border-[#e4e4e4] text-[#e4e4e4]">
                AD
              </span>
            </div>
            <div className="flex gap-[14px] justify-between mt-4 mb-[60px]">
              {projects.slice(0, 5).map((project) => (
                <Link key={`${i}-${project.projectNo}`} href={`/project/detail/${project.projectNo}`}>
                  <div className="rounded-t-[8px]">
                    {project.thumbnailUrl ? (
                      <div className="overflow-hidden rounded-t-[8px]">
                        <Image
                          src={project.thumbnailUrl}
                          alt={project.title}
                          width={220}
                          height={220}
                          className="object-cover transition-transform rounded-b-[8px] duration-300 ease-in-out hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div className="h-[264px] bg-gray-200 flex mb-[14px] items-center justify-center text-sm text-gray-500 rounded-[8px]">
                        이미지 없음
                      </div>
                    )}

                    <div className="pt-4 flex flex-col">
                      <p className="text-xs leading-[120%] text-[#545454]">{project.creatorName}</p>
                      <h2 className="text-base pb-1 text-[#1c1c1c] mb-[6px]">{project.title}</h2>
                    </div>
                    <div className="bg-[#f0f0f0] w-12 text-[#545454] h-[18px] text-[10px] font-bold justify-center leading-[120%] flex items-center px-1 rounded-[2px]">
                      {getDday(project.startLine, project.deadLine)}일 남음
                    </div>
                    <div className="pb-1 text-sm">
                      <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                          <p className="text-sm text-[#eb4b38] font-bold">{project.percent}% 달성</p>
                          {project.creatorName == "hoya" && (
                            <div>
                              <Image src={"/main/goodCreator.png"} alt="좋은 창작자" width={60} height={17} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
