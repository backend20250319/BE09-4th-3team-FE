"use client";
import React from "react";
import ReviewComponent from "../../../review/projectReviews/reviewComponent";

export default function ProjectReview({ project }) {
  return (
    <section className="w-[650px]">
      <div className="w-full min-h-[500px]">
        <ReviewComponent projectNo={project.projectNo} />
      </div>
    </section>
  );
}
