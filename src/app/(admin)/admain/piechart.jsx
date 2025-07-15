'use client'

import { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function PieChart() {
    const [statusData, setStatusData] = useState({
        PENDING: 0,
        APPROVED: 0,
        REJECTED: 0,
        IN_PROGRESS: 0,
        COMPLETED: 0,
    })

    useEffect(() => {
        const fetchStatusData = async () => {
            try {
                const token = sessionStorage.getItem("accessToken")
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/dashboard/project-status`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                const data = await res.json()
                setStatusData(data)
            } catch (error) {
                console.error('상태별 프로젝트 데이터를 불러오는 데 실패했습니다.', error)
            }
        }
        fetchStatusData()
    }, [])

    const chartData = {
        labels: ['대기중', '승인됨', '거절됨', '진행중', '완료됨'],
        datasets: [
            {
                data: [
                    statusData.PENDING,
                    statusData.APPROVED,
                    statusData.REJECTED,
                    statusData.IN_PROGRESS,
                    statusData.COMPLETED,
                ],
                backgroundColor: [
                    '#FFCE56', // 대기중 - 노랑
                    '#4CAF50', // 승인됨 - 초록
                    '#FF6384', // 거절됨 - 빨강
                    '#36A2EB', // 진행중 - 파랑
                    '#9C27B0', // 완료됨 - 보라
                ],
                borderWidth: 1,
            },
        ],
    }

    return (
        <div style={{ width: '100%', maxWidth: '450px', margin: '2rem auto' }}>
            <h3 className="text-center text-lg font-semibold mb-4">프로젝트 상태 분포</h3>
            <Pie data={chartData} />
        </div>
    )
}
