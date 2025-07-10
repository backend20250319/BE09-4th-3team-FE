"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Image from "next/image"

export default function MyProjectsPage() {
  const [pledges, setPledges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPledges() {
      setLoading(true)
      setError(null)
      try {
        const token = sessionStorage.getItem("accessToken")
        const res = await fetch("/api/pledge/my", {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        })
        if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.")
        const data = await res.json()
        setPledges(data)
      } catch (err) {
        setError(err.message)
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

      {loading && <div className="text-gray-500">불러오는 중...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Pledge List */}
      <div className="space-y-4">
        {pledges.map((pledge) => (
          <Card key={pledge.pledgeNo} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {/* 프로젝트 이미지는 API에 없으므로 placeholder 사용 */}
                  <Image
                    src={"/placeholder.svg"}
                    alt={pledge.projectTitle}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-gray-500">
                      후원일 {pledge.createdAt ? new Date(pledge.createdAt).toLocaleDateString() : "-"} | 후원번호 {pledge.pledgeNo}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{pledge.projectTitle}</h3>
                  <p className="text-sm text-gray-600 mb-2">{pledge.rewardTitle}</p>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-800">{pledge.totalAmount?.toLocaleString()}원</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    수령인: {pledge.recipientName} / 연락처: {pledge.deliveryPhone} <br />
                    배송지: {pledge.deliveryAddress}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {!loading && pledges.length === 0 && (
          <div className="text-gray-500 text-center py-8">후원 내역이 없습니다.</div>
        )}
      </div>
    </div>
  )
}
