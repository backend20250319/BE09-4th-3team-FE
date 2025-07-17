"use client";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Asterisk, FileImage, Info, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axios from "axios";

const CkEditor = dynamic(() => import("./ckEditor"), {
  ssr: false,
});

export default function Section01({
  title,
  setTitle,
  description,
  setDescription,
  categoryNo,
  setCategoryNo,
  thumbnailUrl,
  setThumbnailUrl,
  thumbnailPreview,
  setThumbnailPreview,
}) {
  useEffect(() => {
    // 새로고침 시에도 미리보기 유지
    if (thumbnailUrl) {
      setThumbnailPreview(thumbnailUrl);
    }
  }, [thumbnailUrl]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = sessionStorage.getItem("accessToken");
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project/images/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const imageUrl = res.data.thumbnail.imagePath;
      setThumbnailUrl(imageUrl);
      setThumbnailPreview(imageUrl);
    } catch (err) {
      console.error("이미지 업로드 실패", err);
    }
  };

  const categories = [
    { id: 1, name: "보드게임 · TRPG" },
    { id: 2, name: "디지털 게임" },
    { id: 3, name: "웹툰 · 만화" },
    { id: 4, name: "웹툰 리소스" },
    { id: 5, name: "디자인 문구" },
    { id: 6, name: "캐릭터 · 굿즈" },
    { id: 7, name: "홈 · 리빙" },
    { id: 8, name: "테크 · 가전" },
    { id: 9, name: "반려동물" },
    { id: 10, name: "푸드" },
    { id: 11, name: "향수 · 뷰티" },
    { id: 12, name: "의류" },
    { id: 13, name: "잡화" },
    { id: 14, name: "주얼리" },
    { id: 15, name: "출판" },
    { id: 16, name: "디자인" },
    { id: 17, name: "예술" },
    { id: 18, name: "사진" },
    { id: 19, name: "음악" },
    { id: 20, name: "영화 · 비디오" },
    { id: 21, name: "공연" },
  ];

  return (
    <section>
      {/* 카테고리 */}
      <div className="space-y-1 flex justify-between pb-12 mb-14 border-b border-[#ddd]">
        <div className=" w-[351px]">
          <h2 className="font-bold mb-3">프로젝트 카테고리</h2>
          <p className="text-[#6d6d6d] font-normal text-sm">
            프로젝트 성격과 가장 일치하는 카테고리를 선택해주세요. <br /> 적합하지 않을 경우 운영자에 의해 조정될 수
            있습니다.
          </p>
        </div>
        <div className="w-[630px]">
          <div className="flex items-center mb-2">
            <p className="text-[12px] leading-[18px] text-[#3d3d3d] font-bold">카테고리</p>
            <Asterisk color="#ff0000" strokeWidth={2} size={13} />
          </div>
          <span className="max-h-[41px] flex leading-6 items-center rounded-[1px] px-[18px] border border-[#e4e4e4]">
            <select
              id="categoryNo"
              value={categoryNo}
              onChange={(e) => setCategoryNo(Number(e.target.value))}
              className="w-full border px-3 py-2 rounded border-none outline-0 text-sm"
            >
              <option value="" disabled>
                카테고리를 선택하세요
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </span>
        </div>
      </div>

      {/* 프로젝트 제목 */}
      <div className="space-y-1 flex justify-between pb-12 mb-14 border-b border-[#ddd]">
        <div className=" w-[351px]">
          <h2 className="font-bold mb-3">프로젝트 제목</h2>
          <p className="text-[#6d6d6d] font-normal text-sm">
            프로젝트의 주제, 창작물의 품목이 명확하게 드러나는 멋진 제목을 붙여주세요.
          </p>
        </div>
        <div className="w-[630px]">
          <div className="flex items-center mb-2">
            <p className="text-[12px] leading-[18px] text-[#3d3d3d] font-bold">제목</p>
            <Asterisk color="#ff0000" strokeWidth={2} size={13} />
          </div>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded placeholder:text-sm"
            placeholder="프로젝트의 주제, 창작물의 품목이 명확하게 드러나는 멋진 제목을 붙여주세요."
            required
          />
        </div>
      </div>

      {/* 프로젝트 설명 */}
      <div className="space-y-1 flex justify-between pb-12 mb-14 border-b border-[#ddd]">
        <div className=" w-[351px]">
          <h2 className="font-bold mb-3">프로젝트 설명</h2>
          <p className="text-[#6d6d6d] font-normal text-sm">프로젝트의 자세한 설명 및 이미지를 등록해 주세요.</p>
        </div>
        <div className="w-[630px]">
          <div className="flex items-center mb-2">
            <p className="text-[12px] leading-[18px] text-[#3d3d3d] font-bold">설명</p>
            <Asterisk color="#ff0000" strokeWidth={2} size={13} />
          </div>
          <CkEditor onChange={setDescription} data={description} />
        </div>
      </div>

      {/* 썸네일 */}
      <div className="space-y-1 flex justify-between pb-12 mb-14 border-b border-[#ddd]">
        <div className=" w-[351px]">
          <h2 className="font-bold  mb-3">프로젝트 대표 이미지</h2>
          <p className="text-[#6d6d6d] font-normal text-sm">
            후원자들이 프로젝트의 내용을 쉽게 파악하고 좋은 인상을 받을 수 있도록 이미지 가이드라인을 따라 주세요.
          </p>
        </div>
        <div className="w-[630px]">
          <div className="flex items-center mb-2">
            <p className="text-[12px] leading-[18px] text-[#3d3d3d] font-bold">대표이미지 설정</p>
            <Asterisk color="#ff0000" strokeWidth={2} size={13} />
          </div>
          <label
            htmlFor="thumbnail"
            className="block mt-4 p-4 border border-gray-200 rounded mb-[25px] bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
          >
            <div className="flex items-center justify-between ">
              <span className="flex items-center text-sm font-medium text-gray-800">
                <i className="mr-2">
                  <FileImage color="#f86453" strokeWidth={1} />
                </i>
                대표 이미지 업로드
              </span>
              <span className="inline-block bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 text-sm">
                {thumbnailUrl ? "이미지 다시 선택" : "이미지 선택"}
              </span>
            </div>
          </label>

          <input id="thumbnail" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

          {thumbnailPreview && (
            <>
              <div>
                <p className="text-xs text-gray-600 font-bold">미리보기</p>
                <p className="text-[10px] text-gray-600 font-bold mb-4 flex items-center">
                  <Info color="#ff0000" size={12} className="mr-1" />
                  이지미를 클릭하시면 대표 이미지를 크게 확인할 수 있습니다.
                </p>
              </div>
              <div className="py-[22px] px-8 flex flex-wrap items-center justify-between bg-white border border-[#eaeaea]">
                {/* 썸네일 이미지 + 모달 트리거 */}
                <Dialog>
                  <DialogTrigger asChild>
                    <img
                      src={thumbnailPreview}
                      alt="썸네일"
                      className="w-40 border rounded cursor-pointer hover:opacity-80 transition"
                      title="이미지 크게 보기"
                    />
                  </DialogTrigger>
                  <DialogContent className="w-[400px] flex justify-center items-center flex-col">
                    <DialogHeader>
                      <DialogTitle>이미지 미리보기</DialogTitle>
                    </DialogHeader>
                    <img src={thumbnailPreview} alt="미리보기 이미지" className="w-[300px] h-[300px] rounded border" />
                  </DialogContent>
                </Dialog>

                {/* 삭제 버튼 */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailPreview("");
                      setThumbnailUrl("");
                    }}
                    className="w-[75px] h-[36px] rounded-[1px] text-xs flex items-center justify-center px-4 cursor-pointer border border-[#f0f0f0]"
                  >
                    <i className="mr-2">
                      <Trash2 color="#f86453" strokeWidth={2} size={12} />
                    </i>
                    삭제
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
