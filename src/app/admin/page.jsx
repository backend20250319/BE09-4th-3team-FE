'use client'

import {
    Users,
    FolderOpen,
    DollarSign,
    BarChart3,
    UserCheck,
    Wallet,
    Settings,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import './dashboard.css'
import PieChart from "@/app/admin/piechart";


export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalUsers: 0,
    })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = sessionStorage.getItem("accessToken")
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/dashboard/stats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`)
                }

                const data = await res.json()
                setStats({
                    totalProjects: data.totalProjects,
                    totalUsers: data.totalUsers,
                })
            } catch (error) {
                console.error('📛 대시보드 통계 로드 실패:', error)
            }
        }

        fetchStats()
    }, [])

    return (
        <div className="dashboard-container">
            <main className="dashboard-main">
                {/* 상단 통계 카드 */}
                <div className="dashboard-grid">
                    <StatCard title="Total Projects" value={stats.totalProjects} icon={<FolderOpen />} change="+12%" />
                    <StatCard title="Total Users" value={stats.totalUsers} icon={<Users />} change="+18%" />
                    <StatCard title="Total Funding" value="$2,847,392" icon={<DollarSign />} change="+25%" />
                    <StatCard title="Active Projects" value="892" icon={<BarChart3 />} change="+8%" />
                </div>

                {/* 파이 차트 삽입 */}
                <PieChart />

                {/* 활동 및 빠른 액션 */}
                <div className="dashboard-content">
                    {/* 최근 활동 */}
                    <div className="activity-card">
                        <div className="activity-header">
                            <div>
                                <h2>최근 소식</h2>
                                <p>플랫폼 최신 업데이트</p>
                            </div>
                            <Link href="#" className="view-all-link">View All</Link>
                        </div>
                        <ul className="activity-list">
                            <ActivityItem title='New project "AI Assistant" created' time="2 minutes ago" />
                            <ActivityItem title="User registration spike detected" time="15 minutes ago" />
                            <ActivityItem title="Funding milestone reached: $50K" time="1 hour ago" />
                        </ul>
                    </div>

                    {/* 빠른 액션 */}
                    <div className="quick-actions-card ">
                        <h2>퀵 메뉴</h2>
                        <div className="quick-actions-list">
                            <ActionButton icon={<UserCheck className="mr-2 h-4 w-4" />} text="회원 관리" />
                            <ActionButton icon={<FolderOpen className="mr-2 h-4 w-4" />} text="프로젝트 검토" />
                            <ActionButton icon={<Wallet className="mr-2 h-4 w-4" />} text="펀딩 처리" />
                            <ActionButton icon={<Settings className="mr-2 h-4 w-4" />} text="리뷰 조회" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

function StatCard({ title, value, icon, change }) {
    return (
        <div className="stat-card">
            <div className="stat-card-header">
                <h3>{title}</h3>
                <div className="stat-card-icon">{icon}</div>
            </div>
            <div className="stat-card-value">{value}</div>
            <p className="stat-card-change">{change} from last month</p>
        </div>
    )
}

function ActivityItem({ title, time }) {
    return (
        <li>
            <p className="font-medium text-sm">{title}</p>
            <p className="text-xs text-gray-500">{time}</p>
        </li>
    )
}

function ActionButton({ icon, text }) {
    return (
        <button className="quick-action-btn">
            {icon}
            {text}
        </button>
    )
}
