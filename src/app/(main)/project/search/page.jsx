import { Suspense } from "react";
import SearchPageClient from "./searchClient";

export default function Page() {
  return (
    <Suspense fallback={<div>검색 중입니다...</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
