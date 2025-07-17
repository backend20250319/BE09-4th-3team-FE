"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
);

export default function DailyFundingLineChart() {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetchDailyFunding();
    }, []);

    const fetchDailyFunding = async () => {
        try {
            const token = sessionStorage.getItem("accessToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/pledges/daily-summary`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            // 날짜순 정렬
            const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

            const labels = sorted.map((item) => item.date);
            const amounts = sorted.map((item) => item.totalFunding); // 수정된 필드

            setChartData({
                labels,
                datasets: [
                    {
                        label: "일별 총 펀딩액",
                        data: amounts,
                        fill: false,
                        borderColor: "rgba(75, 192, 192, 1)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        tension: 0.3,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    },
                ],
            });
        } catch (err) {
            console.error("일별 펀딩 요약 불러오기 실패:", err);
        }
    };

    if (!chartData) return <p>📊 데이터를 불러오는 중입니다...</p>;

    return (
        <div className="bg-white shadow rounded-lg p-4 mt-6">
            <h2 className="text-xl font-bold mb-4">📈 일별 총 펀딩 금액</h2>
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top",
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) =>
                                    `₩${context.parsed.y.toLocaleString("ko-KR")}`,
                            },
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) =>
                                    `₩${Number(value).toLocaleString("ko-KR")}`,
                            },
                        },
                    },
                }}
            />
        </div>
    );
}
