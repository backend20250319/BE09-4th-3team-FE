"use client"

import { useState, useEffect } from "react"
import "./review.css"
import Pagination from "@/components/pagination/pagination"

export default function ReviewsPage() {
    const [reviews, setReviews] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [totalElements, setTotalElements] = useState(0)

    const reviewsPerPage = 10

    const fetchReviews = async (page = 0) => {
        try {
            const token = sessionStorage.getItem("accessToken")

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/reviews?page=${page}&size=${reviewsPerPage}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!res.ok) throw new Error("리뷰 로딩 실패")
            const data = await res.json()

            setReviews(data.content || [])
            setTotalPages(data.totalPages || 1)
            setTotalElements(data.totalElements || 0)
        } catch (error) {
            console.error("리뷰 불러오기 실패:", error)
        }
    }

    useEffect(() => {
        fetchReviews(currentPage)
    }, [currentPage])

    const getAverage = (r) =>
        ((r.rewardStatus + r.planStatus + r.commStatus) / 3).toFixed(1)

    const renderStars = (rating) =>
        Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`star ${i < rating ? "filled" : ""}`}>★</span>
        ))

    return (
        <main className="review-page">
            <h1 className="text-2xl font-bold mb-2">리뷰 관리</h1>

            <div className="review-stats">
                <div>총 리뷰: {totalElements}</div>
                <div>
                    전체 평균: {
                    reviews.length > 0
                        ? (reviews.reduce((acc, r) => acc + Number(getAverage(r)), 0) / reviews.length).toFixed(1)
                        : "0.0"
                }
                </div>
            </div>

            <table className="review-table">
                <thead>
                <tr>
                    <th>프로젝트</th>
                    <th>작성자</th>
                    <th>평균</th>
                    <th>내용</th>
                    <th>작성일</th>
                </tr>
                </thead>
                <tbody>
                {reviews.map((r) => (
                    <tr key={r.reviewNo}>
                        <td>{r.projectTitle}</td>
                        <td>{r.userNickname}</td>
                        <td>
                            <div className="stars">{renderStars(Math.round(getAverage(r)))}</div>
                            <span>{getAverage(r)}</span>
                        </td>
                        <td className="truncate">{r.content}</td>
                        <td>{new Date(r.createdAt).toLocaleDateString("ko-KR")}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </main>
    )
}
