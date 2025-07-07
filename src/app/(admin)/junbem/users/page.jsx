// page.jsx
"use client";

import { useState, useMemo } from "react";
import { Eye, Ban, UserCheck, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import "./users.css";

export default function UsersPage() {
    const mockUsers = [
        {
            id: 1,
            name: "김철수",
            email: "kim.chulsoo@example.com",
            status: "LOGIN",
            role: "창작자",
            joinDate: "2024-01-15",
            lastLogin: "2024-01-20 14:30",
            projectsCount: 3,
            totalFunding: 150000,
        },
        {
            id: 2,
            name: "이영희",
            email: "lee.younghee@example.com",
            status: "LOGOUT",
            role: "후원자",
            joinDate: "2024-01-14",
            lastLogin: "2024-01-19 09:15",
            projectsCount: 0,
            totalFunding: 0,
        },
        {
            id: 3,
            name: "박민수",
            email: "park.minsu@example.com",
            status: "LOGIN",
            role: "창작자",
            joinDate: "2024-01-13",
            lastLogin: "2024-01-20 16:45",
            projectsCount: 1,
            totalFunding: 75000,
        },
        {
            id: 4,
            name: "정수진",
            email: "jung.sujin@example.com",
            status: "BANNED",
            role: "창작자",
            joinDate: "2024-01-12",
            lastLogin: "2024-01-18 11:20",
            projectsCount: 2,
            totalFunding: 0,
        },
        {
            id: 5,
            name: "최동현",
            email: "choi.donghyun@example.com",
            status: "LOGIN",
            role: "후원자",
            joinDate: "2024-01-11",
            lastLogin: "2024-01-20 13:10",
            projectsCount: 0,
            totalFunding: 0,
        },
        {
            id: 6,
            name: "강미영",
            email: "kang.miyoung@example.com",
            status: "LOGOUT",
            role: "창작자",
            joinDate: "2024-01-10",
            lastLogin: "2024-01-19 17:30",
            projectsCount: 4,
            totalFunding: 200000,
        },
        {
            id: 7,
            name: "윤성호",
            email: "yoon.sungho@example.com",
            status: "LOGIN",
            role: "후원자",
            joinDate: "2024-01-09",
            lastLogin: "2024-01-20 10:45",
            projectsCount: 0,
            totalFunding: 0,
        },
        {
            id: 8,
            name: "임지현",
            email: "lim.jihyun@example.com",
            status: "LOGOUT",
            role: "창작자",
            joinDate: "2024-01-08",
            lastLogin: "2024-01-18 15:20",
            projectsCount: 1,
            totalFunding: 50000,
        },
        {
            id: 9,
            name: "한상우",
            email: "han.sangwoo@example.com",
            status: "LOGIN",
            role: "후원자",
            joinDate: "2024-01-07",
            lastLogin: "2024-01-20 12:00",
            projectsCount: 0,
            totalFunding: 0,
        },
        {
            id: 10,
            name: "송미라",
            email: "song.mira@example.com",
            status: "BANNED",
            role: "창작자",
            joinDate: "2024-01-06",
            lastLogin: "2024-01-17 14:15",
            projectsCount: 1,
            totalFunding: 0,
        },
        {
            id: 11,
            name: "오준석",
            email: "oh.junseok@example.com",
            status: "LOGIN",
            role: "창작자",
            joinDate: "2024-01-05",
            lastLogin: "2024-01-20 11:30",
            projectsCount: 2,
            totalFunding: 120000,
        },
        {
            id: 12,
            name: "배현정",
            email: "bae.hyunjeong@example.com",
            status: "LOGOUT",
            role: "후원자",
            joinDate: "2024-01-04",
            lastLogin: "2024-01-19 08:45",
            projectsCount: 0,
            totalFunding: 0,
        },
    ];

    const [users, setUsers] = useState(mockUsers);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState({ userId: null, type: null });

    const usersPerPage = 10;
    const filteredUsers = useMemo(() => {
        return users
            .filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name, "ko"));
    }, [users, searchTerm]);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const currentUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    const handleUserStatusChange = (id, status) => {
        setUsers(users.map((u) => (u.id === id ? { ...u, status } : u)));
    };

    const getStatusBadge = (status) => {
        const badgeClass =
            status === "LOGIN"
                ? "badge online"
                : status === "LOGOUT"
                    ? "badge offline"
                    : "badge banned";
        const text = status === "LOGIN" ? "온라인" : status === "LOGOUT" ? "오프라인" : "차단됨";
        return <span className={badgeClass}>{text}</span>;
    };

    const { onlineCount, offlineCount, bannedCount, creatorCount } = useMemo(() => {
        const online = users.filter((u) => u.status === "LOGIN").length;
        const offline = users.filter((u) => u.status === "LOGOUT").length;
        const banned = users.filter((u) => u.status === "BANNED").length;
        const creators = users.filter((u) => u.role === "창작자").length;
        return { onlineCount: online, offlineCount: offline, bannedCount: banned, creatorCount: creators };
    }, [users]);

    return (
        <main className="users-main">
            <div className="users-header">
                <div>
                    <h1 className="text-2xl font-bold">사용자 관리</h1>
                    <p className="text-sm text-gray-500">등록된 사용자들을 관리하고 모니터링하세요</p>
                </div>
                <input
                    type="text"
                    placeholder="이름 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="user-summary-cards">
                <div className="user-summary-card">
                    <p className="count text-green-600">{onlineCount}</p>
                    <p className="label">온라인 사용자</p>
                </div>
                <div className="user-summary-card">
                    <p className="count text-gray-600">{offlineCount}</p>
                    <p className="label">오프라인 사용자</p>
                </div>
                <div className="user-summary-card">
                    <p className="count text-red-600">{bannedCount}</p>
                    <p className="label">차단된 사용자</p>
                </div>
                <div className="user-summary-card">
                    <p className="count text-indigo-600">{creatorCount}</p>
                    <p className="label">창작자</p>
                </div>
            </div>

            <table className="users-table">
                <thead>
                <tr>
                    <th>사용자</th>
                    <th>이메일</th>
                    <th>역할</th>
                    <th>상태</th>
                    <th>가입일</th>
                    <th>마지막 로그인</th>
                    <th>작업</th>
                </tr>
                </thead>
                <tbody>
                {currentUsers.map((user) => (
                    <tr key={user.id}>
                        <td>
                            {user.name}
                        </td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{getStatusBadge(user.status)}</td>
                        <td className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {user.joinDate}
                        </td>
                        <td className="text-sm text-gray-500">{user.lastLogin}</td>
                        <td>
                            <div className="flex gap-2">
                                <button
                                    className="btn-icon btn-eye"
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <Eye className="h-4 w-4" />
                                </button>

                                {user.status !== "BANNED" ? (
                                    <button
                                        className=" btn-ban"
                                        onClick={() => setConfirmAction({ userId: user.id, type: "ban" })}
                                    >
                                        <Ban className="h-4 w-4" />
                                    </button>
                                ) : (
                                    <button
                                        className=" btn-unban"
                                        onClick={() => setConfirmAction({ userId: user.id, type: "unban" })}
                                    >
                                        <UserCheck className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

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

            {isModalOpen && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="text-xl font-bold mb-2">{selectedUser.name} 상세 정보</h2>
                        <p className="text-sm mb-1"><strong>이메일:</strong> {selectedUser.email}</p>
                        <p className="text-sm mb-1"><strong>역할:</strong> {selectedUser.role}</p>
                        <p className="text-sm mb-1"><strong>상태:</strong> {getStatusBadge(selectedUser.status)}</p>
                        <p className="text-sm mb-1"><strong>프로젝트 수:</strong> {selectedUser.projectsCount}</p>
                        <p className="text-sm mb-1"><strong>마지막 로그인:</strong> {selectedUser.lastLogin}</p>
                        <button className="btn-close mt-4" onClick={() => setIsModalOpen(false)}>닫기</button>
                    </div>
                </div>
            )}

            {confirmAction.userId && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="text-lg font-bold mb-2">
                            {confirmAction.type === "ban" ? "사용자 차단" : "차단 해제"}
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            {confirmAction.type === "ban"
                                ? `정말로 이 사용자를 차단하시겠습니까?`
                                : `정말로 차단을 해제하시겠습니까?`}
                        </p>
                        <div className="flex justify-end gap-2">
                            <button className="btn-close" onClick={() => setConfirmAction({ userId: null, type: null })}>취소</button>
                            <button
                                onClick={() => {
                                    const actionUser = users.find(u => u.id === confirmAction.userId);
                                    handleUserStatusChange(confirmAction.userId, confirmAction.type === "ban" ? "BANNED" : "LOGOUT");
                                    setConfirmAction({ userId: null, type: null });
                                }}
                                className={`px-4 py-2 rounded text-white ${confirmAction.type === "ban" ? "bg-red-600 hover:bg-red-700 cursor-pointer" : "bg-green-600 hover:bg-green-700 cursor-pointer"}`}
                            >
                                {confirmAction.type === "ban" ? "차단하기" : "해제하기"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
