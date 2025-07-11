"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageCircle } from "lucide-react"
import Image from "next/image"
import axios from "axios"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SupportDetailPage() {
  const { id } = useParams()
  const [supportDetail, setSupportDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSupportDetail = async () => {
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
          setSupportDetail(response.data.data)
        } else if (response.data.pledgeNo) {
          // 객체가 직접 반환되는 경우
          setSupportDetail(response.data)
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
      fetchSupportDetail()
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

  if (!supportDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">후원 정보를 찾을 수 없습니다</h2>
          <p className="text-gray-600">올바른 후원 번호를 확인해주세요.</p>
        </div>
      </div>
    )
  }

  const totalAmount = supportDetail.totalAmount || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </Button>
        </div>

        {/* Project Header */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <div className="flex gap-6">
            <div className="w-48 h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={supportDetail.projectThumbnail || "/placeholder.svg"}
                alt={supportDetail.projectTitle}
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-2">
                {supportDetail.categoryName} | {supportDetail.creatorName}
              </div>
              <Link href={`/project/detail/${supportDetail.projectNo}`}>
                <h1 className="text-2xl font-bold text-gray-800 mb-4 hover:text-red-500 transition-colors cursor-pointer">
                  {supportDetail.projectTitle}
                </h1>
              </Link>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-xl font-bold">{supportDetail.currentAmount?.toLocaleString()}원</span>
                <span className="text-red-500 font-bold">{supportDetail.fundingRate}%</span>
                <span className="text-sm text-gray-600">• {supportDetail.projectStatus}</span>
              </div>

              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <MessageCircle className="w-4 h-4" />
                창작자 문의
              </Button>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">후원 정보</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">프로젝트 상태</span>
                <span className="text-red-500 font-medium">{supportDetail.projectStatus}</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">후원 상태</span>
                <span className="text-gray-800">{supportDetail.pledgeStatus}</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">후원 번호</span>
                <span className="text-gray-800">{supportDetail.pledgeNo}</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">후원 날짜</span>
                <span className="text-gray-800">
                  {supportDetail.createdAt ? new Date(supportDetail.createdAt).toLocaleDateString('ko-KR') : '-'}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">프로젝트 종료일</span>
                <span className="text-gray-800">
                  {supportDetail.deadline ? new Date(supportDetail.deadline).toLocaleDateString('ko-KR') : '-'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gift Information */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">선물 정보</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-start py-2">
                <span className="text-gray-600">선물 구성</span>
                <div className="text-right">
                  <div className="text-gray-800 font-medium mb-2">{supportDetail.rewardTitle}</div>
                  <div className="text-sm text-gray-600">
                    {supportDetail.rewardDescription}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">선물 금액</span>
                <span className="text-gray-800 font-bold">
                  {supportDetail.rewardAmount ? supportDetail.rewardAmount.toLocaleString() : '0'}원
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Support Information */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">추가 후원 정보</h2>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">추가 후원금</span>
              <span className="text-gray-800 font-bold">
                {supportDetail.additionalAmount ? supportDetail.additionalAmount.toLocaleString() : '0'}원
              </span>
            </div>

            {(!supportDetail.additionalAmount || supportDetail.additionalAmount === 0) && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 text-center">추가 후원금이 없습니다.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total Amount Summary */}
        <div className="mt-8 p-6 bg-white rounded-lg border-2 border-red-100">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">총 후원 금액</span>
            <span className="text-2xl font-bold text-red-500">{totalAmount.toLocaleString()}원</span>
          </div>
        </div>
      </div>
    </div>
  )
}
