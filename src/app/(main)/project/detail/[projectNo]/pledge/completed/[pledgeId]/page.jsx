"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, X } from "lucide-react"
import Image from "next/image"
import PledgeHeader from "@/components/header/PledgeHeader"
import axios from "axios"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function PledgeSuccessPage() {
  const { projectNo, pledgeId } = useParams();
  const [showFollowModal, setShowFollowModal] = useState(true)
  const [supporterNumber, setSupporterNumber] = useState(null)
  const [recommendedProjects, setRecommendedProjects] = useState([])

  // 프로젝트 추천 목록 불러오기
  useEffect(() => {
    const fetchRecommendedProjects = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project/list`, {
          params: { page: 0, size: 6 },
        });
        if (response.data.success) {
          setRecommendedProjects(response.data.data);
        }
      } catch (error) {
        console.error("추천 프로젝트 목록 조회 실패:", error);
      }
    };
    fetchRecommendedProjects();
  }, []);

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
            * 후원 내역 변경은 <Link href={`/pledges/${pledgeId}`}><span className="text-blue-500 underline cursor-pointer">후원 상세</span></Link>에서 하실 수
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
            <Link href="/" className="text-gray-600 hover:text-gray-800">전체보기</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProjects.map((project) => (
              <Link
                key={project.projectNo || project.id}
                href={`/project/detail/${project.projectNo}`}
                className="block"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative">
                    <Image
                      src={project.thumbnailUrl || project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="text-xs text-gray-500 mb-1">{project.categoryName || project.category || ''}</div>
                    <h3 className="font-medium text-sm mb-2 line-clamp-2">{project.title}</h3>
                    {project.achievementRate > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-red-500 font-bold">{project.achievementRate}% 달성</span>
                        <span className="text-gray-500">{project.timeLeft || ''}</span>
                      </div>
                    )}
                    {project.price && <div className="text-xs text-gray-600 mt-1">{project.price}</div>}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
