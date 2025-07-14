"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Package } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"
import { requireAccessTokenOrRedirect } from "@/lib/utils"


export default function MyPledgesPage() {
  const [pledges, setPledges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPledges() {
      setLoading(true)
      setError(null)

      const token = requireAccessTokenOrRedirect()
      if (!token) return

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pledge/my`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        // API 응답이 배열로 직접 반환되는 경우
        if (Array.isArray(response.data)) {
          setPledges(response.data)
        } else {
          setError("후원 내역을 불러올 수 없습니다.")
        }
      } catch (err) {
        console.error("후원 내역 조회 실패:", err)
        if (err.response?.status === 401) {
          setError("로그인이 만료되었습니다.")
        } else {
          setError("후원 내역을 불러오는 중 오류가 발생했습니다.")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchPledges()
  }, [])



  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-8">후원한 프로젝트</h1>

      {/* Summary */}
      <p className="text-gray-600 mb-6">
        <span className="text-red-500 font-medium">{pledges.length}건</span>의 후원 내역이 있습니다.
      </p>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mr-3"></div>
          <span className="text-gray-500">불러오는 중...</span>
        </div>
      )}
      
      {error && (
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* Pledge List */}
      <div className="space-y-4">
        {pledges
          .slice() // 원본 배열 변형 방지
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 최근 순서로 정렬
          .map((pledge) => (
            <Link key={pledge.pledgeNo} href={`/pledges/${pledge.pledgeNo}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <Image
                        src={pledge.project?.thumbnailUrl || "/placeholder.svg"}
                        alt={pledge.project?.title || "프로젝트 이미지"}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-xs text-gray-500">
                          후원일 {pledge.createdAt ? new Date(pledge.createdAt).toLocaleDateString('ko-KR') : "-"} | 후원번호 {pledge.pledgeNo}
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-1">{pledge.project?.title || "제목 없음"}</h3>
                      <div className="text-sm text-gray-600 mb-2">
                        <div className="flex items-start gap-2">
                          <Package className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <div className="space-y-1">
                            {pledge.rewards && pledge.rewards.length > 0 ? (
                              pledge.rewards.map((reward, index) => (
                                <div key={reward.rewardNo} className="text-gray-600">
                                  {reward.rewardTitle} (x{reward.quantity})
                                </div>
                              ))
                            ) : (
                              <div className="text-gray-600">리워드 없음</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-800">
                          {pledge.totalAmount?.toLocaleString()}원
                        </span>
                        {pledge.additionalAmount > 0 && (
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            +{pledge.additionalAmount.toLocaleString()}원 추가 후원
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        {!loading && !error && pledges.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">아직 후원한 프로젝트가 없습니다.</div>
            <Link 
              href="/project/list" 
              className="inline-block px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              프로젝트 둘러보기
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}