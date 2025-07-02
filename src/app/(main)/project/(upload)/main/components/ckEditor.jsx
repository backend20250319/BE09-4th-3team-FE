"use client";

import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import "../css/editor.css";

export default function CkEditor({ onChange }) {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
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
        placeholder: "여기에 내용을 작성하세요...",
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
