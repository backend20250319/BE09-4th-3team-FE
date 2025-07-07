"use client";
import { useState } from "react";
import Link from "next/link";
import "./projects.css";
import { Eye, ChevronLeft, ChevronRight, ExternalLink, Calendar } from "lucide-react";

export default function ProjectsPage() {
    const allProjects = [
        {
            name: "AI-Powered Learning Platform",
            description: "An innovative platform that uses artificial intelligence to personalize learning experiences.",
            creator: "Sarah Johnson",
            category: "Education",
            goal: "$50,000",
            status: "rejected",
            date: "Jan 15, 2024",
        },
        {
            name: "AI-Powered Learning Platform",
            description: "An innovative platform that uses artificial intelligence to personalize learning experiences.",
            creator: "Sarah Johnson",
            category: "Education",
            goal: "$50,000",
            status: "approved",
            date: "Jan 15, 2024",
        },
        {
            name: "AI-Powered Learning Platform",
            description: "An innovative platform that uses artificial intelligence to personalize learning experiences.",
            creator: "Sarah Johnson",
            category: "Education",
            goal: "$50,000",
            status: "pending",
            date: "Jan 15, 2024",
        },
        {
            name: "AI-Powered Learning Platform",
            description: "An innovative platform that uses artificial intelligence to personalize learning experiences.",
            creator: "Sarah Johnson",
            category: "Education",
            goal: "$50,000",
            status: "pending",
            date: "Jan 15, 2024",
        },
        {
            name: "AI-Powered Learning Platform",
            description: "An innovative platform that uses artificial intelligence to personalize learning experiences.",
            creator: "Sarah Johnson",
            category: "Education",
            goal: "$50,000",
            status: "pending",
            date: "Jan 15, 2024",
        },
        {
            name: "AI-Powered Learning Platform",
            description: "An innovative platform that uses artificial intelligence to personalize learning experiences.",
            creator: "Sarah Johnson",
            category: "Education",
            goal: "$50,000",
            status: "pending",
            date: "Jan 15, 2024",
        },
        {
            name: "AI-Powered Learning Platform",
            description: "An innovative platform that uses artificial intelligence to personalize learning experiences.",
            creator: "Sarah Johnson",
            category: "Education",
            goal: "$50,000",
            status: "pending",
            date: "Jan 15, 2024",
        },
        {
            name: "AI-Powered Learning Platform",
            description: "An innovative platform that uses artificial intelligence to personalize learning experiences.",
            creator: "Sarah Johnson",
            category: "Education",
            goal: "$50,000",
            status: "pending",
            date: "Jan 15, 2024",
        },
        {
            name: "AI-Powered Learning Platform",
            description: "An innovative platform that uses artificial intelligence to personalize learning experiences.",
            creator: "Sarah Johnson",
            category: "Education",
            goal: "$50,000",
            status: "pending",
            date: "Jan 15, 2024",
        },
        {
            name: "AI-Powered Learning Platform",
            description: "An innovative platform that uses artificial intelligence to personalize learning experiences.",
            creator: "Sarah Johnson",
            category: "Education",
            goal: "$50,000",
            status: "pending",
            date: "Jan 15, 2024",
        },
        {
            name: "AI-Powered Learning Platform",
            description: "An innovative platform that uses artificial intelligence to personalize learning experiences.",
            creator: "Sarah Johnson",
            category: "Education",
            goal: "$50,000",
            status: "approved",
            date: "Jan 15, 2024",
        },
        {
            name: "AI-Powered Learning Platform",
            description: "An innovative platform that uses artificial intelligence to personalize learning experiences.",
            creator: "Sarah Johnson",
            category: "Education",
            goal: "$50,000",
            status: "pending",
            date: "Jan 15, 2024",
        },
        {
            name: "AI-Powered Learning Platform",
            description: "An innovative platform that uses artificial intelligence to personalize learning experiences.",
            creator: "Sarah Johnson",
            category: "Education",
            goal: "$50,000",
            status: "pending",
            date: "Jan 15, 2024",
        },
        {
            name: "AI-Powered Learning Platform",
            description: "An innovative platform that uses artificial intelligence to personalize learning experiences.",
            creator: "Sarah Johnson",
            category: "Education",
            goal: "$50,000",
            status: "pending",
            date: "Jan 15, 2024",
        },
        // 필요 시 더 추가
    ];

    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedProject, setSelectedProject] = useState(null); // 🔹 선택된 프로젝트
    const [showModal, setShowModal] = useState(false); // 🔹 모달 상태

    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 10;

    const filteredProjects =
        statusFilter === "all"
            ? allProjects
            : allProjects.filter((project) => project.status.toLowerCase() === statusFilter);

    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    const currentProjects = filteredProjects.slice(
        (currentPage - 1) * projectsPerPage,
        currentPage * projectsPerPage
    );


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
                    <Link href="/junbem/projects/reviews" className="projects-review-btn">
                        프로젝트 승인 <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>

            {/* 통계 카드 */}
            <div className="projects-cards">
                <div className="projects-card">
                    <p className="projects-card-number">{allProjects.length}</p>
                    <p>전체 프로젝트</p>
                </div>
                <div className="projects-card">
                    <p className="projects-card-number text-yellow-500">
                        {allProjects.filter((p) => p.status === "pending").length}
                    </p>
                    <p>대기중인 프로젝트</p>
                </div>
                <div className="projects-card">
                    <p className="projects-card-number text-green-600">
                        {allProjects.filter((p) => p.status === "approved").length}
                    </p>
                    <p>승인된 프로젝트</p>
                </div>
                <div className="projects-card">
                    <p className="projects-card-number text-red-500">
                        {allProjects.filter((p) => p.status === "rejected").length}
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
                                        <Link href="/junbem/projects/reviews" className="action-button cursor-pointer">
                                            승인하기
                                        </Link>
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
                    className="px-2 py-1 border rounded disabled:opacity-50"
                >
                    <ChevronLeft className="inline w-4 h-4" /> 이전
                </button>
                <span className="text-sm">{currentPage} / {totalPages}</span>
                <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 border rounded disabled:opacity-50"
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
