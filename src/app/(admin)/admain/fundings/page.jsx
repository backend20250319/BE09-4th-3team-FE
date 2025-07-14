"use client";

import { useEffect, useState } from "react";
import { Eye, X, Search } from "lucide-react";
import Pagination from "@/components/pagination/pagination";

export default function FundingPage() {
    const [fundings, setFundings] = useState([]);
    const [selectedFunding, setSelectedFunding] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchFundings(page, searchTerm);
    }, [page, searchTerm]);

    const fetchFundings = async (page, keyword) => {
        try {
            const token = sessionStorage.getItem("accessToken");
            const query = keyword ? `&keyword=${encodeURIComponent(keyword)}` : "";

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/pledge-rewards?page=${page}${query}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            setFundings(data.content || []);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error("펀딩 정보 불러오기 실패:", err);
        }
    };

    const totalFundingAmount = fundings.reduce((sum, f) => sum + f.rewardAmount * f.quantity, 0);

    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white shadow rounded-lg p-4">
                    <div className="text-2xl font-bold">{fundings.length}</div>
                    <div className="text-sm text-gray-500">현재 페이지 펀딩 수</div>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <div className="text-2xl font-bold">
                        {totalFundingAmount.toLocaleString("ko-KR", {
                            style: "currency",
                            currency: "KRW",
                        })}
                    </div>
                    <div className="text-sm text-gray-500">현재 페이지 총 금액</div>
                </div>
                <div className="col-span-2">
                    <input
                        className="w-full border p-2 rounded shadow-sm"
                        placeholder="후원자, 프로젝트명으로 검색"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(0);
                        }}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 text-left">
                    <tr>
                        <th className="px-4 py-3">후원자</th>
                        <th className="px-4 py-3">프로젝트</th>
                        <th className="px-4 py-3">리워드</th>
                        <th className="px-4 py-3">수량</th>
                        <th className="px-4 py-3">금액</th>
                        <th className="px-4 py-3">작업</th>
                    </tr>
                    </thead>
                    <tbody>
                    {fundings.map((f) => (
                        <tr key={f.pledgeRewardNo} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <div className="font-medium">{f.userName}</div>
                                <div className="text-xs text-gray-400">{f.userEmail}</div>
                            </td>
                            <td className="px-4 py-3">{f.projectTitle}</td>
                            <td className="px-4 py-3">{f.rewardTitle}</td>
                            <td className="px-4 py-3">{f.quantity}</td>
                            <td className="px-4 py-3">
                                ₩{(f.rewardAmount * f.quantity).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-center">
                                <button
                                    onClick={() => setSelectedFunding(f)}
                                    className="border px-2 py-1 rounded text-gray-600 hover:bg-gray-100"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {selectedFunding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setSelectedFunding(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-1">후원 상세 정보</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                                <div className="font-semibold">후원자</div>
                                <div>{selectedFunding.userName}</div>
                                <div className="text-xs text-gray-400">{selectedFunding.userEmail}</div>
                            </div>
                            <div>
                                <div className="font-semibold">프로젝트</div>
                                <div>{selectedFunding.projectTitle}</div>
                            </div>
                            <div>
                                <div className="font-semibold">리워드</div>
                                <div>{selectedFunding.rewardTitle}</div>
                            </div>
                            <div>
                                <div className="font-semibold">수량</div>
                                <div>{selectedFunding.quantity}</div>
                            </div>
                            <div>
                                <div className="font-semibold">총 금액</div>
                                <div className="text-green-600 font-bold">
                                    ₩{(selectedFunding.rewardAmount * selectedFunding.quantity).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}
