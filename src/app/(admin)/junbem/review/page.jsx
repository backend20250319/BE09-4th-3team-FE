"use client"

import {useState, useMemo, useEffect} from "react"
import "./review.css"
import {ChevronLeft, ChevronRight} from "lucide-react";

export default function ReviewsPage() {
    const [reviews, setReviews] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const reviewsPerPage = 10

    const fetchReviews = async (page) => {
        try {
            const res = await fetch(`http://localhost:8888/admin/reviews?page=${page - 1}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc1MTM2MjcyMiwiZXhwIjoxNzUyNTcyMzIyfQ.5rCSiaJ6SvPhDnqAXQPQeal-UvvbhYt8b5oSmG3YikI',
                },
            })

            if (!res.ok) throw new Error("리뷰 로딩 실패")
            const data = await res.json()
            setReviews(data.content || []) // 페이지네이션 구조일 경우 .content 사용
        } catch (error) {
            console.error("리뷰 불러오기 실패:", error)
        }
    }

    useEffect(() => {
        fetchReviews(currentPage)
    }, [currentPage])

    const filteredReviews = useMemo(() => {
        return reviews
            .filter(
                (r) =>
                    r.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    r.userNickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    r.content.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }, [searchTerm, reviews])

    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage)
    const indexOfLast = currentPage * reviewsPerPage
    const indexOfFirst = indexOfLast - reviewsPerPage

    const getAverage = (r) => ((r.rewardStatus + r.planStatus + r.commStatus) / 3).toFixed(1)
    const renderStars = (rating) =>
        Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`star ${i < rating ? "filled" : ""}`}>★</span>
        ))

    return (
        <main className="review-page">
            <h1 className="text-2xl font-bold mb-2">리뷰 관리</h1>
            <input
                className="search-input"
                placeholder="프로젝트명, 사용자명, 리뷰 내용으로 검색"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                }}
            />

            <div className="review-stats">
                <div>총 리뷰: {filteredReviews.length}</div>
                <div>전체 평균: {
                    filteredReviews.length > 0
                        ? (filteredReviews.reduce((acc, r) => acc + Number(getAverage(r)), 0) / filteredReviews.length).toFixed(1)
                        : "0.0"
                }</div>
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
                {filteredReviews.map((r) => (
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

            <div className="pagination">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <ChevronLeft className="inline w-4 h-4"/> 이전
                </button>
                <span>{currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    다음 <ChevronRight className="inline w-4 h-4"/>
                </button>
            </div>
        </main>
    )
}