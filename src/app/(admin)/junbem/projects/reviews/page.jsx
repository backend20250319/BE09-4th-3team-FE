"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Check, X } from "lucide-react";
import "./reviews.css";

export default function ProjectReviewPage() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // ✅ 프로젝트 상태 변경 함수
    const handleStatusChange = async (projectId, status) => {
        const statusCode = status === "approved" ? "APPROVED" : "REJECTED";

        try {
            const token = localStorage.getItem("accessToken"); // ✅ 선언 추가

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/projects?status=WAITING_APPROVAL`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("상태 변경 실패");

            // 🔄 성공 시 목록에서 제거
            setProjects((prev) => prev.filter((p) => p.id !== projectId));
        } catch (error) {
            console.error("상태 변경 오류:", error);
            alert("프로젝트 상태 변경에 실패했습니다.");
        }
    };

    // 🔽 API에서 승인 대기(WAITING_APPROVAL) 상태 프로젝트 불러오기
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = sessionStorage.getItem("accessToken"); // ✅ 선언 추가

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/projects?status=WAITING_APPROVAL`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("서버 응답 오류");

                const data = await res.json();

                const waitingProjects = data.content
                    .filter((item) => item.productStatus === "WAITING_APPROVAL")
                    .map((item) => ({
                        id: item.projectNo,
                        name: item.title,
                        creator: item.userId,
                        category: item.categoryName,
                        goal: item.goalAmount.toLocaleString("ko-KR", {
                            style: "currency",
                            currency: "KRW",
                        }),
                        date: new Date(item.createdAt).toLocaleDateString("ko-KR"),
                        description: item.description.replace(/<[^>]+>/g, ""), // HTML 제거
                    }));

                setProjects(waitingProjects);
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            }
        };

        fetchProjects();
    }, []);


    const openModal = (project) => {
        setSelectedProject(project);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedProject(null);
        setShowModal(false);
    };

    return (
        <main className="review-main">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold">프로젝트 승인</h1>
                    <p className="text-gray-500 mt-1">보류 중인 프로젝트 제출을 검토하고 승인합니다.</p>
                </div>
                <span className="text-sm bg-gray-200 rounded-full px-3 py-1">
                    {projects.length} Pending Review
                </span>
            </div>

            <div className="mb-4">
                <Link href="/junbem/projects" className="btn-back">
                    ← Back to Overview
                </Link>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h2 className="text-xl font-semibold mb-2">승인 대기 중인 펀딩 프로젝트</h2>
                <p className="text-gray-500 mb-4">창작자의 프로젝트 제출물을 검토하고 승인합니다.</p>
                <div className="overflow-x-auto">
                    <table className="review-table w-full text-left text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th>프로젝트</th>
                            <th>창작자</th>
                            <th>카테고리</th>
                            <th>목표 펀딩 금액</th>
                            <th>상태값</th>
                            <th>등록된 날짜</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {projects.map((item) => (
                            <tr key={item.id} className="border-b">
                                <td>
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-gray-500">Project description...</div>
                                </td>
                                <td>{item.creator}</td>
                                <td><span className="badge">{item.category}</span></td>
                                <td>{item.goal}</td>
                                <td><span className="status-pending">Pending</span></td>
                                <td>{item.date}</td>
                                <td>
                                    <div className="flex gap-2">
                                        <button className="btn-icon cursor-pointer" onClick={() => openModal(item)} >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            className="btn-approve cursor-pointer"
                                            onClick={() => handleStatusChange(item.id, "approved")}
                                        >
                                            <Check className="h-4 w-4" />
                                        </button>
                                        <button
                                            className="btn-reject cursor-pointer"
                                            onClick={() => handleStatusChange(item.id, "rejected")}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {projects.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-gray-500">
                                    모든 프로젝트가 검토되었습니다.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 🔹 모달 */}
            {showModal && selectedProject && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="text-xl font-semibold mb-2">{selectedProject.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">by {selectedProject.creator}</p>
                        <p className="text-sm mb-2"><strong>카테고리:</strong> {selectedProject.category}</p>
                        <p className="text-sm mb-2"><strong>목표 금액:</strong> {selectedProject.goal}</p>
                        <p className="text-sm mb-2"><strong>신청 날짜:</strong> {selectedProject.date}</p>
                        <p className="text-sm mb-4"><strong>설명:</strong> {selectedProject.description}</p>
                        <button onClick={closeModal} className="btn-close cursor-pointer">닫기</button>
                    </div>
                </div>
            )}
        </main>
    );
}
