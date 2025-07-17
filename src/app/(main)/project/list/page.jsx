import { Suspense } from "react";
import ProjectListClient from "./projectListClient";

export default function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ProjectListClient />
    </Suspense>
  );
}
