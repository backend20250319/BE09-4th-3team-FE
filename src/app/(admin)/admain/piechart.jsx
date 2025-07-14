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
        labels: ['대기중', '승인됨', '거절됨'],
        datasets: [
            {
                data: [
                    statusData.PENDING,
                    statusData.APPROVED,
                    statusData.REJECTED,
                ],
                backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384'],
                borderWidth: 1,
            },
        ],
    }

    return (
        <div style={{ width: '100%', maxWidth: '400px', margin: '2rem auto' }}>
            <h3 className="text-center mb-4">프로젝트 상태 분포</h3>
            <Pie data={chartData} />
        </div>
    )
}
