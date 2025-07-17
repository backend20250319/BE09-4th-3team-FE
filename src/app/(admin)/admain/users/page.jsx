"use client";

import { useState, useEffect } from "react";
import { Eye, Ban, UserCheck, Calendar, X } from "lucide-react";
import "./users.css";
import Pagination from "@/components/pagination/pagination";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState({ userId: null, type: null });

    const fetchUsers = async () => {
        try {
            const token = sessionStorage.getItem("accessToken");

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users?page=${currentPage}&search=${searchTerm}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("서버 요청 실패");
            const data = await res.json();

            const formatted = data.content.map((user) => ({
                id: user.userNo,
                name: user.nickname,
                email: user.email,
                status: user.userStatus,
                role: user.roleType === "USER" ? "후원자" : user.roleType,
                joinDate: formatDate(user.createdAt),
                lastLogin: formatDate(user.updatedAt),
                projectsCount: 0,
                totalFunding: 0,
            }));

            setUsers(formatted);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error("유저 로딩 실패:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(
            date.getDate()
        ).padStart(2, "0")}일 ${String(date.getHours()).padStart(2, "0")}시 ${String(
            date.getMinutes()
        ).padStart(2, "0")}분`;
    };

    const handleUserStatusChange = async (id, status) => {
        try {
            const token = sessionStorage.getItem("accessToken");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userNo: id, userStatus: status === "BANNED" ? "BAN" : "LOGOUT" }),
            });

            if (!res.ok) throw new Error("서버 요청 실패");
            await fetchUsers();
        } catch (error) {
            console.error("상태 변경 실패:", error);
            alert("상태 변경 중 오류가 발생했습니다.");
        }
    };

    const getStatusBadge = (status) => {
        const badgeClass =
            status === "LOGIN" ? "badge online" : status === "LOGOUT" ? "badge offline" : "badge banned";
        const text = status === "LOGIN" ? "온라인" : status === "LOGOUT" ? "오프라인" : "차단됨";
        return <span className={badgeClass}>{text}</span>;
    };

    const { onlineCount, offlineCount, bannedCount, creatorCount } = users.reduce(
        (acc, u) => {
            if (u.status === "LOGIN") acc.onlineCount++;
            else if (u.status === "LOGOUT") acc.offlineCount++;
            else if (u.status === "BANNED") acc.bannedCount++;
            if (u.role === "창작자") acc.creatorCount++;
            return acc;
        },
        { onlineCount: 0, offlineCount: 0, bannedCount: 0, creatorCount: 0 }
    );

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
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(0);
                    }}
                />
            </div>

            <div className="user-summary-cards">
                <div className="user-summary-card"><p className="count text-green-600">{onlineCount}</p><p className="label">온라인 사용자</p></div>
                <div className="user-summary-card"><p className="count text-gray-600">{offlineCount}</p><p className="label">오프라인 사용자</p></div>
                <div className="user-summary-card"><p className="count text-red-600">{bannedCount}</p><p className="label">차단된 사용자</p></div>
                <div className="user-summary-card"><p className="count text-indigo-600">{creatorCount}</p><p className="label">창작자</p></div>
            </div>

            <table className="users-table">
                <thead>
                <tr><th>사용자</th><th>이메일</th><th>상태</th><th>가입일</th><th>마지막 로그인</th><th>작업</th></tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{getStatusBadge(user.status)}</td>
                        <td className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />{user.joinDate}
                        </td>
                        <td className="text-sm text-gray-500">{user.lastLogin}</td>
                        <td>
                            <div className="flex gap-2">
                                <button className="btn-icon btn-eye" onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}><Eye className="h-4 w-4" /></button>
                                {user.status !== "BANNED" ? (
                                    <button className="btn-ban" onClick={() => setConfirmAction({ userId: user.id, type: "ban" })}><Ban className="h-4 w-4" /></button>
                                ) : (
                                    <button className="btn-unban" onClick={() => setConfirmAction({ userId: user.id, type: "unban" })}><UserCheck className="h-4 w-4" /></button>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {isModalOpen && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-content relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer"><X className="w-5 h-5" /></button>
                        <h2 className="text-xl font-bold mb-2">{selectedUser.name} 상세 정보</h2>
                        <p className="text-sm mb-1"><strong>이메일:</strong> {selectedUser.email}</p>
                        <p className="text-sm mb-1"><strong>상태:</strong> {getStatusBadge(selectedUser.status)}</p>
                        <p className="text-sm mb-1"><strong>프로젝트 수:</strong> {selectedUser.projectsCount}</p>
                        <p className="text-sm mb-1"><strong>마지막 로그인:</strong> {selectedUser.lastLogin}</p>
                    </div>
                </div>
            )}

            {confirmAction.userId && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="text-lg font-bold mb-2">{confirmAction.type === "ban" ? "사용자 차단" : "차단 해제"}</h2>
                        <p className="text-sm text-gray-600 mb-4">{confirmAction.type === "ban" ? `정말로 이 사용자를 차단하시겠습니까?` : `정말로 차단을 해제하시겠습니까?`}</p>
                        <div className="flex justify-end gap-2">
                            <button className="btn-close" onClick={() => setConfirmAction({ userId: null, type: null })}>취소</button>
                            <button
                                onClick={() => {
                                    handleUserStatusChange(confirmAction.userId, confirmAction.type === "ban" ? "BANNED" : "LOGOUT");
                                    setConfirmAction({ userId: null, type: null });
                                }}
                                className={`px-4 py-2 rounded text-white ${confirmAction.type === "ban" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
                            >{confirmAction.type === "ban" ? "차단하기" : "해제하기"}</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}