"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, X } from "lucide-react"
import Image from "next/image"
import PledgeHeader from "@/components/header/PledgeHeader"
import axios from "axios"
import { useParams } from "next/navigation"

export default function PledgeSuccessPage() {
  const { projectNo, pledgeId } = useParams();
  const [showFollowModal, setShowFollowModal] = useState(true)
  const [supporterNumber, setSupporterNumber] = useState(null)

  useEffect(() => {
    const fetchSupporterNumber = async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        if (!token) return;
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pledge/${pledgeId}/order`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSupporterNumber(response.data);
      } catch (error) {
        console.error('supporterNumber 불러오기 실패:', error);
      }
    };
    if (pledgeId) fetchSupporterNumber();
  }, [pledgeId]);

  const recommendedProjects = [
    {
      id: 1,
      title: "에그컵바스에서 온 카페바 굿즈",
      category: "CoPlan",
      fundingRate: 28,
      timeLeft: "3일 마감",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "지수 당의보로 장식한 자고리 블라우스",
      category: "서울",
      fundingRate: 404,
      timeLeft: "3일 마감",
      price: "2000원+",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "나를 위한 실전 연애정복 프로젝트",
      category: "커뮤니케이션 컨설팅 회사 글로벌",
      fundingRate: 139,
      timeLeft: "3일 마감",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      title: "안성희원 : 2025 S/S 오피스룩",
      category: "뮤즈시티",
      fundingRate: 401,
      timeLeft: "3일 마감",
      price: "2000원+",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      title: "우니디로즈컬러 해석 가이드",
      category: "서울 타로",
      fundingRate: 68,
      timeLeft: "3일 마감",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      title: "MOAISE 모아세",
      category: "",
      fundingRate: 0,
      timeLeft: "",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <PledgeHeader />

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Success Message */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-red-500">축하합니다. {supporterNumber ? `${supporterNumber} 번째` : ''}</span>
            <br />
            <span className="text-gray-800">공식 후원자가 되셨습니다!</span>
          </h1>
          <p className="text-gray-600 mb-8">
            * 후원 내역 변경은 <span className="text-blue-500 underline cursor-pointer">후원 상세</span>에서 하실 수
            있습니다.
          </p>

          {/* Social Share Buttons */}
          <div className="flex justify-center gap-4">
            <button className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors">
              <div className="w-6 h-6 bg-black rounded-full"></div>
            </button>
            <button className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
              <span className="text-white font-bold">X</span>
            </button>
            <button className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
              <span className="text-white font-bold">f</span>
            </button>
          </div>
        </div>

        {/* Recommended Projects */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">이런 프로젝트도 좋아하실 거예요</h2>
            <button className="text-gray-600 hover:text-gray-800">전체보기</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <CardContent className="p-4">
                  <div className="text-xs text-gray-500 mb-1">{project.category}</div>
                  <h3 className="font-medium text-sm mb-2 line-clamp-2">{project.title}</h3>
                  {project.fundingRate > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-red-500 font-bold">{project.fundingRate}% 달성</span>
                      <span className="text-gray-500">{project.timeLeft}</span>
                    </div>
                  )}
                  {project.price && <div className="text-xs text-gray-600 mt-1">{project.price}</div>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Follow Modal */}
      {/* {showFollowModal && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">지</span>
              </div>
              <div>
                <div className="font-medium">지구인의 다음 프로젝트도 궁금하다면?</div>
                <div className="text-sm text-gray-600">팔로워 15명</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-red-500 hover:bg-red-600 text-white px-6">+ 팔로우</Button>
              <button onClick={() => setShowFollowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  )
}
