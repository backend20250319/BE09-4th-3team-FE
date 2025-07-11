"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Package, Plus } from "lucide-react"
import Image from "next/image"
import axios from "axios"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function PledgeDetailPage() {
  const { id } = useParams()
  const [pledgeDetail, setPledgeDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPledgeDetail = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const token = sessionStorage.getItem("accessToken")
        if (!token) {
          setError("로그인이 필요합니다.")
          setLoading(false)
          return
        }

        // 후원 상세 정보 가져오기
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pledge/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        console.log('후원 상세 API 응답:', response.data) // 디버깅용 로그

        // 다양한 응답 구조에 대응
        if (response.data.success && response.data.data) {
          setPledgeDetail(response.data.data)
        } else if (response.data.pledgeNo) {
          // 객체가 직접 반환되는 경우
          setPledgeDetail(response.data)
        } else {
          setError("후원 정보를 불러올 수 없습니다.")
        }
      } catch (err) {
        console.error("후원 상세 조회 실패:", err)
        if (err.response?.status === 404) {
          setError("존재하지 않는 후원입니다.")
        } else if (err.response?.status === 401) {
          setError("로그인이 만료되었습니다.")
        } else {
          setError("후원 정보를 불러오는 중 오류가 발생했습니다.")
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPledgeDetail()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">후원 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2 text-red-500">오류 발생</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.history.back()}>이전 페이지로</Button>
        </div>
      </div>
    )
  }

  if (!pledgeDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">후원 정보를 찾을 수 없습니다</h2>
          <p className="text-gray-600">올바른 후원 번호를 확인해주세요.</p>
        </div>
      </div>
    )
  }

  const totalAmount = pledgeDetail.totalAmount || 0
  const additionalAmount = pledgeDetail.additionalAmount || 0
  const rewards = pledgeDetail.rewards || []
  const project = pledgeDetail.project || {}

  // 선물 총 금액 계산
  const rewardsTotalAmount = rewards.reduce((sum, reward) => {
    return sum + (reward.rewardAmount * reward.quantity)
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Project Header */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <div className="flex gap-6">
            <div className="w-48 h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={project.thumbnailUrl || "/placeholder.svg"}
                alt={project.title || "프로젝트 이미지"}
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-2">
                {project.nickname} | {project.creatorName}
              </div>
              <Link href={`/project/detail/${project.projectNo}`}>
                <h1 className="text-2xl font-bold text-gray-800 mb-4 hover:text-red-500 transition-colors cursor-pointer">
                  {project.title}
                </h1>
              </Link>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-xl font-bold">{project.currentAmount?.toLocaleString()}원</span>
                <span className="text-red-500 font-bold">
                  {project.goalAmount ? Math.round((project.currentAmount / project.goalAmount) * 100) : 0}%
                </span>
                <span className="text-sm text-gray-600">• {project.status}</span>
              </div>

              <Button 
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => window.open(`/project/detail/${project.projectNo}`, '_blank')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                프로젝트 문의하기
              </Button>
            </div>
          </div>
        </div>

        {/* Pledge Details */}
        <div className="space-y-6">
          {/* 후원 정보 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">후원 정보</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">프로젝트 상태</span>
                  <span className="font-medium">{project.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">후원 번호</span>
                  <span className="font-medium">{pledgeDetail.pledgeNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">후원 날짜</span>
                  <span className="font-medium">
                    {pledgeDetail.createdAt ? new Date(pledgeDetail.createdAt).toLocaleDateString('ko-KR') : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">프로젝트 종료일</span>
                  <span className="font-medium">
                    {project.deadline ? new Date(project.deadline).toLocaleDateString('ko-KR') : "-"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 선물 정보 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                선택한 선물
              </h2>
              {rewards.length > 0 ? (
                <div className="space-y-4">
                  {rewards.map((reward, index) => (
                    <div key={reward.rewardNo} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800">{reward.rewardTitle}</h3>
                        <span className="text-sm text-gray-500">수량: {reward.quantity}개</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500 mt-1">
                          (개당 {reward.rewardAmount.toLocaleString()}원)
                        </div>
                        <span className="font-medium">{(reward.rewardAmount * reward.quantity).toLocaleString()}원</span>
                      </div>
                    </div>
                  ))}
                  
                  {additionalAmount > 0 && (
                    <div className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          추가 후원금
                        </span>
                        <span className="font-medium text-blue-600">{additionalAmount.toLocaleString()}원</span>
                      </div>
                    </div>
                  )}

                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">선물 총액</span>
                      <span className="font-medium">{rewardsTotalAmount.toLocaleString()}원</span>
                    </div>
                    {additionalAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">추가 후원금</span>
                        <span className="font-medium">{additionalAmount.toLocaleString()}원</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span className="text-gray-800">총 후원 금액</span>
                      <span className="text-red-500">{totalAmount.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>선택된 선물이 없습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 배송 정보 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">배송 정보</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 block mb-1">수령인</span>
                  <span className="font-medium">{pledgeDetail.recipientName}</span>
                </div>
                <div>
                  <span className="text-gray-600 block mb-1">연락처</span>
                  <span className="font-medium">{pledgeDetail.deliveryPhone}</span>
                </div>
                <div>
                  <span className="text-gray-600 block mb-1">배송 주소</span>
                  <span className="font-medium">{pledgeDetail.deliveryAddress}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 후원 목록 보기 버튼 */}
        <div className="text-center mt-8">
          <Link href="/pledges">
            <Button className="bg-gray-600 hover:bg-gray-700 text-white px-20 py-6">
              후원 목록 보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
