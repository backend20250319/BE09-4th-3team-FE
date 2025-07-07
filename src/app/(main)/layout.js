import Header from "@/components/header/Header";
import "./globals.css";

export const metadata = {
  title: "텀블벅",
  description: "텀블벅 프론트 클론코딩 + 백엔드 기능 구현",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}