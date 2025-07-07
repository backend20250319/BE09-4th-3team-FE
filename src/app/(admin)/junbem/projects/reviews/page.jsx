"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Check, X } from "lucide-react";
import "./reviews.css";

export default function ProjectReviewPage() {
    const initialProjects = [
        {
            id: 1,
            name: "AI-Powered Learning Platform",
            creator: "Sarah Johnson",
            category: "Education",
            goal: "$50,000",
            date: "Jan 15, 2024",
            description: "An innovative platform that uses AI to personalize learning.",
        },
        {
            id: 2,
            name: "Sustainable Energy Monitor",
            creator: "Michael Chen",
            category: "Technology",
            goal: "$75,000",
            date: "Jan 14, 2024",
            description: "IoT device that helps households track and optimize energy usage.",
        },
        {
            id: 3,
            name: "Mental Health Companion App",
            creator: "Dr. James Wilson",
            category: "Healthcare",
            goal: "$100,000",
            date: "Jan 12, 2024",
            description: "24/7 mental health support via AI-driven mobile app.",
        },
    ];

    const [projects, setProjects] = useState(initialProjects);
    const [selectedProject, setSelectedProject] = useState(null); // 🔹 모달용 상태
    const [showModal, setShowModal] = useState(false);

    const handleStatusChange = (projectId, status) => {
        setProjects((prev) => prev.filter((project) => project.id !== projectId));
        console.log(`Project ${projectId} marked as ${status}`);
    };

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
                    <p className="text-gray-500 mt-1">Review and approve pending project submissions</p>
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
                <h2 className="text-xl font-semibold mb-2">Pending Project Submissions</h2>
                <p className="text-gray-500 mb-4">Review and approve project submissions from creators</p>
                <div className="overflow-x-auto">
                    <table className="review-table w-full text-left text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th>Project</th>
                            <th>Creator</th>
                            <th>Category</th>
                            <th>Funding Goal</th>
                            <th>Status</th>
                            <th>Date Submitted</th>
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
                        <p className="text-sm mb-2"><strong>Category:</strong> {selectedProject.category}</p>
                        <p className="text-sm mb-2"><strong>Funding Goal:</strong> {selectedProject.goal}</p>
                        <p className="text-sm mb-2"><strong>Submitted:</strong> {selectedProject.date}</p>
                        <p className="text-sm mb-4"><strong>Description:</strong> {selectedProject.description}</p>
                        <button onClick={closeModal} className="btn-close cursor-pointer">닫기</button>
                    </div>
                </div>
            )}
        </main>
    );
}
