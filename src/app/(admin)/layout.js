import './adminheader.css'
import AdminHeader from "@/components/header/AdminHeader";

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
        <body>
        <AdminHeader />
        <main>{children}</main>
        </body>
        </html>
    )
}



export const metadata = {
    title: "텀블벅",
    description: "텀블벅 프론트 클론코딩 + 백엔드 기능 구현",
    icons: {
        icon: "/favicon.png",
    },
};