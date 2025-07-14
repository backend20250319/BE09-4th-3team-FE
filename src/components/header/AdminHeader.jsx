import { BarChart3, Bell, Menu, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminHeader() {
    return (
        <header className="dashboard-header">
            <nav className="dashboard-nav">
                <Link href="#" className="dashboard-logo">
                    <BarChart3 className="h-6 w-6" />
                    <span className="sr-only">Admin Dashboard</span>
                </Link>
                <Link href="/admin" className="dashboard-link-active">대시 보드</Link>
                <Link href="/src/app/admin/projects" className="dashboard-link">프로젝트 관리</Link>
                <Link href="/src/app/admin/users" className="dashboard-link">회원 관리</Link>
                <Link href="/admin/fundings" className="dashboard-link">펀딩 관리</Link>
                <Link href="/src/app/admin/review" className="dashboard-link">리뷰 관리</Link>
            </nav>

            {/* 모바일 햄버거 메뉴 */}
            <button className="mobile-menu-button md:hidden">
                <Menu className="h-5 w-5" />
            </button>

            {/* 검색, 알림, 프로필 아바타 */}
            <div className="dashboard-actions">
                <form className="relative">
                    <Search className="search-icon" />
                    <input
                        type="search"
                        placeholder="Search..."
                        className="dashboard-search"
                    />
                </form>
                <button className="notification-button">
                    <Bell className="h-4 w-4" />
                </button>
                <button className="avatar-button">
                    <Image src="/placeholder.svg" width={32} height={32} alt="Avatar" />
                </button>
            </div>
        </header>
    )
}



