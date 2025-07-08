"use client";
import React, { useEffect, useState } from "react";
import usePersistedState from "../hooks/usePersistedState";
import axios from "axios";

export default function Section03() {
  const [thumbnailUrl, setThumbnailUrl] = usePersistedState("project_thumbnailUrl", "");
  const [thumbnailPreview, setThumbnailPreview] = useState("");

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
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project/images/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const imageUrl = res.data.thumbnail.imagePath;
      setThumbnailUrl(imageUrl);
      setThumbnailPreview(imageUrl); // ✅ 서버 URL을 바로 미리보기로 사용
    } catch (err) {
      console.error("이미지 업로드 실패", err);
    }
  };

  return (
    <section>
      {/* 썸네일 */}
      <div className="space-y-1">
        <label className="block text-lg font-medium text-gray-700">
          썸네일 업로드
          <span className="text-[#f00] pt-[2px]">*</span>
        </label>

        <label
          htmlFor="thumbnail"
          className="inline-block bg-blue-600 text-white px-3 py-2 rounded cursor-pointer hover:bg-blue-700"
        >
          {thumbnailUrl ? "이미지 다시 선택" : "이미지 선택"}
        </label>
        <input id="thumbnail" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

        {thumbnailPreview && (
          <div className="mt-2">
            <p className="text-lg text-gray-600">썸네일 미리보기</p>
            <img src={thumbnailPreview} alt="썸네일" className="w-40 border rounded" />
            <button
              type="button"
              onClick={() => {
                setThumbnailPreview("");
                setThumbnailUrl("");
              }}
              className="text-lg text-red-500 hover:underline"
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
