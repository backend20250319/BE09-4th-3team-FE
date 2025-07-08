"use client";

import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import "../css/editor.css";

export default function CkEditor({ onChange, data = "" }) {
  const serverUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  return (
    <CKEditor
      editor={ClassicEditor}
      data={data} // ✅ 초기값 전달
      config={{
        ckfinder: {
          uploadUrl: `${serverUrl}/api/project/images/ckeditor-upload`,
        },
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "|",
          "imageUpload",
          "blockQuote",
        ],
        placeholder: "후원자 분들이 프로젝트를 빠르게 이해할 수 있도록 명확하게 소개해주세요.",
        heading: {
          options: [
            { model: "paragraph", title: "본문", class: "ck-heading_paragraph" },
            { model: "heading1", view: "h1", title: "제목 1", class: "ck-heading_heading1" },
            { model: "heading2", view: "h2", title: "제목 2", class: "ck-heading_heading2" },
          ],
        },
      }}
      onChange={(event, editor) => {
        onChange(editor.getData());
      }}
    />
  );
}
