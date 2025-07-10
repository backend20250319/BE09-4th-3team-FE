"use client";
import React from "react";

export default function ProjectPlan({ project }) {
  return (
    <section className="w-[650px]">
      <div dangerouslySetInnerHTML={{ __html: project.description }} />
    </section>
  );
}
