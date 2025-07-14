"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./projects.css";
import { Eye, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

export default function ProjectsPage() {
    const [allProjects, setAllProjects] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedProject, setSelectedProject] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [totalCount, setTotalCount] = useState(0); // 전체 프로젝트 수
    const [statusCounts, setStatusCounts] = useState({
        pending: 0,
        approved: 0,
        rejected: 0,
    });
    const projectsPerPage = 10;

    useEffect(() => {
        fetchProjects();
    }, [currentPage]);

useEffect(() => {
    fetchProjectCounts(); // 최초 마운트 시 1회 실행
}, []);

    const fetchProjects = async () => {
        try {
            const token = sessionStorage.getItem("accessToken");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/projects?page=${currentPage - 1}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("서버 응답 오류");

            const data = await res.json(); // ✅ data 선언

            const mappedProjects = data.content.map((item) => ({
                name: item.title,
                description: item.description.replace(/<[^>]+>/g, ""),
                creator: item.userId,
                category: item.categoryName,
                goal: item.goalAmount.toLocaleString("ko-KR", {
                    style: "currency",
                    currency: "KRW",
                }),
                status: convertStatus(item.productStatus),
                date: new Date(item.createdAt).toLocaleDateString("ko-KR"),
                thumbnail: item.thumbnailUrl,
            }));

            setAllProjects(mappedProjects);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error("데이터 로딩 오류:", err);
        }
    };

// ✅ 새로운 통계용 API 호출 함수
    const fetchProjectCounts = async () => {
        try {
            const token = sessionStorage.getItem("accessToken"); // ✅ 선언 추가

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/projects/count`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("통계 데이터 요청 실패");
            const data = await res.json();

            setTotalCount(data.total);
            setStatusCounts({
                pending: data.pending,
                approved: data.approved,
                rejected: data.rejected,
            });
        } catch (err) {
            console.error("통계 데이터 로딩 오류:", err);
        }
    };


    const convertStatus = (statusCode) => {
        switch (statusCode) {
            case "WAITING_APPROVAL":
                return "PENDING";
            case "APPROVED":
                return "APPROVED";
            case "REJECTED":
                return "REJECTED";
            case "IN_PROGRESS" :
                return "IN_PROGRESS";
            case "COMPLETED" :
                return "COMPLETED"
            case "FAILED" :
                return "FAILED"
            default:
                return "unknown";
        }
    };

    const filteredProjects =
        statusFilter === "all"
            ? allProjects
            : allProjects.filter((project) => project.status.toLowerCase() === statusFilter);

    const currentProjects = filteredProjects;

    const openModal = (project) => {
        setSelectedProject(project);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProject(null);
    };

    return (
        <main className="projects-main">
            {/* 상단 영역 */}
            <div className="projects-header">
                <div>
                    <h1 className="projects-title">프로젝트 관리</h1>
                </div>
                <div className="projects-controls">
                    <select
                        className="projects-select cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1); // 필터 바꿀 때 페이지 초기화
                        }}
                    >
                        <option value="all">All Projects</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <Link href="/src/app/admin/projects/reviews" className="projects-review-btn">
                        프로젝트 승인 <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>

            {/* 통계 카드 */}
            <div className="projects-cards">
                <div className="projects-card">
                    <p className="projects-card-number">{totalCount}</p>
                    <p>전체 프로젝트</p>
                </div>
                <div className="projects-card">
                    <p className="projects-card-number text-yellow-500">
                        {statusCounts.pending}
                    </p>
                    <p>대기중인 프로젝트</p>
                </div>
                <div className="projects-card">
                    <p className="projects-card-number text-green-600">
                        {statusCounts.approved}
                    </p>
                    <p>승인된 프로젝트</p>
                </div>
                <div className="projects-card">
                    <p className="projects-card-number text-red-500">
                        {statusCounts.rejected}
                    </p>
                    <p>거절한 프로젝트</p>
                </div>
            </div>

            {/* 프로젝트 테이블 */}
            <div className="projects-table-wrapper">
                <h2 className="projects-table-title">프로젝트 목록</h2>
                <p className="text-gray-500 mb-4">프로젝트를 한눈에 볼 수 있습니다.</p>
                <div className="overflow-x-auto">
                    <table className="projects-table">
                        <thead>
                        <tr>
                            <th>프로젝트</th>
                            <th>신청자</th>
                            <th>카테고리</th>
                            <th>후원 목표 금액</th>
                            <th>상태</th>
                            <th>신청한 날짜</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentProjects.map((project, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="font-medium">{project.name}</div>
                                    <div className="text-sm text-gray-500">{project.description.slice(0, 40)}...</div>
                                </td>
                                <td>{project.creator}</td>
                                <td><span className="badge">{project.category}</span></td>
                                <td>{project.goal}</td>
                                <td><span className={`status-badge status-${project.status}`}>{project.status}</span></td>
                                <td>{project.date}</td>
                                <td>
                                    <div className="flex gap-2">
                                        <button className="btn-icon cursor-pointer" onClick={() => openModal(project)}>
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        {/*승인하기 버튼*/}
                                        {project.status === "pending" && (
                                            <Link href="/src/app/admin/projects/reviews" className="action-button cursor-pointer">
                                                승인하기
                                            </Link>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 페이징 버튼 */}
            <div className="pagination mt-4 flex justify-center items-center gap-4">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1 border rounded disabled:opacity-50 cursor-pointer"
                >
                    <ChevronLeft className="inline w-4 h-4" /> 이전
                </button>
                <span className="text-sm">{currentPage} / {totalPages}</span>
                <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 border rounded disabled:opacity-50 cursor-pointer"
                >
                    다음 <ChevronRight className="inline w-4 h-4" />
                </button>
            </div>

            {/* 🔹 상세 보기 모달 */}
            {showModal && selectedProject && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="text-xl font-bold mb-2">{selectedProject.name}</h2>
                        <p className="text-sm text-gray-500 mb-2"><strong>신청자:</strong> {selectedProject.creator}</p>
                        <p className="text-sm mb-1"><strong>카테고리:</strong> {selectedProject.category}</p>
                        <p className="text-sm mb-1"><strong>목표 금액:</strong> {selectedProject.goal}</p>
                        <p className="text-sm mb-1"><strong>신청 날짜:</strong> {selectedProject.date}</p>
                        <p className="text-sm mt-4"><strong>설명:</strong><br />{selectedProject.description}</p>
                        <button onClick={closeModal} className="btn-close cursor-pointer mt-4">닫기</button>
                    </div>
                </div>
            )}
        </main>
    );
}
