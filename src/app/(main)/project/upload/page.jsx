import React from "react";
import Section01 from "./components/section01";
import Section02 from "./components/section02";

export default function Page() {
  return (
    <main className="flex flex-col items-center w-full mx-auto">
      <Section01 />
      <Section02 />
    </main>
  );
}
